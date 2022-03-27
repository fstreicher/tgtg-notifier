import { scheduleCronJobs } from './lib/cron';
import server from './server/index';

const port = process.env.port ?? 3333;

// scheduleCronJobs();

server.listen(port, () => console.info(`listening on port ${port}`));

process.on('SIGINT', () => {
  console.info('\nShutting down gracefully...');
  process.exit(1);
});
