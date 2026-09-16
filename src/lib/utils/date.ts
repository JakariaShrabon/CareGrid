import { format, formatDistanceToNow, differenceInYears } from "date-fns";

export function formatDate(dateString?: string | null): string {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "MMM d, yyyy");
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString?: string | null): string {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "MMM d, yyyy h:mm a");
  } catch {
    return dateString;
  }
}

export function formatRelative(dateString?: string | null): string {
  if (!dateString) return "N/A";
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch {
    return dateString;
  }
}

export function calculateAge(dateOfBirth?: string | null): string {
  if (!dateOfBirth) return "N/A";
  try {
    const years = differenceInYears(new Date(), new Date(dateOfBirth));
    return `${years} yrs`;
  } catch {
    return "N/A";
  }
}
