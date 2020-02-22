const cron = require('node-cron');
const { getItems } = require('./scraper');
const { recipients } = require('../recipients');

cron.schedule('*/5 * * * *', () => {
  const date = new Date();
  const locations = Object.keys(recipients);
  console.log(`Running cron job @ ${date.toLocaleTimeString('de-DE', { hour12: false })}`);
  locations.forEach(location => getItems(location, recipients[location].recipients));
});
