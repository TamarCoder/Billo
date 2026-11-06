import type { ElectronApi } from "../../electron/preload";

declare global {
  interface Window {
    // undefined when the page runs in a normal browser (npm run dev without Electron)
    electron?: ElectronApi;
  }
}

export {};
