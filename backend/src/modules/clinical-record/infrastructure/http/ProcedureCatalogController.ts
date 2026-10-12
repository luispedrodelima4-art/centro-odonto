import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../../../shared/infrastructure/database/prisma.js';

const DEFAULT_PROCEDURES = [
  { name: 'Profilaxia e Raspagem (Limpeza Completa)', category: 'PREVENTIVE', priceInCents: 18000, description: 'Remoção de tártaro e biofilme dental com jato de bicarbonato' },
  { name: 'Aplicação Tópica de Flúor', category: 'PREVENTIVE', priceInCents: 9000, description: 'Remineralização do esmalte' },
  { name: 'Restauração em Resina Composta (1 Face)', category: 'RESTORATIVE', priceInCents: 16000, description: 'Restauração estética direta em resina fotopolimerizável' },
  { name: 'Restauração em Resina Composta (2 Faces)', category: 'RESTORATIVE', priceInCents: 22000, description: 'Restauração estética proximal (MO, DO, etc)' },
  { name: 'Restauração em Resina Composta (3 Faces ou Mais)', category: 'RESTORATIVE', priceInCents: 28000, description: 'Reconstrução extensa MOD ou cúspide' },
  { name: 'Tratamento de Canal Unirradicular', category: 'ENDODONTICS', priceInCents: 45000, description: 'Tratamento endodôntico de incisivos e caninos' },
  { name: 'Tratamento de Canal Multirradicular (Molares)', category: 'ENDODONTICS', priceInCents: 85000, description: 'Instrumentação rotatória e obturação termoplastificada' },
  { name: 'Exodontia Simples (Extração de Dente)', category: 'SURGERY', priceInCents: 18000, description: 'Remoção cirúrgica de elemento dentário' },
  { name: 'Exodontia de Terceiro Molar (Siso Incluso)', category: 'SURGERY', priceInCents: 45000, description: 'Cirurgia com odontossecção e osteotomia' },
  { name: 'Clareamento Dental em Consultório', category: 'AESTHETICS', priceInCents: 90000, description: 'Sessão com gel clareador de alta concentração' },
  { name: 'Coroa Protética Cerâmica (Zircônia/E-max)', category: 'PROSTHESIS', priceInCents: 150000, description: 'Prótese fixa livre de metal' },
  { name: 'Implante Dentário Unitário', category: 'IMPLANT', priceInCents: 180000, description: 'Instalação cirúrgica de implante osseointegrado de titânio' },
];

const createProcedureSchema = z.object({
  name: z.string().min(2, 'Name must have at least 2 characters'),
  category: z.string().default('CLINICAL'),
  priceInCents: z.number().int().nonnegative('Price cannot be negative'),
  description: z.string().optional(),
});

export class ProcedureCatalogController {
  public list = async (_req: Request, res: Response): Promise<void> => {
    try {
      let procedures = await prisma.procedureCatalog.findMany({
        where: { isActive: true },
        orderBy: [{ category: 'asc' }, { name: 'asc' }],
      });

      // Auto-seed default clinic catalog if empty
      if (procedures.length === 0) {
        await prisma.procedureCatalog.createMany({
          data: DEFAULT_PROCEDURES,
        });

        procedures = await prisma.procedureCatalog.findMany({
          where: { isActive: true },
          orderBy: [{ category: 'asc' }, { name: 'asc' }],
        });
      }

      res.status(200).json({ procedures });
    } catch (error) {
      console.error('Error listing procedure catalog:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = createProcedureSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Validation failed',
          issues: parsed.error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
        });
        return;
      }

      const procedure = await prisma.procedureCatalog.create({
        data: {
          name: parsed.data.name.trim(),
          category: parsed.data.category.toUpperCase(),
          priceInCents: parsed.data.priceInCents,
          description: parsed.data.description ? parsed.data.description.trim() : null,
        },
      });

      res.status(201).json({ procedure });
    } catch (error) {
      console.error('Error creating procedure:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };
}
