export const API_ENDPOINTS = {
  companies: "/api/companies",
  company: (id: string) => `/api/companies/${encodeURIComponent(id)}`,
  invoices: "/api/invoices",
  invoice: (id: string) => `/api/invoices/${encodeURIComponent(id)}`,
  invoiceStatus: (id: string) =>
    `/api/invoices/${encodeURIComponent(id)}/status`,
  settings: "/api/settings",
  issuers: "/api/issuers",
  issuer: (id: string) => `/api/issuers/${encodeURIComponent(id)}`,
  invoiceForms: "/api/invoice-forms",
  invoiceFormFile: (id: string) =>
    `/api/invoice-forms/${encodeURIComponent(id)}/file`,
  invoiceFormApprove: (id: string) =>
    `/api/invoice-forms/${encodeURIComponent(id)}/approve`,
  invoiceFormRequestChanges: (id: string) =>
    `/api/invoice-forms/${encodeURIComponent(id)}/request-changes`,
  authRegister: "/api/auth/register",
  authLogin: "/api/auth/login",
  authLogout: "/api/auth/logout",
  authMe: "/api/auth/me",
} as const;
