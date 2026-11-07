export const GEORGIAN_MONTHS = [
  "იანვარი",
  "თებერვალი",
  "მარტი",
  "აპრილი",
  "მაისი",
  "ივნისი",
  "ივლისი",
  "აგვისტო",
  "სექტემბერი",
  "ოქტომბერი",
  "ნოემბერი",
  "დეკემბერი",
] as const;

export function formatGeorgianMonthYear(value: string) {
  const match = /^(\d{4})-(\d{2})$/u.exec(value);
  if (!match) return value;

  const month = Number(match[2]);
  if (month < 1 || month > GEORGIAN_MONTHS.length) return value;

  return `${GEORGIAN_MONTHS[month - 1]} ${match[1]}`;
}
