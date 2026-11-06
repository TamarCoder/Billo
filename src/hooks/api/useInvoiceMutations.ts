import useSWRMutation from "swr/mutation";
import { useSWRConfig } from "swr";
import { API_ENDPOINTS } from "@/api/endpoints";
import { invoicesApi } from "@/api/invoices";
import type {
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  UpdateInvoiceStatusRequest,
} from "@/types/api";

type InvoiceUpdateInput = {
  id: string;
  values: UpdateInvoiceRequest;
};

type InvoiceStatusInput = {
  id: string;
  values: UpdateInvoiceStatusRequest;
};

export function useInvoiceMutations() {
  const { mutate } = useSWRConfig();
  const { trigger: create, isMutating: isCreating } = useSWRMutation(
    API_ENDPOINTS.invoices,
    (_key, { arg }: { arg: CreateInvoiceRequest }) => invoicesApi.create(arg),
  );
  const { trigger: update, isMutating: isUpdating } = useSWRMutation(
    API_ENDPOINTS.invoices,
    (_key, { arg }: { arg: InvoiceUpdateInput }) =>
      invoicesApi.update(arg.id, arg.values),
  );
  const { trigger: updateStatus, isMutating: isUpdatingStatus } =
    useSWRMutation(
      API_ENDPOINTS.invoices,
      (_key, { arg }: { arg: InvoiceStatusInput }) =>
        invoicesApi.updateStatus(arg.id, arg.values),
    );
  const { trigger: remove, isMutating: isDeleting } = useSWRMutation(
    API_ENDPOINTS.invoices,
    (_key, { arg }: { arg: string }) => invoicesApi.delete(arg),
  );

  const createInvoice = async (input: CreateInvoiceRequest) => {
    const invoice = await create(input);
    await mutate(API_ENDPOINTS.invoices);
    return invoice;
  };
  const updateInvoice = async (id: string, values: UpdateInvoiceRequest) => {
    const invoice = await update({ id, values });
    await mutate(API_ENDPOINTS.invoices);
    return invoice;
  };
  const changeInvoiceStatus = async (
    id: string,
    values: UpdateInvoiceStatusRequest,
  ) => {
    const invoice = await updateStatus({ id, values });
    await mutate(API_ENDPOINTS.invoices);
    return invoice;
  };
  const deleteInvoice = async (id: string) => {
    await remove(id);
    await mutate(API_ENDPOINTS.invoices);
  };

  return {
    createInvoice,
    updateInvoice,
    changeInvoiceStatus,
    deleteInvoice,
    isMutating:
      isCreating || isUpdating || isUpdatingStatus || isDeleting,
  };
}
