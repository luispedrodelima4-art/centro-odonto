import { IUseCase } from '../../../../shared/application/IUseCase.js';
import { Result } from '../../../../shared/domain/Result.js';
import { ToothCondition } from '../../domain/entities/Tooth.js';
import { IPatientRecordRepository } from '../../domain/repositories/IPatientRecordRepository.js';
import { UpdateToothConditionDTO } from '../dtos/ClinicalRecordDTOs.js';

export class UpdateToothConditionUseCase implements IUseCase<UpdateToothConditionDTO, Result<void>> {
  constructor(private readonly patientRecordRepository: IPatientRecordRepository) {}

  public async execute(request: UpdateToothConditionDTO): Promise<Result<void>> {
    const record = await this.patientRecordRepository.findByPatientId(request.patientId);
    if (!record) {
      return Result.fail(`Patient record not found for patient: ${request.patientId}`);
    }

    const updateResult = record.odontogram.setToothCondition(
      request.toothNumber,
      request.condition as ToothCondition
    );

    if (updateResult.isFailure) {
      return Result.fail(updateResult.getError());
    }

    await this.patientRecordRepository.save(record);
    return Result.ok();
  }
}
