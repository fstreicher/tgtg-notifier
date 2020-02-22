const cron = require('node-cron');
const { getItems } = require('./scraper');
const { recipients } = require('../recipients');

cron.schedule('*/5 * * * *', () => {
  const date = new Date();
  console.log(`Running cron job @ ${date.toLocaleTimeString('de-DE', { hour12: false })}`);

  const locations = Object.keys(recipients);
  locations.forEach(location => {
    getItems(location, recipients[location].recipients);
  });

  // getItems();
});
