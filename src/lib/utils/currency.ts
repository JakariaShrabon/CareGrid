import type { Money } from "@/contracts/common";

/**
 * Formats a Money object into a localized currency string.
 * @param money The Money object from the API.
 * @param locale Optional locale, defaults to "en-US".
 * @returns Formatted currency string, e.g., "$1,500.00" or "৳1,500.00"
 */
export function formatMoney(money: Money, locale = "en-US"): string {
  if (!money || typeof money.amount === "undefined" || !money.currency) {
    return "";
  }

  const amount = Number(money.amount);
  
  if (isNaN(amount)) {
    return money.amount.toString();
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: money.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
