import { describe, expect, it, vi } from "vitest";
import { ApiError, fetchBlob, fetcher } from "@/lib/fetcher";
import { getSessionToken, saveSession, SESSION_REQUIRED_EVENT } from "@/lib/session";

const future = new Date(Date.now() + 60_000).toISOString();

function mockFetch(response: Response) {
  const fetchMock = vi.fn().mockResolvedValue(response);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("fetcher", () => {
  it("sends the session token and parses JSON", async () => {
    saveSession({ token: "abc", expiresAt: future });
    const fetchMock = mockFetch(new Response('{"ok":true}', { status: 200 }));

    await expect(fetcher("/api/x")).resolves.toEqual({ ok: true });
    const headers = fetchMock.mock.calls[0][1].headers as Headers;
    expect(headers.get("Authorization")).toBe("Bearer abc");
  });

  it("uses the server's message on errors", async () => {
    mockFetch(new Response('{"message":"ცუდი მოთხოვნა"}', { status: 400 }));
    await expect(fetcher("/api/x")).rejects.toMatchObject({ status: 400, message: "ცუდი მოთხოვნა" });
  });

  it("ends the session on 401", async () => {
    saveSession({ token: "abc", expiresAt: future });
    const listener = vi.fn();
    window.addEventListener(SESSION_REQUIRED_EVENT, listener);
    mockFetch(new Response('{"message":"Session expired"}', { status: 401 }));

    await expect(fetcher("/api/x")).rejects.toBeInstanceOf(ApiError);
    expect(getSessionToken()).toBeNull();
    expect(listener).toHaveBeenCalledOnce();
    window.removeEventListener(SESSION_REQUIRED_EVENT, listener);
  });
});

describe("fetchBlob", () => {
  it("returns the file with the token attached", async () => {
    saveSession({ token: "abc", expiresAt: future });
    const fetchMock = mockFetch(new Response("PDF", { status: 200 }));

    const blob = await fetchBlob("/api/invoice-forms/1/file");
    expect(blob.size).toBe(3);
    expect((fetchMock.mock.calls[0][1].headers as Headers).get("Authorization")).toBe("Bearer abc");
  });

  it("throws a Georgian message when the download fails", async () => {
    mockFetch(new Response("", { status: 404 }));
    await expect(fetchBlob("/x")).rejects.toThrow("ფაილის ჩამოტვირთვა ვერ მოხერხდა.");
  });
});
