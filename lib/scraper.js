const { recipients: targets } = require('../recipients');
const { getFavorites } = require('./api');
const { transporter } = require('./nodemailer');
const fs = require('fs');

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
          if (!currentItem) {
            sendError(new Error(`Item not found: ${location}`));
            return;
          }
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
          transporter.sendMail({
            from: `"TGTG Notifier" <${process.env.NODEMAILER_SENDER}>`,
            to: `"${target.name}" <${target.email}>`,
            subject: `Your favorite locations have items available!`,
            html: mailItems.items.map(item => `${item.locationName}: <b>${item.available}</b>`).join('<br>')
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
      subject: `\u2757 TGTG Error: ${err.response && err.response.status ? err.response.status : err.message}`,
      text: `TGTG Error: ${err.name || ''}\n${err.message}\n${err.stack}`,
      html: `TGTG Error: <b>${err.name || ''}</b>\n${err.message}\n${err.stack}`
    });
  }
}


module.exports.scrapeFavorites = scrapeFavorites;
