import { API_ENDPOINTS } from "@/api/endpoints";
import { fetcher } from "@/lib/fetcher";
import type { Issuer } from "@/types/api";
import type { OrganizationSettings } from "@/types/invoice";

export const issuersApi = {
  list: () => fetcher<Issuer[]>(API_ENDPOINTS.issuers),

  create: (input: OrganizationSettings) =>
    fetcher<Issuer>(API_ENDPOINTS.issuers, {
      method: "POST",
      body: JSON.stringify(input),
    }),

  update: (id: string, input: OrganizationSettings) =>
    fetcher<Issuer>(API_ENDPOINTS.issuer(id), {
      method: "PUT",
      body: JSON.stringify(input),
    }),

  remove: (id: string) => fetcher<void>(API_ENDPOINTS.issuer(id), { method: "DELETE" }),
};
