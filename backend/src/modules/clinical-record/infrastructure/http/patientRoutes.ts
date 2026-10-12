import { Router } from 'express';
import { authMiddleware } from '../../../identity-access/infrastructure/middleware/authMiddleware.js';
import { AddProcedureToToothUseCase } from '../../application/use-cases/AddProcedureToToothUseCase.js';
import { AddProgressNoteUseCase } from '../../application/use-cases/AddProgressNoteUseCase.js';
import { GetPatientRecordUseCase } from '../../application/use-cases/GetPatientRecordUseCase.js';
import { SignProgressNoteUseCase } from '../../application/use-cases/SignProgressNoteUseCase.js';
import { UpdateToothConditionUseCase } from '../../application/use-cases/UpdateToothConditionUseCase.js';
import { PrismaPatientRecordRepository } from '../persistence/PrismaPatientRecordRepository.js';
import { ClinicalRecordController } from './ClinicalRecordController.js';
import { PatientController } from './PatientController.js';

export const patientRouter = Router();

// Apply authentication to all patient and clinical record routes
patientRouter.use(authMiddleware);

// Dependency injection
const patientRecordRepository = new PrismaPatientRecordRepository();

const getPatientRecordUseCase = new GetPatientRecordUseCase(patientRecordRepository);
const updateToothConditionUseCase = new UpdateToothConditionUseCase(patientRecordRepository);
const addProcedureToToothUseCase = new AddProcedureToToothUseCase(patientRecordRepository);
const addProgressNoteUseCase = new AddProgressNoteUseCase(patientRecordRepository);
const signProgressNoteUseCase = new SignProgressNoteUseCase(patientRecordRepository);

const clinicalRecordController = new ClinicalRecordController(
  getPatientRecordUseCase,
  updateToothConditionUseCase,
  addProcedureToToothUseCase,
  addProgressNoteUseCase,
  signProgressNoteUseCase
);

const patientController = new PatientController();

// Patient CRUD
patientRouter.post('/', patientController.create);
patientRouter.get('/', patientController.list);
patientRouter.get('/:id', patientController.getById);

// Clinical Record & Odontogram
patientRouter.get('/:id/record', clinicalRecordController.getRecord);
patientRouter.patch('/:id/odontogram/teeth/:toothNumber/condition', clinicalRecordController.updateToothCondition);
patientRouter.post('/:id/odontogram/teeth/:toothNumber/procedures', clinicalRecordController.addProcedure);
patientRouter.post('/:id/progress-notes', clinicalRecordController.addProgressNote);
patientRouter.post('/:id/progress-notes/:noteId/sign', clinicalRecordController.signProgressNote);
