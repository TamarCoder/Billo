import { useEffect } from "react";

interface UseLoadCompaniesOptions {
  loadCompanies: () => void;
  setError: (message: string) => void;
}

export function useLoadCompanies({
  loadCompanies,
  setError,
}: UseLoadCompaniesOptions) {
  useEffect(() => {
    try {
      loadCompanies();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "კომპანიების ჩატვირთვა ვერ მოხერხდა.",
      );
    }
  }, [loadCompanies, setError]);
}
