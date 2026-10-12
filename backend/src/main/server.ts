import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`🚀 Centro Odonto API server listening on port ${env.PORT}`);
  console.log(`🏥 Environment: ${env.NODE_ENV}`);
  console.log(`📋 Health Check: http://localhost:${env.PORT}/api/v1/health`);
});
