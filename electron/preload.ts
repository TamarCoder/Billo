import { contextBridge, ipcRenderer } from "electron";

// Add new ones here and in src/types/electron.d.ts.
const api = {
  platform: process.platform,
  getVersion: (): Promise<string> => ipcRenderer.invoke("app:get-version"),
  exportInvoicePdf: (): Promise<{ status: "saved" | "canceled" }> =>
    ipcRenderer.invoke("invoice:export-pdf"),
  saveLogin: (code: string, password: string): Promise<{ saved: boolean }> =>
    ipcRenderer.invoke("login:save", code, password),
  loadLogin: (): Promise<{ code: string; password: string } | null> =>
    ipcRenderer.invoke("login:load"),
  clearLogin: (): Promise<void> => ipcRenderer.invoke("login:clear"),
};

contextBridge.exposeInMainWorld("electron", api);

export type ElectronApi = typeof api;
