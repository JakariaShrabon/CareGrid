const staticLabels: Record<string, string> = {
  dashboard: "Dashboard",
  patients: "Patients",
  wards: "Wards",
  organ: "Organ",
  matches: "Matches",
  "waiting-list": "Waiting List",
  ischemia: "Ischemia",
  "living-donors": "Living Donors",
  "blood-bank": "Blood Bank",
  inventory: "Inventory",
  donors: "Donors",
  sos: "SOS",
  map: "Map",
  pharmacy: "Pharmacy",
  prescriptions: "Prescriptions",
  new: "New",
  billing: "Billing",
  bills: "Bills",
  claims: "Claims",
  discharge: "Discharge",
  notifications: "Notifications",
  profile: "Profile",
};

export type BreadcrumbItem = {
  label: string;
  href: string;
  current: boolean;
};

function titleize(segment: string): string {
  return segment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return [{ label: "Dashboard", href: "/dashboard", current: true }];
  }

  return segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    return {
      label: staticLabels[segment] ?? titleize(segment),
      href,
      current: index === segments.length - 1,
    };
  });
}
