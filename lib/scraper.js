const { getItem } = require('./api');
const { transporter } = require('./nodemailer');
const fs = require('fs');

async function getItems(location, recipients) {
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
              console.info(`   -> skipping notification to ${recipient.name} with trigger: ${recipient.trigger}`);
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
      if (!fs.existsSync('./reqFailed.txt')) {
        fs.writeFileSync('./reqFailed.txt', 1);
        transporter.sendMail({
          from: `"TGTG Notifier" <${process.env.NODEMAILER_SENDER}>`,
          to: `"${process.env.NODEMAILER_SENDER_NAME}" <${process.env.NODEMAILER_SENDER}>`,
          subject: `TGTG Promise Reject: ${err.response.status}`,
          text: `TGTG Promise Reject: ${err.name}\n${err.message}`,
          html: `TGTG Promise Reject: <b>${err.name}</b>\n${err.message}`
        });
        console.error(`${err.name}: ${err.message}`);
        console.info('  -> sending error notification');
      } else {
        console.error(`${err.name}: ${err.message}`);
      }
    });
}

module.exports.getItems = getItems;
