import { IUseCase } from '../../../../shared/application/IUseCase.js';
import { Result } from '../../../../shared/domain/Result.js';
import { ClinicalProgressNote, EndodonticData } from '../../domain/entities/ClinicalProgressNote.js';
import { IPatientRecordRepository } from '../../domain/repositories/IPatientRecordRepository.js';

export interface AddProgressNoteDTO {
  patientId: string;
  professionalId: string;
  professionalName: string;
  text: string;
  endodonticData?: EndodonticData | undefined;
}

export class AddProgressNoteUseCase implements IUseCase<AddProgressNoteDTO, Result<void>> {
  constructor(private readonly patientRecordRepository: IPatientRecordRepository) {}

  public async execute(request: AddProgressNoteDTO): Promise<Result<void>> {
    const patientRecord = await this.patientRecordRepository.findByPatientId(
      request.patientId
    );

    if (!patientRecord) {
      return Result.fail(`Patient record not found for patient ID: ${request.patientId}`);
    }

    const noteResult = ClinicalProgressNote.create({
      patientRecordId: patientRecord.id.toString(),
      professionalId: request.professionalId,
      professionalName: request.professionalName,
      text: request.text,
      endodonticData: request.endodonticData,
    });

    if (noteResult.isFailure) {
      return Result.fail(noteResult.getError());
    }

    const addResult = patientRecord.addProgressNote(noteResult.getValue());
    if (addResult.isFailure) {
      return Result.fail(addResult.getError());
    }

    await this.patientRecordRepository.save(patientRecord);

    return Result.ok();
  }
}
