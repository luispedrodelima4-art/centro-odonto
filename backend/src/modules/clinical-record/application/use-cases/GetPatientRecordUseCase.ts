import { IUseCase } from '../../../../shared/application/IUseCase.js';
import { Result } from '../../../../shared/domain/Result.js';
import { Odontogram } from '../../domain/aggregates/Odontogram.js';
import { PatientRecord } from '../../domain/aggregates/PatientRecord.js';
import { IPatientRecordRepository } from '../../domain/repositories/IPatientRecordRepository.js';
import { PatientRecordResponseDTO } from '../dtos/ClinicalRecordDTOs.js';

export class GetPatientRecordUseCase implements IUseCase<string, Result<PatientRecordResponseDTO>> {
  constructor(private readonly patientRecordRepository: IPatientRecordRepository) {}

  public async execute(patientId: string): Promise<Result<PatientRecordResponseDTO>> {
    let record = await this.patientRecordRepository.findByPatientId(patientId);

    // If record doesn't exist yet, lazily create initial record and standard 32-tooth odontogram
    if (!record) {
      const odontogramResult = Odontogram.createNew(patientId);
      if (odontogramResult.isFailure) {
        return Result.fail(odontogramResult.getError());
      }

      const createResult = PatientRecord.create({
        patientId,
        odontogram: odontogramResult.getValue(),
        progressNotes: [],
        medicalAlerts: [],
      });

      if (createResult.isFailure) {
        return Result.fail(createResult.getError());
      }

      record = createResult.getValue();
      await this.patientRecordRepository.save(record);
    }

    const odontogram = record.odontogram;

    const teethDTO = odontogram.teeth.map((t) => ({
      toothNumber: t.toothNumber.value,
      condition: t.condition,
      notes: t.props.notes,
      procedures: t.procedures.map((p) => ({
        id: p.id.toString(),
        procedureCode: p.procedureCode,
        name: p.name,
        surfaces: p.surfaces.map((s) => s.code),
        status: p.status,
        priceInCents: p.priceInCents,
        completedAt: p.completedAt?.toISOString(),
      })),
    }));

    const progressNotesDTO = record.progressNotes.map((n) => ({
      id: n.id.toString(),
      professionalId: n.professionalId,
      professionalName: n.props.professionalName,
      text: n.props.text,
      endodonticData: n.props.endodonticData,
      isSigned: n.props.isSigned,
      signedAt: n.props.signedAt?.toISOString(),
      digitalSignatureHash: n.props.digitalSignatureHash,
      createdAt: n.props.createdAt.toISOString(),
    }));

    return Result.ok<PatientRecordResponseDTO>({
      id: record.id.toString(),
      patientId: record.patientId,
      medicalAlerts: record.medicalAlerts.map((a) => ({
        type: a.type,
        description: a.description,
        severity: a.severity,
      })),
      odontogram: {
        id: odontogram.id.toString(),
        dentitionType: odontogram.dentitionType,
        teeth: teethDTO,
      },
      progressNotes: progressNotesDTO,
      createdAt: record.props.createdAt.toISOString(),
      updatedAt: record.props.updatedAt.toISOString(),
    });
  }
}
