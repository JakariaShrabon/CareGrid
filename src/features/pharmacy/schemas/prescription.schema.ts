import { z } from "zod";

export const prescriptionItemSchema = z.object({
  medicineId: z.string().min(1, "Medicine is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.string().min(1, "Frequency is required"),
  duration: z.string().min(1, "Duration is required"),
  instructions: z.string().optional(),
});

export const prescriptionFormSchema = z.object({
  patientId: z.string().min(1, "Patient must be selected"),
  items: z.array(prescriptionItemSchema).min(1, "At least one medication is required"),
});

export type PrescriptionFormValues = z.infer<typeof prescriptionFormSchema>;
