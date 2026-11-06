import { useState } from "react";

export function useCompanyPageState() {
  const [storageError, setStorageError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [search, setSearch] = useState("");

  return {
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
  };
}
