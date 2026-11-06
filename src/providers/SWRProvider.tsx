"use client";

import { SWRConfig } from "swr";
import type { ReactNode } from "react";
import { ApiKeyGate } from "@/components/ApiKeyGate/ApiKeyGate";
import { fetcher } from "@/lib/fetcher";

export function SWRProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: (path: string) => fetcher(path),
        revalidateOnFocus: false,
        shouldRetryOnError: false,
      }}
    >
      <ApiKeyGate>{children}</ApiKeyGate>
    </SWRConfig>
  );
}
