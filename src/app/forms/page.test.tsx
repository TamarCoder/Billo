import { render, screen } from "@testing-library/react";
import { SWRConfig } from "swr";
import { describe, expect, it, vi } from "vitest";
import { invoiceFormsApi } from "@/api/invoiceForms";
import { saveSession } from "@/lib/session";
import FormsPage from "./page";

function renderPage() {
  saveSession({ token: "abc", expiresAt: new Date(Date.now() + 60_000).toISOString() });
  return render(
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
      <FormsPage />
    </SWRConfig>,
  );
}

describe("Forms page", () => {
  it("lists the organization's forms", async () => {
    vi.spyOn(invoiceFormsApi, "list").mockResolvedValue([
      { id: "f1", organizationId: "o1", fileName: "ფორმა-1.pdf", mimeType: "application/pdf", size: 1000, createdAt: "2026-11-01T10:00:00.000Z" },
    ]);
    renderPage();
    expect(await screen.findByText("ფორმა-1.pdf")).toBeTruthy();
  });

  it("shows an error when loading fails", async () => {
    vi.spyOn(invoiceFormsApi, "list").mockRejectedValue(new Error("500"));
    renderPage();
    expect(await screen.findByText("ფორმების ჩატვირთვა ვერ მოხერხდა.")).toBeTruthy();
  });
});
