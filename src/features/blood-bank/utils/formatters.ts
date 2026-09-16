import type { BloodComponent } from "@/contracts/blood";

export function formatComponentLabel(component: BloodComponent): string {
  switch (component) {
    case "WHOLE_BLOOD":
      return "Whole Blood";
    case "RBC":
      return "Red Blood Cells";
    case "PLATELETS":
      return "Platelets";
    case "PLASMA":
      return "Plasma";
    default:
      return component;
  }
}
