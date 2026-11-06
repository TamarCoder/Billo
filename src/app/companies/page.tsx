import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Card } from "@/components/Card/Card";
import { CompanyNameForm } from "@/components/CompanyNameForm/CompanyNameForm";
import { Button } from "@/ui/Button/Button";
import { Input } from "@/ui/Input/Input";
import { Pagination } from "@/ui/Pagination/Pagination";
import { useCompanyPageState } from "@/hooks/useCompanyPageState";
import { useLoadCompanies } from "@/hooks/useLoadCompanies";
import { useCompaniesStore } from "@/store/useCompaniesStore";
import type { InsuranceCompany } from "@/types/invoice";
import styles from "./page.module.scss";

const ITEMS_PER_PAGE = 7;

export default function Companies() {
  const companies = useCompaniesStore((state) => state.companies);
  const loadCompanies = useCompaniesStore((state) => state.loadCompanies);
  const addCompany = useCompaniesStore((state) => state.addCompany);
  const updateCompany = useCompaniesStore((state) => state.updateCompany);
  const removeCompany = useCompaniesStore((state) => state.deleteCompany);
  const {
    storageError,
    setStorageError,
    currentPage,
    setCurrentPage,
    editingId,
    setEditingId,
    isCreating,
    setIsCreating,
    nameDraft,
    setNameDraft,
    search,
    setSearch,
  } = useCompanyPageState();
  useLoadCompanies({ loadCompanies, setError: setStorageError });

  const filteredCompanies = companies.filter((company) =>
    company.name
      .toLocaleLowerCase("ka-GE")
      .includes(search.trim().toLocaleLowerCase("ka-GE")),
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE),
  );
  const visibleCompanies = filteredCompanies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const reportStorageError = (error: unknown, fallback: string) => {
    setStorageError(error instanceof Error ? error.message : fallback);
  };

  const startCreating = () => {
    if (editingId) return;
    try {
      const company = addCompany();
      setSearch("");
      setCurrentPage(Math.ceil((companies.length + 1) / ITEMS_PER_PAGE));
      setEditingId(company.id);
      setIsCreating(true);
      setNameDraft("");
      setStorageError("");
    } catch (error) {
      reportStorageError(error, "კომპანიის დამატება ვერ მოხერხდა. სცადეთ ხელახლა.");
    }
  };

  const startEditing = (company: InsuranceCompany) => {
    setEditingId(company.id);
    setNameDraft(company.name);
    setIsCreating(false);
  };

  const saveName = (name: string, companyId: string) => {
    try {
      updateCompany(companyId, name);
    } catch (error) {
      reportStorageError(error, "კომპანიის შენახვა ვერ მოხერხდა.");
      return;
    }
    setStorageError("");
    setCurrentPage(1);
    setEditingId(null);
    setNameDraft("");
    setIsCreating(false);
  };

  const cancelEdit = (companyId: string) => {
    if (isCreating) {
      try {
        removeCompany(companyId);
      } catch (error) {
        reportStorageError(error, "კომპანიის წაშლა ვერ მოხერხდა.");
        return;
      }
      setCurrentPage((page) =>
        Math.min(
          page,
          Math.max(1, Math.ceil((companies.length - 1) / ITEMS_PER_PAGE)),
        ),
      );
    }
    setEditingId(null);
    setNameDraft("");
    setIsCreating(false);
  };

  const deleteCompany = (companyId: string) => {
    const remainingCompanies = companies.filter(
      (company) => company.id !== companyId,
    );
    try {
      removeCompany(companyId);
      setStorageError("");
    } catch (error) {
      reportStorageError(error, "კომპანიის წაშლა ვერ მოხერხდა.");
      return;
    }

    const query = search.trim().toLocaleLowerCase("ka-GE");
    const remainingFilteredCount = remainingCompanies.filter((company) =>
      company.name.toLocaleLowerCase("ka-GE").includes(query),
    ).length;
    setCurrentPage((page) =>
      Math.min(
        page,
        Math.max(1, Math.ceil(remainingFilteredCount / ITEMS_PER_PAGE)),
      ),
    );
    if (editingId === companyId) {
      setEditingId(null);
      setNameDraft("");
      setIsCreating(false);
    }
  };

  return (
    <main className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="მდებარეობა">
        <div className={styles.breadcrumbPath}>
          <span>კომპანიების მართვა</span>
          <span aria-hidden="true">/</span>
          <span aria-current="page">სადაზღვევო კომპანიები</span>
        </div>
        <div className={styles.pageActions}>
          <label className={styles.searchField}>
            <Search className={styles.searchIcon} size={17} aria-hidden="true" />
            <Input
              className={styles.searchInput}
              size="sm"
              aria-label="კომპანიის ძებნა"
              type="search"
              value={search}
              placeholder="კომპანიის ძებნა"
              onChange={(event) => {
                setSearch(event.currentTarget.value);
                setCurrentPage(1);
              }}
            />
          </label>
          <Button
            className={styles.addCompanyButton}
            type="button"
            size="sm"
            leadingIcon={<Plus size={17} />}
            disabled={editingId !== null}
            onClick={startCreating}
          >
            სადაზღვევოს დამატება
          </Button>
        </div>
      </nav>

      <Card className={styles.listCard} padding="sm">
        {storageError && (
          <p className={styles.storageError} role="alert">
            {storageError}
          </p>
        )}
        <div className={styles.companyList} aria-label="სადაზღვევო კომპანიების სია">
          {visibleCompanies.map((company) => {
            const isEditing = company.id === editingId;

            return (
              <article
                className={`${styles.companyItem} ${isEditing ? styles.editingItem : ""}`}
                key={company.id}
              >
                {isEditing ? (
                  <CompanyNameForm
                    name={nameDraft}
                    onNameChange={setNameDraft}
                    onSubmit={(name) => saveName(name, company.id)}
                    onCancel={() => cancelEdit(company.id)}
                  />
                ) : (
                  <>
                    <strong className={styles.companyName}>{company.name}</strong>
                    <div className={styles.itemActions}>
                      <button
                        type="button"
                        className={styles.iconButton}
                        aria-label={`${company.name} სახელის რედაქტირება`}
                        onClick={() => startEditing(company)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        className={styles.iconButton}
                        aria-label={`${company.name} წაშლა`}
                        onClick={() => deleteCompany(company.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </article>
            );
          })}
          {filteredCompanies.length === 0 && (
            <p className={styles.emptyState}>
              {companies.length === 0
                ? "კომპანიები ჯერ არ არის დამატებული."
                : "კომპანია ვერ მოიძებნა."}
            </p>
          )}
        </div>
        {filteredCompanies.length > ITEMS_PER_PAGE && (
          <Pagination
            className={styles.pagination}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredCompanies.length}
            onPageChange={setCurrentPage}
            aria-label="სადაზღვევო კომპანიების გვერდები"
          />
        )}
      </Card>
    </main>
  );
}
