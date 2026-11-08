import useSWRMutation from "swr/mutation";
import { useSWRConfig } from "swr";
import { API_ENDPOINTS } from "@/api/endpoints";
import { companiesApi } from "@/api/companies";
import type {
  CreateCompanyRequest,
  UpdateCompanyRequest,
} from "@/types/api";

type UpdateCompanyInput = {
  id: string;
  values: UpdateCompanyRequest;
};

export function useCompanyMutations() {
  const { mutate } = useSWRConfig();
  const { trigger: create, isMutating: isCreating } = useSWRMutation(
    API_ENDPOINTS.companies,
    (_key, { arg }: { arg: CreateCompanyRequest }) =>
      companiesApi.create(arg),
  );
  const { trigger: update, isMutating: isUpdating } = useSWRMutation(
    API_ENDPOINTS.companies,
    (_key, { arg }: { arg: UpdateCompanyInput }) =>
      companiesApi.update(arg.id, arg.values),
  );
  const { trigger: remove, isMutating: isDeleting } = useSWRMutation(
    API_ENDPOINTS.companies,
    (_key, { arg }: { arg: string }) => companiesApi.delete(arg),
  );

  const createCompany = async (input: CreateCompanyRequest) => {
    const company = await create(input);
    await mutate(API_ENDPOINTS.companies);
    return company;
  };
  const updateCompany = async (
    id: string,
    values: UpdateCompanyRequest,
  ) => {
    const company = await update({ id, values });
    await mutate(API_ENDPOINTS.companies);
    return company;
  };
  const deleteCompany = async (id: string) => {
    await remove(id);
    await mutate(API_ENDPOINTS.companies);
  };

  return {
    createCompany,
    updateCompany,
    deleteCompany,
    isMutating: isCreating || isUpdating || isDeleting,
  };
}
