const { getItem } = require('./api');
const { transporter } = require('./nodemailer');
const fs = require('fs');

async function getItems(location, recipients) {
  const item = await getItem(location);
  let lastItems = {};
  if (!fs.existsSync(`./lastItems/${location}.json`)) {
    fs.writeFileSync(`./lastItems/${location}.json`, JSON.stringify({ [location]: item.items_available }, null, 2));
  } else {
    lastItems = await JSON.parse(fs.readFileSync(`./lastItems/${location}.json`));
    lastItems = lastItems[location];
    fs.writeFileSync(`./lastItems/${location}.json`, JSON.stringify({ [location]: item.items_available }, null, 2));
  }
  if (item.items_available > 0) {
    if (!(item.items_available == lastItems[location])) {
      lastItems = item.items_available;
      console.info(` | ${item.display_name} has ${item.items_available} items available, sending ${recipients.length} notification emails.`);
      recipients.forEach(recipient => {
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
}

module.exports.getItems = getItems;
