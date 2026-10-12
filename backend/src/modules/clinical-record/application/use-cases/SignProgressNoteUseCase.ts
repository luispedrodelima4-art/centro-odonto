import crypto from 'crypto';
import { IUseCase } from '../../../../shared/application/IUseCase.js';
import { Result } from '../../../../shared/domain/Result.js';
import { IPatientRecordRepository } from '../../domain/repositories/IPatientRecordRepository.js';
import { SignProgressNoteDTO } from '../dtos/ClinicalRecordDTOs.js';

export class SignProgressNoteUseCase implements IUseCase<SignProgressNoteDTO, Result<{ signatureHash: string }>> {
  constructor(private readonly patientRecordRepository: IPatientRecordRepository) {}

  public async execute(request: SignProgressNoteDTO): Promise<Result<{ signatureHash: string }>> {
    const record = await this.patientRecordRepository.findByPatientId(request.patientId);
    if (!record) {
      return Result.fail(`Patient record not found for patient: ${request.patientId}`);
    }

    const note = record.progressNotes.find((n) => n.id.toString() === request.noteId);
    if (!note) {
      return Result.fail(`Clinical progress note not found: ${request.noteId}`);
    }

    if (note.props.isSigned) {
      return Result.fail('Clinical progress note is already signed and locked.');
    }

    const timestamp = new Date().toISOString();
    const dataToSign = `${record.id.toString()}:${note.id.toString()}:${request.professionalId}:${timestamp}:${note.props.text}`;
    const signatureHash = crypto.createHash('sha256').update(dataToSign).digest('hex');

    const signResult = note.sign(signatureHash);
    if (signResult.isFailure) {
      return Result.fail(signResult.getError());
    }

    await this.patientRecordRepository.save(record);
    return Result.ok({ signatureHash });
  }
}
