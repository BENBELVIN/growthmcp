/** Compact display for dashboard stats — e.g. 1100 → "1.1k", 100000 → "100k". */
export function formatCompact(value: number): string {
  const n = Math.round(value);
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (n >= 1_000) {
    const k = n / 1_000;
    return `${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1).replace(/\.0$/, "")}k`;
  }
  return new Intl.NumberFormat("en").format(n);
}
