import { AggregateRoot } from '../../../../shared/domain/AggregateRoot.js';
import { UniqueEntityId } from '../../../../shared/domain/Identifier.js';
import { Result } from '../../../../shared/domain/Result.js';
import { ClinicalProgressNote } from '../entities/ClinicalProgressNote.js';
import { Odontogram } from './Odontogram.js';

export interface MedicalAlertItem {
  type: 'ALLERGY' | 'SYSTEMIC_CONDITION' | 'MEDICATION' | 'PREGNANCY' | 'BLEEDING_DISORDER';
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface PatientRecordProps {
  patientId: string;
  odontogram: Odontogram;
  progressNotes: ClinicalProgressNote[];
  medicalAlerts: MedicalAlertItem[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * PatientRecord Aggregate Root encapsulates the Electronic Health Record (EHR) of a patient.
 * It coordinates medical alerts, odontogram state, and progress notes within the clinic.
 */
export class PatientRecord extends AggregateRoot<PatientRecordProps> {
  private constructor(props: PatientRecordProps, id?: UniqueEntityId) {
    super(props, id);
  }

  get patientId(): string {
    return this.props.patientId;
  }

  get odontogram(): Odontogram {
    return this.props.odontogram;
  }

  get progressNotes(): ClinicalProgressNote[] {
    return [...this.props.progressNotes];
  }

  get medicalAlerts(): MedicalAlertItem[] {
    return [...this.props.medicalAlerts];
  }

  public addMedicalAlert(alert: MedicalAlertItem): Result<void> {
    if (!alert.description || alert.description.trim().length === 0) {
      return Result.fail('Alert description is required.');
    }

    this.props.medicalAlerts.push(alert);
    this.props.updatedAt = new Date();
    return Result.ok();
  }

  public addProgressNote(note: ClinicalProgressNote): Result<void> {
    this.props.progressNotes.push(note);
    this.props.updatedAt = new Date();
    return Result.ok();
  }

  public static create(
    props: Omit<PatientRecordProps, 'createdAt' | 'updatedAt'> & {
      createdAt?: Date;
      updatedAt?: Date;
    },
    id?: UniqueEntityId
  ): Result<PatientRecord> {
    if (!props.patientId) {
      return Result.fail<PatientRecord>('Patient ID is required.');
    }

    const patientRecord = new PatientRecord(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id
    );

    return Result.ok<PatientRecord>(patientRecord);
  }
}
