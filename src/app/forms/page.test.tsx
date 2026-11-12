import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SWRConfig } from "swr";
import { describe, expect, it, vi } from "vitest";
import { authApi } from "@/api/auth";
import { invoiceFormsApi } from "@/api/invoiceForms";
import { saveSession } from "@/lib/session";
import FormsPage from "./page";

function renderPage(invoiceTemplates: string[] = []) {
  vi.spyOn(authApi, "me").mockResolvedValue({ id: "o1", identificationCode: "405310612", email: "a@b.ge", invoiceTemplates });
  saveSession({ token: "abc", expiresAt: new Date(Date.now() + 60_000).toISOString() });
  return render(
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
      <MemoryRouter>
        <FormsPage />
      </MemoryRouter>
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

  it("lists the assigned coded template and links to it", async () => {
    vi.spyOn(invoiceFormsApi, "list").mockResolvedValue([]);
    renderPage(["tatishvili"]);
    const link = await screen.findByRole("link", { name: /ტატიშვილის/ });
    expect(link.getAttribute("href")).toBe("/forms/tatishvili");
  });

  it("shows no templates when none is assigned or the key is unknown", async () => {
    vi.spyOn(invoiceFormsApi, "list").mockResolvedValue([]);
    renderPage(["not-built-yet"]);
    expect(await screen.findByText("ფორმები ჯერ არ არის.")).toBeTruthy();
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("shows an error when loading fails", async () => {
    vi.spyOn(invoiceFormsApi, "list").mockRejectedValue(new Error("500"));
    renderPage();
    expect(await screen.findByText("ფაილების ჩატვირთვა ვერ მოხერხდა.")).toBeTruthy();
  });
});
