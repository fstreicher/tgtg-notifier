const { getItem } = require('./lib/api');
const express = require('express');
require('./lib/cron');

const app = express();

app.get('/items', async (req, res, next) => {
  console.info('Getting items...');
  const item = await getItem();
  const itemsAvailable = item.items_available;
  if (itemsAvailable > 0) {
    console.info(`${item.store.store_name} has ${item.items_available} items available.`);
  } else {
    console.info(`${item.store.store_name} has no items available.`);
  }

  res.json({ itemsAvailable });
});

app.listen(3030, () => {
  console.info('Running on port 3030');
});

console.info(process.env.GMAIL_USER);
console.info(process.env.GMAIL_PW);
console.info(process.env.NODEMAILER_SENDER);
console.info(process.env.NODEMAILER_RECIPIENT.split(','));
console.info(process.env.TGTG_USER_ID);
console.info(process.env.TGTG_USER_ORIGIN_LONG);
console.info(process.env.TGTG_USER_ORIGIN_LAT);
console.info(process.env.TGTG_AUTH_TOKEN);
