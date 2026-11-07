import { parseAmountToMinorUnits } from "@/lib/georgianAmount";
import styles from "./InvoiceDocument.module.scss";

export interface InvoiceDocumentProps {
  organization: string;
  invoiceNumber: string;
  reportingDate: string;
  sendingDate: string;
  address: string;
  identificationNumber: string;
  bankName: string;
  bankCode: string;
  bankAccount: string;
  companyName: string;
  reportingMonth: string;
  serviceDescription: string;
  amount: string;
  amountInWords: string;
  className?: string;
}

function formatAmount(amount: string) {
  const minorUnits = parseAmountToMinorUnits(amount);
  if (minorUnits === null) return "";
  const numericAmount = minorUnits / 100;

  return `${new Intl.NumberFormat("ka-GE", {
    minimumFractionDigits: minorUnits % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(numericAmount)} ₾`;
}

export function InvoiceDocument({
  organization,
  invoiceNumber,
  reportingDate,
  sendingDate,
  address,
  identificationNumber,
  bankName,
  bankCode,
  bankAccount,
  companyName,
  reportingMonth,
  serviceDescription,
  amount,
  amountInWords,
  className,
}: InvoiceDocumentProps) {
  const documentClassName = [styles.document, className]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={documentClassName} aria-label="ანგარიშ-ფაქტურა">
      <table className={styles.documentTable} aria-label="ინვოისის დეტალები">
        <colgroup>
          <col className={styles.mainColumn} />
          <col className={styles.amountColumn} />
        </colgroup>
        <tbody>
          <tr className={styles.titleRow}>
            <th className={styles.titleCell} scope="row">
              <strong>{organization}</strong>
            </th>
            <td className={styles.referenceCell} rowSpan={2}>
              <strong>
                ანგარიშ-ფაქტურა
                <br /># {invoiceNumber}
              </strong>
              <span>{reportingDate} წელი</span>
            </td>
          </tr>
          <tr className={styles.organizationRow}>
            <td className={styles.organizationCell}>
              <span>{address}</span>
              <span>ს/კ {identificationNumber.replace(/^ს\/კ\s*/u, "")}</span>
            </td>
          </tr>
          <tr className={styles.bankRow}>
            <td className={styles.bankCell}>
              <span>{bankAccount}</span>
              <span>ბანკი: {bankName}</span>
              <span>ბანკის კოდი: {bankCode}</span>
            </td>
            <td className={styles.dateCell}>
              <strong>გაგზავნის თარიღი</strong>
              <span>{sendingDate} წელი</span>
            </td>
          </tr>
          <tr className={styles.companyRow}>
            <td>
              <strong>{companyName || "დასახელება"}</strong>
            </td>
            <td className={styles.emptyCell} aria-hidden="true" />
          </tr>
          <tr className={styles.columnHeadingRow}>
            <th scope="col">აღწერილობა</th>
            <th scope="col">თანხა</th>
          </tr>
          <tr className={styles.itemRow}>
            <td className={styles.descriptionCell}>
              <strong>{reportingMonth}</strong>
              <p>{serviceDescription}</p>
            </td>
            <td className={styles.amountCell}>
              <strong>{formatAmount(amount)}</strong>
            </td>
          </tr>
          <tr className={styles.amountInWordsRow}>
            <td>
              <span>თანხა სიტყვიერად: {amountInWords}</span>
            </td>
            <td className={styles.emptyCell} aria-hidden="true" />
          </tr>
        </tbody>
      </table>
      <footer className={styles.responsiblePerson}>
        პასუხისმგებელი პირი:
      </footer>
    </article>
  );
}
