import { Entity } from '../../../../shared/domain/Entity.js';
import { UniqueEntityId } from '../../../../shared/domain/Identifier.js';
import { Result } from '../../../../shared/domain/Result.js';

export interface EndodonticData {
  toothNumber: number;
  canals: Array<{
    canalName: string; // e.g. MV, ML, DV, D, P
    workingLengthMm: number; // Odontometria (mm)
    referencePoint: string; // Ponto de referência anatômico
    rotarySystem: string; // Sistema rotatório (ex: WaveOne, ProTaper)
    coneCalibration: string; // Calibração do cone principal
    endodonticSealer: string; // Cimento obturador (ex: AH Plus, Bio-C Sealer)
  }>;
}

export interface ClinicalProgressNoteProps {
  patientRecordId: string;
  professionalId: string;
  professionalName: string;
  text: string;
  endodonticData?: EndodonticData | undefined;
  isSigned: boolean;
  signedAt?: Date | undefined;
  digitalSignatureHash?: string | undefined;
  createdAt: Date;
}

/**
 * An immutable clinical evolution record complying with medical regulations and LGPD.
 * Once signed, a progress note cannot be altered or removed.
 */
export class ClinicalProgressNote extends Entity<ClinicalProgressNoteProps> {
  private constructor(props: ClinicalProgressNoteProps, id?: UniqueEntityId) {
    super(props, id);
  }

  get professionalId(): string {
    return this.props.professionalId;
  }

  get professionalName(): string {
    return this.props.professionalName;
  }

  get text(): string {
    return this.props.text;
  }

  get endodonticData(): EndodonticData | undefined {
    return this.props.endodonticData;
  }

  get isSigned(): boolean {
    return this.props.isSigned;
  }

  get signedAt(): Date | undefined {
    return this.props.signedAt;
  }

  get digitalSignatureHash(): string | undefined {
    return this.props.digitalSignatureHash;
  }

  public sign(signatureHash: string): Result<void> {
    if (this.props.isSigned) {
      return Result.fail('Clinical progress note is already signed and locked.');
    }

    if (!signatureHash || signatureHash.trim().length === 0) {
      return Result.fail('Valid digital signature hash is required.');
    }

    this.props.isSigned = true;
    this.props.signedAt = new Date();
    this.props.digitalSignatureHash = signatureHash;

    return Result.ok();
  }

  public static create(
    props: Omit<ClinicalProgressNoteProps, 'createdAt' | 'isSigned'> & {
      createdAt?: Date;
      isSigned?: boolean;
    },
    id?: UniqueEntityId
  ): Result<ClinicalProgressNote> {
    if (!props.professionalId) {
      return Result.fail<ClinicalProgressNote>('Professional ID is required.');
    }

    if (!props.text || props.text.trim().length < 5) {
      return Result.fail<ClinicalProgressNote>('Clinical note description must contain at least 5 characters.');
    }

    const note = new ClinicalProgressNote(
      {
        ...props,
        isSigned: props.isSigned ?? false,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    return Result.ok<ClinicalProgressNote>(note);
  }
}
