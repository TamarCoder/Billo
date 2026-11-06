import { writeFile } from "node:fs/promises";
import { app, BrowserWindow, dialog, ipcMain, net, protocol, shell } from "electron";
import path from "node:path";
import { pathToFileURL } from "node:url";

const isDev = !app.isPackaged;
const DEV_URL = "http://localhost:3000";
const APP_SCHEME = "app";
const OUT_DIR = path.join(__dirname, "..", "out");
const ICON_PATH = app.isPackaged
  ? path.join(app.getAppPath(), "out", "icon.png")
  : path.join(app.getAppPath(), "public", "icon.png");

// Must run before the app is ready.
protocol.registerSchemesAsPrivileged([
  {
    scheme: APP_SCHEME,
    privileges: { standard: true, secure: true, supportFetchAPI: true },
  },
]);

// Serve the Vite single-page app from ./out with app://-/...
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
    const allowed = isDev ? url.startsWith(DEV_URL) : url.startsWith(`${APP_SCHEME}://`);
    if (!allowed) event.preventDefault();
  });

  if (isDev) {
    void win.loadURL(DEV_URL);
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    void win.loadURL(`${APP_SCHEME}://-/`);
  }
}

// Only one copy of the app may run.
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
    ipcMain.handle("invoice:export-pdf", async (event) => {
      const senderFrame = event.senderFrame;
      if (!senderFrame || senderFrame !== event.sender.mainFrame) {
        throw new Error("Invoice PDF export is only available to the app window.");
      }

      const senderUrl = new URL(senderFrame.url);
      const isAllowedSender =
        (isDev && senderUrl.origin === DEV_URL) ||
        (!isDev && senderUrl.protocol === `${APP_SCHEME}:` && senderUrl.host === "-");
      const window = BrowserWindow.fromWebContents(event.sender);

      if (!window || !isAllowedSender) {
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
