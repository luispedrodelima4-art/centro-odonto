import {
  ClinicalProgressNote as PrismaProgressNote,
  DentalProcedure as PrismaProcedure,
  Odontogram as PrismaOdontogram,
  PatientRecord as PrismaPatientRecord,
  Tooth as PrismaTooth,
} from '@prisma/client';
import { UniqueEntityId } from '../../../../shared/domain/Identifier.js';
import { Odontogram } from '../../domain/aggregates/Odontogram.js';
import { MedicalAlertItem, PatientRecord } from '../../domain/aggregates/PatientRecord.js';
import { ClinicalProgressNote, EndodonticData } from '../../domain/entities/ClinicalProgressNote.js';
import { DentalProcedure, ProcedureStatus } from '../../domain/entities/DentalProcedure.js';
import { Tooth, ToothCondition } from '../../domain/entities/Tooth.js';
import { ToothNumber } from '../../domain/value-objects/ToothNumber.js';
import { SurfaceCode, ToothSurface } from '../../domain/value-objects/ToothSurface.js';

type RawPatientRecordWithRelations = PrismaPatientRecord & {
  odontogram: (PrismaOdontogram & {
    teeth: (PrismaTooth & {
      procedures: PrismaProcedure[];
    })[];
  }) | null;
  progressNotes: (PrismaProgressNote & {
    professional?: { name: string } | null;
  })[];
};

export class PatientRecordMapper {
  public static toDomain(raw: RawPatientRecordWithRelations): PatientRecord {
    const recordId = new UniqueEntityId(raw.id);

    // Map Odontogram
    let odontogram: Odontogram;
    if (raw.odontogram) {
      const teethMap = new Map<number, Tooth>();

      for (const rawTooth of raw.odontogram.teeth) {
        const toothNumberResult = ToothNumber.create(rawTooth.toothNumber);
        if (toothNumberResult.isFailure) continue;

        const procedures: DentalProcedure[] = [];
        for (const rawProc of rawTooth.procedures) {
          const surfaces: ToothSurface[] = [];
          for (const s of rawProc.surfaces) {
            const surfaceResult = ToothSurface.create(s as SurfaceCode);
            if (surfaceResult.isSuccess) {
              surfaces.push(surfaceResult.getValue());
            }
          }

          const procResult = DentalProcedure.create(
            {
              procedureCode: rawProc.procedureCode,
              name: rawProc.name,
              surfaces,
              status: rawProc.status as ProcedureStatus,
              priceInCents: rawProc.priceInCents,
              performedByProfessionalId: rawProc.performerId ?? undefined,
              notes: rawProc.notes ?? undefined,
              createdAt: rawProc.createdAt,
              completedAt: rawProc.completedAt ?? undefined,
            },
            new UniqueEntityId(rawProc.id)
          );

          if (procResult.isSuccess) {
            procedures.push(procResult.getValue());
          }
        }

        const toothResult = Tooth.create(
          {
            toothNumber: toothNumberResult.getValue(),
            condition: rawTooth.condition as ToothCondition,
            procedures,
            notes: rawTooth.notes ?? undefined,
          },
          new UniqueEntityId(rawTooth.id)
        );

        if (toothResult.isSuccess) {
          teethMap.set(rawTooth.toothNumber, toothResult.getValue());
        }
      }

      // Ensure 32 teeth exist if some missing in DB
      const odontogramResult = Odontogram.createNew(raw.id, raw.odontogram.dentitionType as any, new UniqueEntityId(raw.odontogram.id));
      odontogram = odontogramResult.getValue();
      // Apply persisted teeth
      for (const [num, tooth] of teethMap.entries()) {
        const existing = odontogram.getTooth(num);
        if (existing) {
          existing.setCondition(tooth.condition);
          for (const p of tooth.procedures) {
            existing.addProcedure(p);
          }
        }
      }
    } else {
      odontogram = Odontogram.createNew(raw.id).getValue();
    }

    // Map Progress Notes
    const progressNotes: ClinicalProgressNote[] = [];
    for (const rawNote of raw.progressNotes) {
      const noteResult = ClinicalProgressNote.create(
        {
          patientRecordId: raw.id,
          professionalId: rawNote.professionalId,
          professionalName: rawNote.professional?.name ?? 'Professional',
          text: rawNote.text,
          endodonticData: (rawNote.endodonticData as unknown as EndodonticData) ?? undefined,
          isSigned: rawNote.isSigned,
          signedAt: rawNote.signedAt ?? undefined,
          digitalSignatureHash: rawNote.digitalSignatureHash ?? undefined,
          createdAt: rawNote.createdAt,
        },
        new UniqueEntityId(rawNote.id)
      );

      if (noteResult.isSuccess) {
        progressNotes.push(noteResult.getValue());
      }
    }

    // Medical Alerts
    const alerts = Array.isArray(raw.medicalAlerts)
      ? (raw.medicalAlerts as unknown as MedicalAlertItem[])
      : [];

    const recordResult = PatientRecord.create(
      {
        patientId: raw.patientId,
        odontogram,
        progressNotes,
        medicalAlerts: alerts,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      recordId
    );

    return recordResult.getValue();
  }
}
