import { API_ENDPOINTS } from "@/api/endpoints";
import { fetcher } from "@/lib/fetcher";

export interface OrganizationAccount {
  id: string;
  identificationCode: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
  organization: OrganizationAccount;
}

export const authApi = {
  register: (input: { identificationCode: string; email: string; password: string }) =>
    fetcher<OrganizationAccount>(API_ENDPOINTS.authRegister, {
      method: "POST",
      body: JSON.stringify(input),
    }),

  login: (input: { identificationCode: string; password: string }) =>
    fetcher<LoginResponse>(API_ENDPOINTS.authLogin, {
      method: "POST",
      body: JSON.stringify(input),
    }),

  logout: () => fetcher<void>(API_ENDPOINTS.authLogout, { method: "POST" }),

  me: () => fetcher<OrganizationAccount>(API_ENDPOINTS.authMe),
};
