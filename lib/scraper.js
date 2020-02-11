const { getItem } = require('./api');
const { transporter } = require('./nodemailer');
const fs = require('fs');

async function getItems() {
  const recipients = process.env.NODEMAILER_RECIPIENTS.split(';').map(x => { return { name: x.split(',')[0], email: x.split(',')[1] }; });
  const item = await getItem();
  let lastItems = 0;
  if (!fs.existsSync('./lastItems.json')) {
    fs.writeFileSync('./lastItems.json', JSON.stringify({ [item.item.item_id]: item.items_available }));
  } else {
    lastItems = await JSON.parse(fs.readFileSync('./lastItems.json'));
    console.info(lastItems);
    fs.writeFileSync('./lastItems.json', JSON.stringify({ [item.item.item_id]: item.items_available }));
  }
  if (item.items_available > 0) {
    if (!item.items_available == lastItems[item.item_id]) {
      lastItems = item.items_available;
      console.info(`${item.store.store_name} has ${item.items_available} items available, sending ${recipients.length} notification emails.`);
      recipients.forEach(recipient => {
        transporter.sendMail({
          from: `"TGTG Notifier" <${process.env.NODEMAILER_SENDER}>`,
          to: `"${recipient.name}" <${recipient.email}>`,
          subject: `${item.store.store_name} has items available`,
          text: `${item.store.store_name} has ${item.items_available} items available.`,
          html: `${item.store.store_name} has <b>${item.items_available}</b> items available.`
        });
      });
    } else {
      console.info(`${item.store.store_name} still has ${item.items_available} items available, not sending notification email.`);
    }
  } else {
    console.info(`${item.store.store_name} has no items available.`);
  }
}

module.exports.getItems = getItems;
