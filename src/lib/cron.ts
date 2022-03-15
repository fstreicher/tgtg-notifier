import { schedule } from 'node-cron';

import { scrapeFavorites } from './scraper';

export function scheduleCronJobs(): void {
  console.info('Initializing cron jobs')

  // run every 5 minutes, except from 1800-1900
  schedule('*/5 0-17,19-23 * * *', () => {
    const date = new Date();
    console.log(`\nRunning cron job @ ${date.toLocaleTimeString('de-DE', { hour12: false })}`);
    scrapeFavorites();
  });

  // run every minute from 1800-1859
  schedule('* 18 * * *', () => {
    const date = new Date();
    console.log(`\nRunning cron job @ ${date.toLocaleTimeString('de-DE', { hour12: false })}`);
    scrapeFavorites();
  });
}
