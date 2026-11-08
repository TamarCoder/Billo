import { readFile, rm, writeFile } from "node:fs/promises";
import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  net,
  protocol,
  safeStorage,
  shell,
  type IpcMainInvokeEvent,
} from "electron";
import path from "node:path";
import { pathToFileURL } from "node:url";

const isDev = !app.isPackaged;
const DEV_URL = "http://localhost:3000";
const APP_SCHEME = "app";
// Packaged app loads the live frontend so updates arrive on reload; the bundled copy is the offline fallback.
const REMOTE_URL = "https://billo-three.vercel.app";
const LOCAL_URL = `${APP_SCHEME}://-/`;
const OUT_DIR = path.join(__dirname, "..", "out");
const ICON_PATH = app.isPackaged
  ? path.join(app.getAppPath(), "out", "icon.png")
  : path.join(app.getAppPath(), "public", "icon.png");

// Saved login, encrypted with the OS keychain (safeStorage); never readable as plain text on disk.
const savedLoginPath = () => path.join(app.getPath("userData"), "saved-login.bin");

function isAppUrl(raw: string): boolean {
  const url = new URL(raw);
  if (isDev) return url.origin === DEV_URL;
  return url.origin === REMOTE_URL || (url.protocol === `${APP_SCHEME}:` && url.host === "-");
}

function isAppWindowSender(event: IpcMainInvokeEvent): boolean {
  const frame = event.senderFrame;
  if (!frame || frame !== event.sender.mainFrame) return false;
  return isAppUrl(frame.url);
}

function registerSavedLoginHandlers() {
  ipcMain.handle("login:save", async (event, code: unknown, password: unknown) => {
    if (!isAppWindowSender(event)) throw new Error("Not allowed.");
    if (typeof code !== "string" || typeof password !== "string") throw new Error("Invalid login.");
    if (!safeStorage.isEncryptionAvailable()) return { saved: false };
    const encrypted = safeStorage.encryptString(JSON.stringify({ code, password }));
    await writeFile(savedLoginPath(), encrypted, { mode: 0o600 });
    return { saved: true };
  });

  ipcMain.handle("login:load", async (event) => {
    if (!isAppWindowSender(event)) throw new Error("Not allowed.");
    try {
      const encrypted = await readFile(savedLoginPath());
      const login = JSON.parse(safeStorage.decryptString(encrypted)) as unknown;
      if (
        typeof login === "object" && login !== null &&
        "code" in login && typeof login.code === "string" &&
        "password" in login && typeof login.password === "string"
      ) {
        return { code: login.code, password: login.password };
      }
    } catch {
      // No saved login, or it can no longer be decrypted.
    }
    return null;
  });

  ipcMain.handle("login:clear", async (event) => {
    if (!isAppWindowSender(event)) throw new Error("Not allowed.");
    await rm(savedLoginPath(), { force: true });
  });
}

// Must run before the app is ready.
protocol.registerSchemesAsPrivileged([
  {
    scheme: APP_SCHEME,
    privileges: { standard: true, secure: true, supportFetchAPI: true },
  },
]);

function registerAppProtocol(): void {
  protocol.handle(APP_SCHEME, (request) => {
    const { pathname } = new URL(request.url);
    let filePath = path.normalize(path.join(OUT_DIR, decodeURIComponent(pathname)));

    // Block path traversal outside ./out
    if (!filePath.startsWith(OUT_DIR)) {
      return new Response("Forbidden", { status: 403 });
    }
    if (!path.extname(filePath)) {
      filePath = path.join(OUT_DIR, "index.html");
    }
    return net.fetch(pathToFileURL(filePath).toString());
  });
}

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: "Billo",
    titleBarStyle: "hidden",
    ...(process.platform === "darwin" && {
      trafficLightPosition: { x: 12, y: 12 },
    }),
    titleBarOverlay:
      process.platform === "darwin"
        ? undefined
        : { color: "#252525", symbolColor: "#ffffff", height: 40 },
    icon: ICON_PATH,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  win.once("ready-to-show", () => win.show());

  // Links to other sites open in the system browser, not inside the app.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://")) void shell.openExternal(url);
    return { action: "deny" };
  });

  // The app window may only show our own pages.
  win.webContents.on("will-navigate", (event, url) => {
    if (!isAppUrl(url)) event.preventDefault();
  });

  if (isDev) {
    void win.loadURL(DEV_URL);
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    win.loadURL(REMOTE_URL).catch(() => win.loadURL(LOCAL_URL));
  }
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on("second-instance", () => {
    const [win] = BrowserWindow.getAllWindows();
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  app.whenReady().then(() => {
    ipcMain.handle("app:get-version", () => app.getVersion());
    registerSavedLoginHandlers();
    ipcMain.handle("invoice:export-pdf", async (event) => {
      const window = BrowserWindow.fromWebContents(event.sender);
      if (!window || !isAppWindowSender(event)) {
        throw new Error("Invoice PDF export is only available to the app window.");
      }

      const { canceled, filePath } = await dialog.showSaveDialog(window, {
        title: "ინვოისის PDF ექსპორტი",
        defaultPath: "invoice.pdf",
        filters: [{ name: "PDF", extensions: ["pdf"] }],
      });
      if (canceled || !filePath) return { status: "canceled" as const };

      const pdf = await window.webContents.printToPDF({
        pageSize: "A4",
        landscape: true,
        printBackground: true,
        preferCSSPageSize: true,
      });
      await writeFile(filePath, pdf);
      return { status: "saved" as const };
    });
    if (process.platform === "darwin") app.dock?.setIcon(ICON_PATH);
    if (!isDev) registerAppProtocol();
    createWindow();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
}
