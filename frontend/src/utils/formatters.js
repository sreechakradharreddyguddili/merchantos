export const formatCurrency = (
  value,
  currency = "INR"
) => {
  const number = Number(value || 0);

  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }
  ).format(number);
};

export const formatNumber = (
  value
) => {
  const number = Number(value || 0);

  return new Intl.NumberFormat(
    "en-IN"
  ).format(number);
};

export const formatPercentage = (
  value,
  decimals = 1
) => {
  const number = Number(value || 0);

  return `${number.toFixed(decimals)}%`;
};

export const formatDate = (
  value
) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

export const formatDateTime = (
  value
) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};

export const capitalize = (
  value
) => {
  if (!value) {
    return "";
  }

  const text = String(value);

  return (
    text.charAt(0).toUpperCase() +
    text.slice(1)
  );
};

export const formatStatus = (
  value
) => {
  if (!value) {
    return "Unknown";
  }

  return String(value)
    .replace(/_/g, " ")
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(" ");
};