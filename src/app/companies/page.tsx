import { useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { ConfirmDelete } from "@/components/ConfirmDelete/ConfirmDelete";
import { Card } from "@/components/Card/Card";
import { CompanyNameForm } from "@/components/CompanyNameForm/CompanyNameForm";
import { Button } from "@/ui/Button/Button";
import { Input } from "@/ui/Input/Input";
import { Pagination } from "@/ui/Pagination/Pagination";
import { useCompanyPageState } from "@/hooks/useCompanyPageState";
import { useCompanies } from "@/hooks/api/useCompanies";
import { useCompanyMutations } from "@/hooks/api/useCompanyMutations";
import type { Company } from "@/types/invoice";
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
    numberDraft,
    setNumberDraft,
    search,
    setSearch,
  } = useCompanyPageState();

  const query = search.trim().toLocaleLowerCase("ka-GE");

  const matchesQuery = (company: Company) =>
    (company.name ?? "").toLocaleLowerCase("ka-GE").includes(query) ||
    (company.number ?? "").toLocaleLowerCase("ka-GE").includes(query);

  const sortedCompanies = [...companies].sort((a, b) =>
    (a.number ?? "").localeCompare(b.number ?? "", "ka-GE", { numeric: true }),
  );

  const filteredCompanies = sortedCompanies.filter(matchesQuery);
  const totalPages = Math.max(
    1,
    Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE),
  );
  const visibleCompanies = filteredCompanies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const resetEditing = () => {
    setEditingId(null);
    setNumberDraft("");
    setNameDraft("");
    setIsCreating(false);
  };

  const startCreating = () => {
    if (editingId) return;
    setSearch("");
    setCurrentPage(1);
    setEditingId(NEW_COMPANY_ID);
    setIsCreating(true);
    setNumberDraft("");
    setNameDraft("");
    setStorageError("");
  };

  const startEditing = (company: Company) => {
    setEditingId(company.id);
    setNumberDraft(company.number ?? "");
    setNameDraft(company.name);
    setIsCreating(false);
  };

  const saveCompany = async (
    companyId: string,
    number: string,
    name: string,
  ) => {
    try {
      if (isCreating) {
        await createCompany({ number, name });
      } else {
        await updateCompany(companyId, { number, name });
      }
      setCurrentPage(1);
    } catch (error) {
      setStorageError(
        error instanceof Error ? error.message : "კომპანიის შენახვა ვერ მოხერხდა.",
      );
      return;
    }
    setStorageError("");
    resetEditing();
  };

  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);

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

    const remainingFilteredCount = remainingCompanies.filter(matchesQuery).length;
    setCurrentPage((page) =>
      Math.min(
        page,
        Math.max(1, Math.ceil(remainingFilteredCount / ITEMS_PER_PAGE)),
      ),
    );
    if (editingId === companyId) resetEditing();
  };

  return (
    <main className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="მდებარეობა">
        <div className={styles.breadcrumbPath}>
          <span>კომპანიები</span>
          <span aria-hidden="true">/</span>
          <span aria-current="page">კომპანიების სია</span>
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
            variant="success"
            size="sm"
            leadingIcon={<Plus size={17} />}
            disabled={editingId !== null || isLoading || Boolean(loadError)}
            onClick={startCreating}
          >
            კომპანიის დამატება
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
        <div className={styles.companyList} aria-label="კომპანიების სია">
          {isCreating && editingId === NEW_COMPANY_ID && (
            <article
              className={`${styles.companyItem} ${styles.editingItem}`}
              key={NEW_COMPANY_ID}
            >
              <CompanyNameForm
                number={numberDraft}
                name={nameDraft}
                onNumberChange={setNumberDraft}
                onNameChange={setNameDraft}
                onSubmit={(number, name) =>
                  saveCompany(NEW_COMPANY_ID, number, name)
                }
                onCancel={resetEditing}
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
                    number={numberDraft}
                    name={nameDraft}
                    onNumberChange={setNumberDraft}
                    onNameChange={setNameDraft}
                    onSubmit={(number, name) =>
                      saveCompany(company.id, number, name)
                    }
                    onCancel={resetEditing}
                  />
                ) : (
                  <>
                    <span className={styles.companyNumber}>{company.number}</span>
                    <strong className={styles.companyName}>{company.name}</strong>
                    <div className={styles.itemActions}>
                      <button
                        type="button"
                        className={styles.iconButton}
                        aria-label={`${company.name} რედაქტირება`}
                        disabled={isMutating}
                        onClick={() => startEditing(company)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        className={`${styles.iconButton} ${styles.deleteButton}`}
                        aria-label={`${company.name} წაშლა`}
                        disabled={isMutating}
                        onClick={() => setCompanyToDelete(company)}
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
            aria-label="კომპანიების გვერდები"
          />
        )}
      </Card>

      {companyToDelete && (
        <ConfirmDelete
          itemName={companyToDelete.name}
          onConfirm={() => deleteCompany(companyToDelete.id)}
          onClose={() => setCompanyToDelete(null)}
        />
      )}
    </main>
  );
}