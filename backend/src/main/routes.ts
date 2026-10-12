import { Router } from 'express';
import { patientRouter } from '../modules/clinical-record/infrastructure/http/patientRoutes.js';
import { procedureRouter } from '../modules/clinical-record/infrastructure/http/procedureRoutes.js';
import { authRouter } from '../modules/identity-access/infrastructure/http/authRoutes.js';

export const routes = Router();

routes.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'centro-odonto-api',
    timestamp: new Date().toISOString(),
    architecture: 'Clean Architecture with Domain-Driven Design (DDD)',
    language: 'English Codebase',
  });
});

// Domain context routes:
routes.use('/auth', authRouter);
routes.use('/patients', patientRouter);
routes.use('/procedures', procedureRouter);
// routes.use('/scheduling', schedulingRoutes);
// routes.use('/billing', billingRoutes);
