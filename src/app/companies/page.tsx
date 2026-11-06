import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Card } from "@/components/Card/Card";
import { CompanyNameForm } from "@/components/CompanyNameForm/CompanyNameForm";
import { Button } from "@/ui/Button/Button";
import { Input } from "@/ui/Input/Input";
import { Pagination } from "@/ui/Pagination/Pagination";
import { useCompanyPageState } from "@/hooks/useCompanyPageState";
import { useCompanies } from "@/hooks/api/useCompanies";
import { useCompanyMutations } from "@/hooks/api/useCompanyMutations";
import type { InsuranceCompany } from "@/types/invoice";
import styles from "./page.module.scss";

const ITEMS_PER_PAGE = 7;
const NEW_COMPANY_ID = "new-company";

export default function Companies() {
  const {
    data: companies = [],
    error: loadError,
    isLoading,
  } = useCompanies();
  const {
    createCompany,
    updateCompany,
    deleteCompany: removeCompany,
    isMutating,
  } = useCompanyMutations();
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

  const startCreating = () => {
    if (editingId) return;
    setSearch("");
    setCurrentPage(Math.max(1, Math.ceil((companies.length + 1) / ITEMS_PER_PAGE)));
    setEditingId(NEW_COMPANY_ID);
    setIsCreating(true);
    setNameDraft("");
    setStorageError("");
  };

  const startEditing = (company: InsuranceCompany) => {
    setEditingId(company.id);
    setNameDraft(company.name);
    setIsCreating(false);
  };

  const saveName = async (name: string, companyId: string) => {
    try {
      if (isCreating) {
        await createCompany({ name });
        setCurrentPage(
          Math.max(1, Math.ceil((companies.length + 1) / ITEMS_PER_PAGE)),
        );
      } else {
        await updateCompany(companyId, { name });
        setCurrentPage(1);
      }
    } catch (error) {
      setStorageError(
        error instanceof Error ? error.message : "კომპანიის შენახვა ვერ მოხერხდა.",
      );
      return;
    }
    setStorageError("");
    setEditingId(null);
    setNameDraft("");
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNameDraft("");
    setIsCreating(false);
  };

  const deleteCompany = async (companyId: string) => {
    const remainingCompanies = companies.filter(
      (company) => company.id !== companyId,
    );
    try {
      await removeCompany(companyId);
      setStorageError("");
    } catch (error) {
      setStorageError(
        error instanceof Error ? error.message : "კომპანიის წაშლა ვერ მოხერხდა.",
      );
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
            disabled={editingId !== null || isLoading || Boolean(loadError)}
            onClick={startCreating}
          >
            სადაზღვევოს დამატება
          </Button>
        </div>
      </nav>

      <Card className={styles.listCard} padding="sm">
        {(storageError ||
          (loadError instanceof Error
            ? loadError.message
            : loadError
              ? "კომპანიების ჩატვირთვა ვერ მოხერხდა."
              : "")) && (
          <p className={styles.storageError} role="alert">
            {storageError ||
              (loadError instanceof Error
                ? loadError.message
                : "კომპანიების ჩატვირთვა ვერ მოხერხდა.")}
          </p>
        )}
        <div className={styles.companyList} aria-label="სადაზღვევო კომპანიების სია">
          {isCreating && editingId === NEW_COMPANY_ID && (
            <article
              className={`${styles.companyItem} ${styles.editingItem}`}
              key={NEW_COMPANY_ID}
            >
              <CompanyNameForm
                name={nameDraft}
                onNameChange={setNameDraft}
                onSubmit={(name) => saveName(name, NEW_COMPANY_ID)}
                onCancel={cancelEdit}
              />
            </article>
          )}
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
                    onCancel={cancelEdit}
                  />
                ) : (
                  <>
                    <strong className={styles.companyName}>{company.name}</strong>
                    <div className={styles.itemActions}>
                      <button
                        type="button"
                        className={styles.iconButton}
                        aria-label={`${company.name} სახელის რედაქტირება`}
                        disabled={isMutating}
                        onClick={() => startEditing(company)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        className={styles.iconButton}
                        aria-label={`${company.name} წაშლა`}
                        disabled={isMutating}
                        onClick={() => void deleteCompany(company.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </article>
            );
          })}
          {isLoading && (
            <p className={styles.emptyState} role="status">
              კომპანიები იტვირთება...
            </p>
          )}
          {!isLoading && !loadError && filteredCompanies.length === 0 && (
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
