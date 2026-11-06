import {
  INVOICE_HISTORY_KEY,
  ORGANIZATION_SETTINGS_KEY,
  readInvoiceHistory,
  readOrganizationSettings,
} from "@/lib/invoiceStorage";
import {
  INSURANCE_COMPANIES_KEY,
  readCompanies,
} from "@/lib/companyStorage";
import {
  API_KEY_HEADER,
  apiKeyHeaders,
  getApiKey,
  requireApiKey,
} from "@/lib/apiKey";

// Base URL of Billo--Backend. Set VITE_API_URL in .env.local.
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
const LOCAL_DATA_IMPORT_KEY = "billo-local-data-imported-v1";

let localImportPromise: Promise<void> | null = null;

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
    message = `Request failed with status ${status}`,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function ensureLocalDataImported(): Promise<void> {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem(LOCAL_DATA_IMPORT_KEY) === "true") return;
  if (localImportPromise) return localImportPromise;

  localImportPromise = (async () => {
    const companiesExist =
      window.localStorage.getItem(INSURANCE_COMPANIES_KEY) !== null;
    const invoicesExist =
      window.localStorage.getItem(INVOICE_HISTORY_KEY) !== null;
    const settingsExist =
      window.localStorage.getItem(ORGANIZATION_SETTINGS_KEY) !== null;
    if (!companiesExist && !invoicesExist && !settingsExist) {
      window.localStorage.setItem(LOCAL_DATA_IMPORT_KEY, "true");
      return;
    }

    const data: {
      source: string;
      companies?: ReturnType<typeof readCompanies>;
      invoices?: ReturnType<typeof readInvoiceHistory>;
      settings?: ReturnType<typeof readOrganizationSettings>;
    } = { source: window.location.origin };
    if (companiesExist) data.companies = readCompanies();
    if (invoicesExist) data.invoices = readInvoiceHistory();
    if (settingsExist) data.settings = readOrganizationSettings();

    let response: Response;
    try {
      response = await fetch(
        `${API_URL.replace(/\/+$/u, "")}/api/migration/import-local-data`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...apiKeyHeaders(),
          },
          body: JSON.stringify(data),
        },
      );
    } catch (error) {
      throw new Error(
        "ძველი მონაცემების გადატანა ვერ მოხერხდა — backend-თან კავშირი ვერ დამყარდა.",
        { cause: error },
      );
    }

    if (response.status === 401) requireApiKey();

    const responseText = await response.text();
    let body: unknown = null;
    if (responseText) {
      try {
        body = JSON.parse(responseText) as unknown;
      } catch {
        throw new ApiError(
          response.status,
          responseText,
          "ძველი მონაცემების გადატანის API-მ არასწორი პასუხი დააბრუნა.",
        );
      }
    }
    if (!response.ok) {
      const message =
        typeof body === "object" &&
        body !== null &&
        "message" in body &&
        typeof body.message === "string"
          ? body.message
          : `ძველი მონაცემების გადატანა ვერ მოხერხდა (${response.status}).`;
      throw new ApiError(response.status, body, message);
    }

    window.localStorage.setItem(LOCAL_DATA_IMPORT_KEY, "true");
  })();

  try {
    await localImportPromise;
  } finally {
    localImportPromise = null;
  }
}

export async function fetcher<T>(path: string, init?: RequestInit): Promise<T> {
  await ensureLocalDataImported();
  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");
  const apiKey = getApiKey();
  if (apiKey) headers.set(API_KEY_HEADER, apiKey);
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const baseUrl = API_URL.replace(/\/+$/u, "");
  const endpoint = path.startsWith("/") ? path : `/${path}`;
  const res = await fetch(`${baseUrl}${endpoint}`, {
    ...init,
    headers,
  });
  if (res.status === 401) requireApiKey();
  const responseText = res.status === 204 ? "" : await res.text();
  let body: unknown = null;

  if (responseText) {
    try {
      body = JSON.parse(responseText) as unknown;
    } catch {
      if (res.ok) {
        throw new ApiError(
          res.status,
          responseText,
          "The API returned an invalid JSON response.",
        );
      }
      body = responseText;
    }
  }

  if (!res.ok) {
    const message =
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof body.message === "string"
        ? body.message
        : `Request failed with status ${res.status}`;
    throw new ApiError(res.status, body, message);
  }
  if (res.status !== 204 && body === null) {
    throw new ApiError(res.status, body, "The API returned an empty response.");
  }

  return body as T;
}
