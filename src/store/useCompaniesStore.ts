import { create } from "zustand";
import { readCompanies, writeCompanies } from "@/lib/companyStorage";
import type { InsuranceCompany } from "@/types/invoice";

interface CompaniesState {
  companies: InsuranceCompany[];
  loadCompanies: () => void;
  addCompany: () => InsuranceCompany;
  updateCompany: (id: string, name: string) => void;
  deleteCompany: (id: string) => void;
}

export const useCompaniesStore = create<CompaniesState>()((set, get) => ({
  companies: [],
  loadCompanies: () => set({ companies: readCompanies() }),
  addCompany: () => {
    const company = { id: crypto.randomUUID(), name: "" };
    const companies = [...get().companies, company];
    writeCompanies(companies);
    set({ companies });
    return company;
  },
  updateCompany: (id, name) => {
    const currentCompanies = get().companies;
    if (!currentCompanies.some((company) => company.id === id)) {
      throw new Error("კომპანია ვერ მოიძებნა.");
    }

    const companies = currentCompanies.map((company) =>
      company.id === id ? { ...company, name } : company,
    );
    writeCompanies(companies);
    set({ companies });
  },
  deleteCompany: (id) => {
    const currentCompanies = get().companies;
    if (!currentCompanies.some((company) => company.id === id)) {
      throw new Error("კომპანია ვერ მოიძებნა.");
    }

    const companies = currentCompanies.filter((company) => company.id !== id);
    writeCompanies(companies);
    set({ companies });
  },
}));
