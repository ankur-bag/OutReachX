export function detectPhoneNumbers(rows: any[]): string[] {
  const numbers = new Set<string>();

  for (const row of rows) {
    for (const value of Object.values(row)) {
      if (!value) continue;

      let v = String(value).replace(/[\s\-()]/g, "");

      if (!/^\+?\d+$/.test(v)) continue;

      if (/^\d{10}$/.test(v)) {
        v = `+91${v}`;
      } else if (/^91\d{10}$/.test(v)) {
        v = `+${v}`;
      }

      if (/^\+91\d{10}$/.test(v)) {
        numbers.add(v);
      }
    }
  }

  return [...numbers];
}
