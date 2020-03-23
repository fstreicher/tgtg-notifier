const { recipients: targets } = require('../recipients');
const { getItem, getFavorites } = require('./api');
const { transporter } = require('./nodemailer');
const fs = require('fs');

/**
 * @deprecated use scrapeFavorites()
 */
async function scrapeItems(location, recipients) {
  getItem(location)
    .then(res => {
      const item = res.data;
      let lastItems = {};
      if (!fs.existsSync(`./lastItems/${location}.json`)) {
        fs.writeFileSync(`./lastItems/${location}.json`, JSON.stringify({ [location]: item.items_available }, null, 2));
      } else {
        lastItems = JSON.parse(fs.readFileSync(`./lastItems/${location}.json`));
        fs.writeFileSync(`./lastItems/${location}.json`, JSON.stringify({ [location]: item.items_available }, null, 2));
      }
      if (item.items_available > 0) {
        if (!(item.items_available == lastItems[location])) {
          console.info(` | ${item.display_name} has ${item.items_available} items available, sending ${recipients.length} notification emails.`);
          recipients.forEach(recipient => {

            if (recipient.trigger === 'available' && lastItems[location] !== 0) {
              console.info(`   \u27f9  skipping notification to ${recipient.name} with trigger: ${recipient.trigger}`);
              return;
            }

            transporter.sendMail({
              from: `"TGTG Notifier" <${process.env.NODEMAILER_SENDER}>`,
              to: `"${recipient.name}" <${recipient.email}>`,
              subject: `${item.display_name} has items available`,
              text: `${item.display_name} has ${item.items_available} items available.`,
              html: `${item.display_name} has <b>${item.items_available}</b> items available.`
            });
          });
        } else {
          console.info(` | ${item.display_name} still has ${item.items_available} items available, not sending notification email.`);
        }
      } else {
        console.info(` | ${item.display_name} has no items available.`);
      }
    })
    .catch(err => {
      console.error(`${err.name}: ${err.message}`);
      sendError(err);
    });
}

async function scrapeFavorites() {
  getFavorites()
    .then(res => {
      const items = res.data.items;
      let lastItems = {};
      if (!fs.existsSync('./lastItems/favorites.json')) {
        items.forEach(item => lastItems[item.item.item_id] = item.items_available);
      } else {
        lastItems = JSON.parse(fs.readFileSync('./lastItems/favorites.json'));
      }

      targets.forEach(target => {
        const mailItems = { send: false, items: [] };
        target.locations.forEach(location => {
          const currentItem = items.find(item => item.item.item_id == location);

          if (currentItem.items_available > 0) {
            if (!(currentItem.items_available == lastItems[currentItem.item.item_id])) {
              mailItems.items.push({ locationName: currentItem.display_name, available: currentItem.items_available });
              console.info(` | ${currentItem.display_name} has ${currentItem.items_available} items available, adding to queue.`);

              if (target.trigger === 'available' && lastItems[location] !== 0) {
                console.info(`   \u27f9  skipping notification to ${target.name} with trigger: ${target.trigger}`);
                return;
              }
              mailItems.send = true;

            } else {
              console.info(` | ${currentItem.display_name} still has ${currentItem.items_available} items available, not adding item to queue.`);
            }
          } else {
            console.info(` | ${currentItem.display_name} has no items available.`);
          }

        });
        if (mailItems.send) {
          console.info(`    \u27f9  Sending mail with notification about ${mailItems.items.length} item(s) to ${target.name}.`);
          mailItems.items.forEach(() => {
            transporter.sendMail({
              from: `"TGTG Notifier" <${process.env.NODEMAILER_SENDER}>`,
              to: `"${target.name}" <${target.email}>`,
              subject: `Your favorite locations have items available!`,
              html: mailItems.items.map(item => `${item.locationName}: <b>${item.available}</b>`).join('\n')
            });
          });
        }
      });

      items.forEach(item => lastItems[item.item.item_id] = item.items_available);
      fs.writeFileSync('./lastItems/favorites.json', JSON.stringify(lastItems, null, 2));
    })
    .catch(err => {
      console.error(`${err.name}: ${err.message}`);
      sendError(err);
    });
}

function sendError(err) {
  if (!fs.existsSync('./reqFailed.txt')) {
    console.info('  \u27f9  Sending error notification!');
    fs.writeFileSync('./reqFailed.txt', 1);
    transporter.sendMail({
      from: `"TGTG Notifier" <${process.env.NODEMAILER_SENDER}>`,
      to: `"${process.env.NODEMAILER_SENDER_NAME}" <${process.env.NODEMAILER_SENDER}>`,
      subject: `\u2757 TGTG Promise Reject: ${err.response.status}`,
      text: `TGTG Promise Reject: ${err.name}\n${err.message}`,
      html: `TGTG Promise Reject: <b>${err.name}</b>\n${err.message}`
    });
  }
}


module.exports.scrapeItems = scrapeItems;
module.exports.scrapeFavorites = scrapeFavorites;
