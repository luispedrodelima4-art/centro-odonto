import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../../../shared/infrastructure/database/prisma.js';

const createPatientSchema = z.object({
  fullName: z.string().min(2, 'Patient name must have at least 2 characters'),
  documentCpf: z.string().min(11, 'CPF must have at least 11 digits'),
  birthDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  phoneNumber: z.string().min(8, 'Phone number must have at least 8 digits'),
  email: z.string().email('Invalid email address').optional(),
});

export class PatientController {
  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = createPatientSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Validation failed',
          issues: parsed.error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
        });
        return;
      }

      const cleanCpf = parsed.data.documentCpf.replace(/\D/g, '');
      const existing = await prisma.patient.findUnique({
        where: { documentCpf: cleanCpf },
      });

      if (existing) {
        res.status(400).json({ error: 'A patient with this CPF already exists.' });
        return;
      }

      const patient = await prisma.patient.create({
        data: {
          fullName: parsed.data.fullName.trim(),
          documentCpf: cleanCpf,
          birthDate: new Date(parsed.data.birthDate),
          phoneNumber: parsed.data.phoneNumber.trim(),
          email: parsed.data.email ? parsed.data.email.trim().toLowerCase() : null,
        },
      });

      res.status(201).json({ patient });
    } catch (error) {
      console.error('Error creating patient:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };

  public list = async (req: Request, res: Response): Promise<void> => {
    try {
      const search = (req.query.search as string) ?? '';

      const whereClause = search
        ? {
            OR: [
              { fullName: { contains: search, mode: 'insensitive' as const } },
              { documentCpf: { contains: search } },
              { phoneNumber: { contains: search } },
            ],
          }
        : {};

      const patients = await prisma.patient.findMany({
        where: whereClause,
        orderBy: { fullName: 'asc' },
        take: 50,
      });

      res.status(200).json({ patients });
    } catch (error) {
      console.error('Error listing patients:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const patient = await prisma.patient.findUnique({
        where: { id },
        include: {
          patientRecord: {
            select: { id: true, createdAt: true, updatedAt: true },
          },
          wallet: {
            select: { balanceInCents: true },
          },
        },
      });

      if (!patient) {
        res.status(404).json({ error: 'Patient not found.' });
        return;
      }

      res.status(200).json({ patient });
    } catch (error) {
      console.error('Error fetching patient:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };
}
