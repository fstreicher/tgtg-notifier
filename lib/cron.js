const cron = require('node-cron');
const { getItems } = require('./scraper');

cron.schedule('*/5 * * * *', () => {
  const date = new Date();
  console.log(`Running cron job @ ${date.toLocaleTimeString('de-DE', { hour12: false })}`);
  getItems();
});
