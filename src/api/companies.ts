import { API_ENDPOINTS } from "@/api/endpoints";
import { fetcher } from "@/lib/fetcher";
import type {
  CompanyListResponse,
  CompanyResponse,
  CreateInsuranceCompanyRequest,
  UpdateInsuranceCompanyRequest,
} from "@/types/api";

export const companiesApi = {
  list: () => fetcher<CompanyListResponse>(API_ENDPOINTS.companies),

  create: (input: CreateInsuranceCompanyRequest) =>
    fetcher<CompanyResponse>(API_ENDPOINTS.companies, {
      method: "POST",
      body: JSON.stringify(input),
    }),

  update: (id: string, input: UpdateInsuranceCompanyRequest) =>
    fetcher<CompanyResponse>(API_ENDPOINTS.company(id), {
      method: "PUT",
      body: JSON.stringify(input),
    }),

  delete: (id: string) =>
    fetcher<void>(API_ENDPOINTS.company(id), { method: "DELETE" }),
};
