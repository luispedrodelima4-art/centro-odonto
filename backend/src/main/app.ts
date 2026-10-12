import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import { routes } from './routes.js';

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: '*' }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use('/api/v1', routes);

  return app;
}
