import type { Metadata } from "next";
import { SWRProvider } from "@/providers/SWRProvider";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Billo",
  description: "Billo desktop app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ka">
      <body>
        <SWRProvider>{children}</SWRProvider>
      </body>
    </html>
  );
}
