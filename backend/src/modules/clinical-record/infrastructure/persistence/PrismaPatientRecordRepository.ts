import { prisma } from '../../../../shared/infrastructure/database/prisma.js';
import { PatientRecord } from '../../domain/aggregates/PatientRecord.js';
import { IPatientRecordRepository } from '../../domain/repositories/IPatientRecordRepository.js';
import { PatientRecordMapper } from './PatientRecordMapper.js';

export class PrismaPatientRecordRepository implements IPatientRecordRepository {
  private readonly includeRelations = {
    odontogram: {
      include: {
        teeth: {
          include: {
            procedures: true,
          },
        },
      },
    },
    progressNotes: {
      include: {
        professional: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' as const },
    },
  };

  public async findByPatientId(patientId: string): Promise<PatientRecord | null> {
    const raw = await prisma.patientRecord.findUnique({
      where: { patientId },
      include: this.includeRelations,
    });

    return raw ? PatientRecordMapper.toDomain(raw) : null;
  }

  public async findById(id: string): Promise<PatientRecord | null> {
    const raw = await prisma.patientRecord.findUnique({
      where: { id },
      include: this.includeRelations,
    });

    return raw ? PatientRecordMapper.toDomain(raw) : null;
  }

  public async save(patientRecord: PatientRecord): Promise<void> {
    const recordId = patientRecord.id.toString();
    const odontogram = patientRecord.odontogram;

    await prisma.$transaction(async (tx) => {
      // 1. Save PatientRecord
      await tx.patientRecord.upsert({
        where: { id: recordId },
        create: {
          id: recordId,
          patientId: patientRecord.patientId,
          medicalAlerts: patientRecord.medicalAlerts as any,
          updatedAt: new Date(),
        },
        update: {
          medicalAlerts: patientRecord.medicalAlerts as any,
          updatedAt: new Date(),
        },
      });

      // 2. Save Odontogram
      const odontogramId = odontogram.id.toString();
      await tx.odontogram.upsert({
        where: { patientRecordId: recordId },
        create: {
          id: odontogramId,
          patientRecordId: recordId,
          dentitionType: odontogram.dentitionType,
          updatedAt: new Date(),
        },
        update: {
          dentitionType: odontogram.dentitionType,
          updatedAt: new Date(),
        },
      });

      // 3. Save Teeth and Dental Procedures
      for (const tooth of odontogram.teeth) {
        const toothNumber = tooth.toothNumber.value;

        const persistedTooth = await tx.tooth.upsert({
          where: {
            odontogramId_toothNumber: {
              odontogramId,
              toothNumber,
            },
          },
          create: {
            odontogramId,
            toothNumber,
            condition: tooth.condition,
            updatedAt: new Date(),
          },
          update: {
            condition: tooth.condition,
            updatedAt: new Date(),
          },
        });

        // Save Procedures for this tooth
        for (const procedure of tooth.procedures) {
          const procedureId = procedure.id.toString();
          const surfaces = procedure.surfaces.map((s) => s.code);

          await tx.dentalProcedure.upsert({
            where: { id: procedureId },
            create: {
              id: procedureId,
              toothId: persistedTooth.id,
              procedureCode: procedure.procedureCode,
              name: procedure.name,
              surfaces,
              status: procedure.status,
              priceInCents: procedure.priceInCents,
              completedAt: procedure.completedAt ?? null,
            },
            update: {
              status: procedure.status,
              surfaces,
              priceInCents: procedure.priceInCents,
              completedAt: procedure.completedAt ?? null,
            },
          });
        }
      }

      // 4. Save Progress Notes
      for (const note of patientRecord.progressNotes) {
        const noteId = note.id.toString();
        await tx.clinicalProgressNote.upsert({
          where: { id: noteId },
          create: {
            id: noteId,
            patientRecordId: recordId,
            professionalId: note.professionalId,
            text: note.props.text,
            endodonticData: (note.props.endodonticData as any) ?? null,
            isSigned: note.props.isSigned,
            signedAt: note.props.signedAt ?? null,
            digitalSignatureHash: note.props.digitalSignatureHash ?? null,
            createdAt: note.props.createdAt,
          },
          update: {
            isSigned: note.props.isSigned,
            signedAt: note.props.signedAt ?? null,
            digitalSignatureHash: note.props.digitalSignatureHash ?? null,
          },
        });
      }
    });
  }

  public async delete(id: string): Promise<void> {
    await prisma.patientRecord.delete({
      where: { id },
    });
  }
}
