import dotenv from 'dotenv';

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 3333),
  DATABASE_URL: process.env.DATABASE_URL ?? '',
  REDIS_URL: process.env.REDIS_URL ?? 'redis://localhost:6379',
  JWT_SECRET: process.env.JWT_SECRET ?? 'centro-odonto-dev-secret-key',
  MINIO: {
    ENDPOINT: process.env.MINIO_ENDPOINT ?? 'localhost',
    PORT: Number(process.env.MINIO_PORT ?? 9000),
    ACCESS_KEY: process.env.MINIO_ACCESS_KEY ?? 'minioadmin',
    SECRET_KEY: process.env.MINIO_SECRET_KEY ?? 'miniopassword123',
    USE_SSL: process.env.MINIO_USE_SSL === 'true',
    BUCKETS: {
      CLINICAL_RECORDS: process.env.MINIO_BUCKET_CLINICAL_RECORDS ?? 'clinical-records',
      DIAGNOSTIC_IMAGES: process.env.MINIO_BUCKET_DIAGNOSTIC_IMAGES ?? 'diagnostic-images',
    },
  },
};
