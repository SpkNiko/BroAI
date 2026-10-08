export function cn(
  ...parts: Array<
    string |
    false |
    null |
    undefined
  >
) {
  return parts
    .filter(Boolean)
    .join(" ");
}

export function formatDate(
  value: Date | string
) {
  return new Intl.DateTimeFormat(
    "pl-PL",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(
    new Date(value)
  );
}
