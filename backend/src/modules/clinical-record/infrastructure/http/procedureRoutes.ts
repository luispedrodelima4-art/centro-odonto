import { Router } from 'express';
import { authMiddleware } from '../../../identity-access/infrastructure/middleware/authMiddleware.js';
import { ProcedureCatalogController } from './ProcedureCatalogController.js';

export const procedureRouter = Router();

procedureRouter.use(authMiddleware);

const catalogController = new ProcedureCatalogController();

procedureRouter.get('/', catalogController.list);
procedureRouter.post('/', catalogController.create);
