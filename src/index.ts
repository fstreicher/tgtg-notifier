import { scheduleCronJobs } from './lib/cron';
import { getLoginPin } from './lib/gmail';

scheduleCronJobs();
// getLoginPin().then(res => console.log('index', res));

process.on('SIGINT', () => {
  console.info('\nShutting down gracefully...');
  process.exit(1);
});
