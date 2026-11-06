import useSWR from "swr";
import { API_ENDPOINTS } from "@/api/endpoints";
import { companiesApi } from "@/api/companies";

export function useCompanies() {
  return useSWR(API_ENDPOINTS.companies, companiesApi.list);
}
