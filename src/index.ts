import { scheduleCronJobs } from './lib/cron';

scheduleCronJobs();

process.on('SIGINT', () => {
  console.info('\nShutting down gracefully...');
  process.exit(1);
});
