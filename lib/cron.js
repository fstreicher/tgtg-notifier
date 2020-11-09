const cron = require('node-cron');
const { scrapeFavorites } = require('./scraper');

// run every 5 minutes, except from 1900-2000
cron.schedule('*/5 0-18,20-23 * * *', () => {
  const date = new Date();
  console.log(`\nRunning cron job @ ${date.toLocaleTimeString('de-DE', { hour12: false })}`);
  scrapeFavorites();
});

// run every minute from 1900-1959
cron.schedule('* 19 * * *', () => {
  const date = new Date();
  console.log(`\nRunning cron job @ ${date.toLocaleTimeString('de-DE', { hour12: false })}`);
  scrapeFavorites();
});
