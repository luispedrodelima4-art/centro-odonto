import { Request, Response } from 'express';
import { z } from 'zod';
import { AddProcedureToToothUseCase } from '../../application/use-cases/AddProcedureToToothUseCase.js';
import { AddProgressNoteUseCase } from '../../application/use-cases/AddProgressNoteUseCase.js';
import { GetPatientRecordUseCase } from '../../application/use-cases/GetPatientRecordUseCase.js';
import { SignProgressNoteUseCase } from '../../application/use-cases/SignProgressNoteUseCase.js';
import { UpdateToothConditionUseCase } from '../../application/use-cases/UpdateToothConditionUseCase.js';

const toothConditionSchema = z.object({
  condition: z.enum([
    'SOUND',
    'CARIOUS',
    'RESTORED',
    'MISSING',
    'IMPACTED',
    'CROWN',
    'ENDODONTICALLY_TREATED',
    'IMPLANT',
    'EXTRACTED',
  ]),
});

const procedureSchema = z.object({
  procedureCode: z.string().min(1, 'Procedure code is required'),
  name: z.string().min(1, 'Procedure name is required'),
  surfaces: z.array(z.string()).default([]),
  priceInCents: z.number().int().nonnegative('Price cannot be negative'),
  notes: z.string().optional(),
});

const progressNoteSchema = z.object({
  text: z.string().min(5, 'Progress note must contain at least 5 characters'),
  endodonticData: z
    .object({
      toothNumber: z.number().int(),
      canals: z.array(
        z.object({
          canalName: z.string(),
          workingLengthMm: z.number(),
          referencePoint: z.string(),
          rotarySystem: z.string(),
          coneCalibration: z.string(),
          endodonticSealer: z.string(),
        })
      ),
    })
    .optional(),
});

export class ClinicalRecordController {
  constructor(
    private readonly getPatientRecordUseCase: GetPatientRecordUseCase,
    private readonly updateToothConditionUseCase: UpdateToothConditionUseCase,
    private readonly addProcedureToToothUseCase: AddProcedureToToothUseCase,
    private readonly addProgressNoteUseCase: AddProgressNoteUseCase,
    private readonly signProgressNoteUseCase: SignProgressNoteUseCase
  ) {}

  public getRecord = async (req: Request, res: Response): Promise<void> => {
    try {
      const patientId = req.params.id as string;
      const result = await this.getPatientRecordUseCase.execute(patientId);

      if (result.isFailure) {
        res.status(404).json({ error: result.getError() });
        return;
      }

      res.status(200).json(result.getValue());
    } catch (error) {
      console.error('Error fetching patient clinical record:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };

  public updateToothCondition = async (req: Request, res: Response): Promise<void> => {
    try {
      const patientId = req.params.id as string;
      const toothNumber = parseInt(req.params.toothNumber as string, 10);

      const parsed = toothConditionSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Validation failed',
          issues: parsed.error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
        });
        return;
      }

      const result = await this.updateToothConditionUseCase.execute({
        patientId,
        toothNumber,
        condition: parsed.data.condition,
      });

      if (result.isFailure) {
        res.status(400).json({ error: result.getError() });
        return;
      }

      res.status(200).json({ message: 'Tooth condition updated successfully.' });
    } catch (error) {
      console.error('Error updating tooth condition:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };

  public addProcedure = async (req: Request, res: Response): Promise<void> => {
    try {
      const patientId = req.params.id as string;
      const toothNumber = parseInt(req.params.toothNumber as string, 10);

      const parsed = procedureSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Validation failed',
          issues: parsed.error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
        });
        return;
      }

      const result = await this.addProcedureToToothUseCase.execute({
        patientId,
        toothNumber,
        ...parsed.data,
      });

      if (result.isFailure) {
        res.status(400).json({ error: result.getError() });
        return;
      }

      res.status(201).json({ message: 'Procedure added to tooth successfully.' });
    } catch (error) {
      console.error('Error adding procedure to tooth:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };

  public addProgressNote = async (req: Request, res: Response): Promise<void> => {
    try {
      const patientId = req.params.id as string;
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized.' });
        return;
      }

      const parsed = progressNoteSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Validation failed',
          issues: parsed.error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
        });
        return;
      }

      const result = await this.addProgressNoteUseCase.execute({
        patientId,
        professionalId: req.user.userId,
        professionalName: req.user.name,
        text: parsed.data.text,
        endodonticData: parsed.data.endodonticData,
      });

      if (result.isFailure) {
        res.status(400).json({ error: result.getError() });
        return;
      }

      res.status(201).json({ message: 'Clinical progress note registered successfully.' });
    } catch (error) {
      console.error('Error adding clinical progress note:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };

  public signProgressNote = async (req: Request, res: Response): Promise<void> => {
    try {
      const patientId = req.params.id as string;
      const noteId = req.params.noteId as string;

      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized.' });
        return;
      }

      const result = await this.signProgressNoteUseCase.execute({
        patientId,
        noteId,
        professionalId: req.user.userId,
      });

      if (result.isFailure) {
        res.status(400).json({ error: result.getError() });
        return;
      }

      res.status(200).json({
        message: 'Clinical progress note signed and legally locked.',
        signatureHash: result.getValue().signatureHash,
      });
    } catch (error) {
      console.error('Error signing progress note:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };
}
