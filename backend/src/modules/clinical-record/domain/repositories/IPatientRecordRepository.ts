import { PatientRecord } from '../aggregates/PatientRecord.js';

export interface IPatientRecordRepository {
  findByPatientId(patientId: string): Promise<PatientRecord | null>;
  findById(id: string): Promise<PatientRecord | null>;
  save(patientRecord: PatientRecord): Promise<void>;
  delete(id: string): Promise<void>;
}
