"use client";

import { useSyncExternalStore } from "react";

export function WindowTitleBar() {
  const isElectron = useSyncExternalStore(
    () => () => {},
    () => Boolean(window.electron),
    () => false,
  );

  if (!isElectron) return null;

  return (
    <header className="window-titlebar">
      <div className="window-titlebar__brand">
        <img src="/icon.png" alt="" width={24} height={24} />
        <span>BILLO</span>
      </div>
    </header>
  );
}
