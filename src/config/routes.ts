import type { Permission } from "./permissions";

export const ROUTES = {
  dashboard: "/dashboard",
  patients: {
    root: "/patients",
    detail: (patientId: string) => `/patients/${patientId}`,
  },
  wards: "/wards",
  organ: {
    root: "/organ",
    matches: "/organ/matches",
    matchDetail: (matchId: string) => `/organ/matches/${matchId}`,
    waitingList: "/organ/waiting-list",
    ischemia: "/organ/ischemia",
    livingDonors: "/organ/living-donors",
  },
  bloodBank: {
    root: "/blood-bank",
    inventory: "/blood-bank/inventory",
    units: "/blood-bank/units",
    donors: "/blood-bank/donors",
    sos: "/blood-bank/sos",
    map: "/blood-bank/map",
  },
  pharmacy: {
    root: "/pharmacy",
    prescriptions: "/pharmacy/prescriptions",
    newPrescription: "/pharmacy/prescriptions/new",
    prescriptionDetail: (id: string) => `/pharmacy/prescriptions/${id}`,
    inventory: "/pharmacy/inventory",
  },
  billing: {
    root: "/billing",
    bills: "/billing/bills",
    billDetail: (id: string) => `/billing/bills/${id}`,
    claims: "/billing/claims",
    discharge: "/billing/discharge",
    dischargeForPatient: (patientId: string) => `/billing/discharge/${patientId}`,
  },
  notifications: "/notifications",
  profile: "/profile",
  unauthorized: "/unauthorized",
} as const;

export type RouteAccessRule = {
  pattern: string;
  authRequired: boolean;
  requiredPermissions: Permission[];
};

export const ROUTE_ACCESS_RULES: RouteAccessRule[] = [
  // Public / Guest routes
  { pattern: "/login", authRequired: false, requiredPermissions: [] },
  { pattern: "/register", authRequired: false, requiredPermissions: [] },
  { pattern: "/forgot-password", authRequired: false, requiredPermissions: [] },
  { pattern: "/reset-password", authRequired: false, requiredPermissions: [] },
  
  // Authenticated routes
  { pattern: "/dashboard", authRequired: true, requiredPermissions: [] },
  { pattern: "/patients", authRequired: true, requiredPermissions: ["patient.read"] },
  { pattern: "/wards", authRequired: true, requiredPermissions: ["ward.read"] },
  { pattern: "/organ", authRequired: true, requiredPermissions: ["organ.match.read"] },
  { pattern: "/organ/waiting-list", authRequired: true, requiredPermissions: ["organ.waitlist.read"] },
  
  { pattern: "/blood-bank", authRequired: true, requiredPermissions: ["blood.inventory.read"] },
  { pattern: "/blood-bank/inventory", authRequired: true, requiredPermissions: ["blood.inventory.read"] },
  { pattern: "/blood-bank/units", authRequired: true, requiredPermissions: ["blood.inventory.read"] },
  { pattern: "/blood-bank/donors", authRequired: true, requiredPermissions: ["blood.donor.read"] },
  { pattern: "/blood-bank/sos", authRequired: true, requiredPermissions: ["blood.sos.create"] },
  { pattern: "/blood-bank/map", authRequired: true, requiredPermissions: ["blood.map.read"] },
  
  { pattern: "/pharmacy", authRequired: true, requiredPermissions: ["prescription.read"] },
  { pattern: "/pharmacy/inventory", authRequired: true, requiredPermissions: ["pharmacy.inventory.read"] },
  
  { pattern: "/billing", authRequired: true, requiredPermissions: ["billing.read"] },
  { pattern: "/billing/claims", authRequired: true, requiredPermissions: ["insurance.read"] },
  { pattern: "/billing/discharge", authRequired: true, requiredPermissions: ["discharge.read"] },
  
  { pattern: "/notifications", authRequired: true, requiredPermissions: ["notification.read"] },
  { pattern: "/profile", authRequired: true, requiredPermissions: [] },
  { pattern: "/my-care", authRequired: true, requiredPermissions: ["patient.read"] },
  { pattern: "/family-care", authRequired: true, requiredPermissions: ["patient.read"] },
];
