/** Formats a number in a compact form, for example 1.2K */
export function compactFormat(value: number) {
  const formatter = new Intl.NumberFormat("en", {
    notation: "compact",
    compactDisplay: "short",
  });

  return formatter.format(value);
}

/** Formats a number with thousand separators and two decimals */
export function standardFormat(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Formats an amount in rubles */
export function formatRub(value: number, compact = false) {
  const formatted = compact ? compactFormat(value) : standardFormat(value);
  return `${formatted} ₽`;
}
