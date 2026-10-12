import { IUseCase } from '../../../../shared/application/IUseCase.js';
import { Result } from '../../../../shared/domain/Result.js';
import { DentalProcedure } from '../../domain/entities/DentalProcedure.js';
import { IPatientRecordRepository } from '../../domain/repositories/IPatientRecordRepository.js';
import { SurfaceCode, ToothSurface } from '../../domain/value-objects/ToothSurface.js';
import { AddProcedureToToothDTO } from '../dtos/ClinicalRecordDTOs.js';

export class AddProcedureToToothUseCase implements IUseCase<AddProcedureToToothDTO, Result<void>> {
  constructor(private readonly patientRecordRepository: IPatientRecordRepository) {}

  public async execute(request: AddProcedureToToothDTO): Promise<Result<void>> {
    const record = await this.patientRecordRepository.findByPatientId(request.patientId);
    if (!record) {
      return Result.fail(`Patient record not found for patient: ${request.patientId}`);
    }

    // Validate tooth surfaces
    const surfaces: ToothSurface[] = [];
    for (const s of request.surfaces) {
      const surfaceResult = ToothSurface.create(s as SurfaceCode);
      if (surfaceResult.isFailure) {
        return Result.fail(surfaceResult.getError());
      }
      surfaces.push(surfaceResult.getValue());
    }

    const procedureResult = DentalProcedure.create({
      procedureCode: request.procedureCode,
      name: request.name,
      surfaces,
      status: 'PROPOSED',
      priceInCents: request.priceInCents,
      notes: request.notes,
    });

    if (procedureResult.isFailure) {
      return Result.fail(procedureResult.getError());
    }

    const addResult = record.odontogram.addProcedureToTooth(
      request.toothNumber,
      procedureResult.getValue()
    );

    if (addResult.isFailure) {
      return Result.fail(addResult.getError());
    }

    await this.patientRecordRepository.save(record);
    return Result.ok();
  }
}
