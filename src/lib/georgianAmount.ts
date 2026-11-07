const SMALL_NUMBERS = [
  "",
  "ერთი",
  "ორი",
  "სამი",
  "ოთხი",
  "ხუთი",
  "ექვსი",
  "შვიდი",
  "რვა",
  "ცხრა",
  "ათი",
  "თერთმეტი",
  "თორმეტი",
  "ცამეტი",
  "თოთხმეტი",
  "თხუთმეტი",
  "თექვსმეტი",
  "ჩვიდმეტი",
  "თვრამეტი",
  "ცხრამეტი",
] as const;

const TENS = [
  "",
  "",
  "ოცი",
  "ოცდაათი",
  "ორმოცი",
  "ორმოცდაათი",
  "სამოცი",
  "სამოცდაათი",
  "ოთხმოცი",
  "ოთხმოცდაათი",
] as const;

const HUNDREDS = [
  "",
  "ასი",
  "ორასი",
  "სამასი",
  "ოთხასი",
  "ხუთასი",
  "ექვსასი",
  "შვიდასი",
  "რვაასი",
  "ცხრაასი",
] as const;

function numberBelowThousandToGeorgianWords(value: number): string {
  if (value === 0) return "";
  if (value < 20) return SMALL_NUMBERS[value];

  if (value < 100) {
    const tens = Math.floor(value / 10);
    const units = value % 10;
    if (units === 0) return TENS[tens];

    const prefixes = [
      "",
      "",
      "ოცდ",
      "ოცდათ",
      "ორმოცდ",
      "ორმოცდა",
      "სამოცდ",
      "სამოცდა",
      "ოთხმოცდ",
      "ოთხმოცდა",
    ] as const;
    return `${prefixes[tens]}${SMALL_NUMBERS[units]}`;
  }

  const hundreds = Math.floor(value / 100);
  const remainder = value % 100;
  const hundredsText = HUNDREDS[hundreds];
  return remainder
    ? `${hundredsText} ${numberBelowThousandToGeorgianWords(remainder)}`
    : hundredsText;
}

function numberToGeorgianWords(value: number) {
  if (value === 0) return "ნული";
  if (value < 1_000) return numberBelowThousandToGeorgianWords(value);

  const groups = [
    { divisor: 1_000_000_000, unit: "მილიარდი", plural: "მილიარდი" },
    { divisor: 1_000_000, unit: "მილიონი", plural: "მილიონი" },
    { divisor: 1_000, unit: "ათასი", plural: "ათას" },
  ];
  let remainder = value;
  const parts: string[] = [];

  for (const { divisor, unit, plural } of groups) {
    const group = Math.floor(remainder / divisor);
    if (group === 0) continue;

    const groupWords =
      group === 1 ? "" : numberBelowThousandToGeorgianWords(group);
    parts.push(`${groupWords ? `${groupWords} ` : ""}${group === 1 ? unit : plural}`);
    remainder %= divisor;
  }

  if (remainder > 0) {
    parts.push(numberBelowThousandToGeorgianWords(remainder));
  }

  return parts.join(" ");
}

export function parseAmountToMinorUnits(value: string): number | null {
  const normalized = value.trim().replace(/[\s\u00a0\u202f]/gu, "");
  const match = /^(?:(\d+)(?:[.,](\d{0,2}))?|[.,](\d{1,2}))$/u.exec(
    normalized,
  );
  if (!match) return null;

  const lari = Number(match[1] || 0);
  const tetri = Number((match[2] ?? match[3] ?? "").padEnd(2, "0") || 0);
  const minorUnits = lari * 100 + tetri;
  return Number.isSafeInteger(minorUnits) ? minorUnits : null;
}

export function amountToGeorgianWords(value: string) {
  const minorUnits = parseAmountToMinorUnits(value);
  if (minorUnits === null) return "";

  const lari = Math.floor(minorUnits / 100);
  const tetri = minorUnits % 100;
  const lariText = `${numberToGeorgianWords(lari)} ლარი`;

  return tetri > 0 ? `${lariText} და ${tetri} თეთრი` : lariText;
}
