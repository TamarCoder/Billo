import type { InsuranceCompany } from "@/types/invoice";

export const INSURANCE_COMPANIES_KEY = "billo-insurance-companies";

export function readCompanies(): InsuranceCompany[] {
  const stored = window.localStorage.getItem(INSURANCE_COMPANIES_KEY);
  if (stored === null) return [];

  const companies: unknown = JSON.parse(stored);
  if (
    !Array.isArray(companies) ||
    !companies.every(
      (company) =>
        typeof company?.id === "string" && typeof company?.name === "string",
    )
  ) {
    throw new Error("შენახული კომპანიების სია დაზიანებულია.");
  }

  const actualCompanies = companies.filter(
    (company) =>
      !(
        /^insurer-\d+$/u.test(company.id) &&
        company.name === `სადაზღვევო კომპანია ${company.id.slice(8)}`
      ),
  );
  if (actualCompanies.length !== companies.length) {
    writeCompanies(actualCompanies);
  }
  return actualCompanies;
}

export function writeCompanies(companies: InsuranceCompany[]): void {
  window.localStorage.setItem(
    INSURANCE_COMPANIES_KEY,
    JSON.stringify(companies),
  );
}
