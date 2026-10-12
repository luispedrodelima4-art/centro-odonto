export interface ToothDTO {
  toothNumber: number;
  condition: string;
  notes?: string | undefined;
  procedures: Array<{
    id: string;
    procedureCode: string;
    name: string;
    surfaces: string[];
    status: string;
    priceInCents: number;
    completedAt?: string | undefined;
  }>;
}

export interface OdontogramDTO {
  id: string;
  dentitionType: string;
  teeth: ToothDTO[];
}

export interface ProgressNoteDTO {
  id: string;
  professionalId: string;
  professionalName: string;
  text: string;
  endodonticData?: any;
  isSigned: boolean;
  signedAt?: string | undefined;
  digitalSignatureHash?: string | undefined;
  createdAt: string;
}

export interface PatientRecordResponseDTO {
  id: string;
  patientId: string;
  medicalAlerts: Array<{
    type: string;
    description: string;
    severity: string;
  }>;
  odontogram: OdontogramDTO;
  progressNotes: ProgressNoteDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateToothConditionDTO {
  patientId: string;
  toothNumber: number;
  condition: string;
}

export interface AddProcedureToToothDTO {
  patientId: string;
  toothNumber: number;
  procedureCode: string;
  name: string;
  surfaces: string[];
  priceInCents: number;
  notes?: string | undefined;
}

export interface SignProgressNoteDTO {
  patientId: string;
  noteId: string;
  professionalId: string;
}
