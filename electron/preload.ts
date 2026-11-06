import { contextBridge, ipcRenderer } from "electron";

// The only Electron features the web page can use.
// Add new ones here and in src/types/electron.d.ts.
const api = {
  platform: process.platform,
  getVersion: (): Promise<string> => ipcRenderer.invoke("app:get-version"),
};

contextBridge.exposeInMainWorld("electron", api);

export type ElectronApi = typeof api;
