export const API_ENDPOINTS = {
  companies: "/api/companies",
  company: (id: string) => `/api/companies/${encodeURIComponent(id)}`,
  invoices: "/api/invoices",
  invoice: (id: string) => `/api/invoices/${encodeURIComponent(id)}`,
  invoiceStatus: (id: string) =>
    `/api/invoices/${encodeURIComponent(id)}/status`,
  settings: "/api/settings",
} as const;
