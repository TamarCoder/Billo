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

// Georgian counts in twenties: 45 = ორმოც-და-ხუთი (2×20 + 5).
const TWENTIES = ["", "ოცი", "ორმოცი", "სამოცი", "ოთხმოცი"] as const;

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

// A word followed by more words drops its final "ი": ასი → ას ერთი, ოცი → ოცდაერთი.
const stem = (word: string) => word.replace(/ი$/u, "");

function numberBelowThousandToGeorgianWords(value: number): string {
  if (value === 0) return "";
  if (value < 20) return SMALL_NUMBERS[value];

  if (value < 100) {
    const twenties = Math.floor(value / 20);
    const rest = value % 20;
    return rest === 0
      ? TWENTIES[twenties]
      : `${stem(TWENTIES[twenties])}და${SMALL_NUMBERS[rest]}`;
  }

  const hundredsText = HUNDREDS[Math.floor(value / 100)];
  const remainder = value % 100;
  return remainder
    ? `${stem(hundredsText)} ${numberBelowThousandToGeorgianWords(remainder)}`
    : hundredsText;
}

function numberToGeorgianWords(value: number) {
  if (value === 0) return "ნული";

  const groups = [
    { divisor: 1_000_000_000, unit: "მილიარდი" },
    { divisor: 1_000_000, unit: "მილიონი" },
    { divisor: 1_000, unit: "ათასი" },
  ];
  let remainder = value;
  const parts: string[] = [];

  for (const { divisor, unit } of groups) {
    const group = Math.floor(remainder / divisor);
    if (group === 0) continue;
    remainder %= divisor;
    const unitText = remainder > 0 ? stem(unit) : unit;
    parts.push(group === 1 ? unitText : `${numberBelowThousandToGeorgianWords(group)} ${unitText}`);
  }

  if (remainder > 0) parts.push(numberBelowThousandToGeorgianWords(remainder));
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
