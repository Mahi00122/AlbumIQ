export function normaliseEventCode(value = "") {
  return value.replace(/\s+/g, "").toUpperCase();
}

export function formatNumber(value) {
  return new Intl.NumberFormat("en-IN").format(Number(value));
}

export function formatDate(value) {
  if (!value) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

export function formatStatusLabel(value = "") {
  if (!value) {
    return "Unknown";
  }

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function initialsFromName(value = "") {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
