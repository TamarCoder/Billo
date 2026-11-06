import type { FieldError, Resolver } from "react-hook-form";
import type { OrganizationSettings } from "@/types/invoice";

const requiredMessages = {
  title: "ორგანიზაციის სახელი სავალდებულოა.",
  issuerAddress: "მისამართი სავალდებულოა.",
  issuerIdentificationNumber: "საიდენტიფიკაციო კოდი სავალდებულოა.",
  bankName: "ბანკის სახელი სავალდებულოა.",
  bankCode: "ბანკის კოდი სავალდებულოა.",
  bankAccount: "ანგარიშის ნომერი სავალდებულოა.",
} satisfies Record<keyof OrganizationSettings, string>;

export const organizationSettingsResolver: Resolver<OrganizationSettings> =
  async (values) => {
    const errors: Partial<Record<keyof OrganizationSettings, FieldError>> = {};

    for (const field of Object.keys(requiredMessages) as Array<
      keyof OrganizationSettings
    >) {
      if (!values[field].trim()) {
        errors[field] = {
          type: "required",
          message: requiredMessages[field],
        };
      }
    }

    if (Object.keys(errors).length > 0) {
      return { values: {}, errors };
    }

    return { values, errors: {} };
  };
