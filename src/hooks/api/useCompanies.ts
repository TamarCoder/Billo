import useSWR from "swr";
import { getSessionToken } from "@/lib/session";
import { API_ENDPOINTS } from "@/api/endpoints";
import { companiesApi } from "@/api/companies";

export function useCompanies() {
  return useSWR(getSessionToken() ? API_ENDPOINTS.companies : null, companiesApi.list);
}
