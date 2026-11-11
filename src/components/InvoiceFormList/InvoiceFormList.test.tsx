import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import * as saveBlobModule from "@/lib/saveBlob";
import type { InvoiceFormFile } from "@/types/api";
import { InvoiceFormList } from "./InvoiceFormList";

const form: InvoiceFormFile = {
  id: "f1",
  organizationId: "o1",
  fileName: "ინვოისი.pdf",
  mimeType: "application/pdf",
  size: 2 * 1024 * 1024,
  createdAt: "2026-11-01T10:00:00.000Z",
};

describe("InvoiceFormList", () => {
  it("says so when there are no forms", () => {
    render(<InvoiceFormList forms={[]} download={vi.fn()} onError={vi.fn()} />);
    expect(screen.getByText("ფორმები ჯერ არ არის ატვირთული.")).toBeTruthy();
  });

  it("shows the file name and size", () => {
    render(<InvoiceFormList forms={[form]} download={vi.fn()} onError={vi.fn()} />);
    expect(screen.getByText("ინვოისი.pdf")).toBeTruthy();
    expect(screen.getByText(/2\.0 MB/)).toBeTruthy();
  });

  it("downloads and saves the file under its own name", async () => {
    const save = vi.spyOn(saveBlobModule, "saveBlob").mockImplementation(() => undefined);
    const blob = new Blob(["x"]);
    const download = vi.fn().mockResolvedValue(blob);
    render(<InvoiceFormList forms={[form]} download={download} onError={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "ჩამოტვირთვა" }));
    await waitFor(() => expect(save).toHaveBeenCalledWith(blob, "ინვოისი.pdf"));
    expect(download).toHaveBeenCalledWith(form);
  });

  it("reports a failed download", async () => {
    const onError = vi.fn();
    const download = vi.fn().mockRejectedValue(new Error("ქსელის შეცდომა"));
    render(<InvoiceFormList forms={[form]} download={download} onError={onError} />);

    fireEvent.click(screen.getByRole("button", { name: "ჩამოტვირთვა" }));
    await waitFor(() => expect(onError).toHaveBeenCalledWith("ქსელის შეცდომა"));
  });

  it("shows delete only when onDelete is given", () => {
    const { rerender } = render(<InvoiceFormList forms={[form]} download={vi.fn()} onError={vi.fn()} />);
    expect(screen.queryByRole("button", { name: "წაშლა" })).toBeNull();

    const onDelete = vi.fn();
    rerender(<InvoiceFormList forms={[form]} download={vi.fn()} onError={vi.fn()} onDelete={onDelete} />);
    fireEvent.click(screen.getByRole("button", { name: "წაშლა" }));
    expect(onDelete).toHaveBeenCalledWith(form);
  });
});
