const cron = require('node-cron');
const { scrapeFavorites } = require('./scraper');

cron.schedule('*/5 * * * *', () => {
  const date = new Date();
  console.log(`\nRunning cron job @ ${date.toLocaleTimeString('de-DE', { hour12: false })}`);
  scrapeFavorites();
});

cron.schedule('* 19 * * *', () => {
  const date = new Date();
  console.log(`\nRunning cron job (DD Special) @ ${date.toLocaleTimeString('de-DE', { hour12: false })}`);
  scrapeFavorites();
});
