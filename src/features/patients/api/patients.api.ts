import { apiClient } from "@/lib/api/client";
import type { PaginatedResponse } from "@/contracts/common";
import type { Patient, PatientAdmission, VitalsRecord, DailyPatientUpdate, LabResult } from "@/contracts/patient";

export const getPatients = (params?: { search?: string }) => {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  return apiClient.get<PaginatedResponse<Patient>>(`/patients?${query.toString()}`);
};

export const getPatient = (id: string) => {
  return apiClient.get<Patient>(`/patients/${id}`);
};

export const getPatientAdmission = (id: string) => {
  return apiClient.get<PatientAdmission>(`/patients/${id}/admission`);
};

export const getPatientVitals = (id: string) => {
  return apiClient.get<VitalsRecord[]>(`/patients/${id}/vitals`);
};

export const createPatientVital = (id: string, payload: Partial<VitalsRecord>) => {
  return apiClient.post<Partial<VitalsRecord>, VitalsRecord>(`/patients/${id}/vitals`, payload);
};

export const getPatientUpdates = (id: string) => {
  return apiClient.get<DailyPatientUpdate[]>(`/patients/${id}/updates`);
};

export const createPatientUpdate = (id: string, payload: Partial<DailyPatientUpdate>) => {
  return apiClient.post<Partial<DailyPatientUpdate>, DailyPatientUpdate>(`/patients/${id}/updates`, payload);
};

export const getPatientLabResults = (id: string) => {
  return apiClient.get<LabResult[]>(`/patients/${id}/lab-results`);
};
