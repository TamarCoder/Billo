import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import { storage } from "./memoryStorage";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  storage.clear();
});
