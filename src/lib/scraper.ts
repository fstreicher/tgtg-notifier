import * as fs from 'fs';
import * as jsonc from 'jsonc-parser';
import { getFavorites } from './api';
import { transporter } from './nodemailer';
import { Item, ItemHistory, NotificationItems, Recipient, TgtgError } from '../types';
import { alertzy } from './alertzy';


export async function scrapeFavorites(): Promise<void> {
  getFavorites()
    .then(res => {
      const items: Array<Item> = res.data.items;
      let lastItems: ItemHistory = {};
      if (!fs.existsSync('./lastItems/favorites.json')) {
        items.forEach((item: Item) => lastItems[item.item.item_id] = item.items_available);
      } else {
        lastItems = JSON.parse(fs.readFileSync('./lastItems/favorites.json', { encoding: 'utf-8' }));
      }

      const recipients: Array<Recipient> = jsonc.parse(fs.readFileSync('./recipients.jsonc', { encoding: 'utf-8' })) || [];

      recipients.forEach(target => {
        const notificationItems: NotificationItems = { notify: false, items: [] };
        target.locations.forEach(location => {
          const currentItem = items.find(item => item.item.item_id === location);
          if (!currentItem) {
            notifyMissingItem(new Error(`Item not found: ${location}`));
            return;
          }
          if (currentItem.items_available > 0) {
            if (!(currentItem.items_available === lastItems[currentItem.item.item_id])) {
              notificationItems.items.push({ locationName: currentItem.display_name, numAvailable: currentItem.items_available });
              console.info(` | ${currentItem.display_name} has ${currentItem.items_available} items available, adding to queue.`);

              if (target.trigger === 'available' && lastItems[location] !== 0) {
                console.info(`   \u27f9  skipping notification to ${target.name} with trigger: ${target.trigger}`);
                return;
              }
              notificationItems.notify = true;

            } else {
              console.info(` | ${currentItem.display_name} still has ${currentItem.items_available} items available, not adding item to queue.`);
            }
          } else {
            console.info(` | ${currentItem.display_name} has no items available.`);
          }

        });
        if (notificationItems.notify) {
          if (target.alertzyKey) {
            console.info(`    \u27f9  Sending push notification about ${notificationItems.items.length} item(s) to ${target.name}.`);
            alertzy(
              target.alertzyKey,
              'TooGoodToGo',
              notificationItems.items.map(item => `${item.locationName}: ${item.numAvailable}`).join('\n')
            );
          }

          if (target.email) {
            console.info(`    \u27f9  Sending mail with notification about ${notificationItems.items.length} item(s) to ${target.name}.`);
            transporter.sendMail({
              from: `"TGTG Notifier" <${process.env.NODEMAILER_SENDER}>`,
              to: `"${target.name}" <${target.email}>`,
              subject: `Your favorite locations have items available!`,
              html: notificationItems.items.map(item => `${item.locationName}: <b>${item.numAvailable}</b>`).join('<br>')
            });
          }
        }
      });

      items.forEach(item => lastItems[item.item.item_id] = item.items_available);
      fs.writeFileSync('./lastItems/favorites.json', JSON.stringify(lastItems, null, 2));
    })
    .catch((err: TgtgError) => {
      console.error(`${err.name}: ${err.message}`);
      sendError(err);
    });
}

function sendError(err: TgtgError) {
  if (!fs.existsSync('./reqFailed.txt')) {
    console.info('  \u27f9  Sending error notification!');
    fs.writeFileSync('./reqFailed.txt', '1');
    if (process.env.ALERTZY_KEY) {
      alertzy(
        process.env.ALERTZY_KEY,
        `TGTG Notifier Error${err.response?.status ? ': ' + err.response.status : ''}`,
        `${err.response.data.error}: ${err.message}`
      );
    } else {
      transporter.sendMail({
        from: `"TGTG Notifier" <${process.env.NODEMAILER_SENDER}>`,
        to: `"${process.env.NODEMAILER_SENDER_NAME}" <${process.env.NODEMAILER_SENDER}>`,
        subject: `\u2757 TGTG Error: ${err.response && err.response.status ? err.response.status : err.message}`,
        text: `TGTG Error: ${err.response.data.error || ''}\n${err.message}\n${err.stack}`,
        html: `TGTG Error: <b>${err.response.data.error || ''}</b>\n${err.message}\n${err.stack}`
      });
    }
  }
}

function notifyMissingItem(err: Error) {
  if (!fs.existsSync('./reqFailed.txt')) {
    console.info('  \u27f9  Sending error notification!');
    fs.writeFileSync('./reqFailed.txt', '1');
    if (process.env.ALERTZY_KEY) {
      alertzy(
        process.env.ALERTZY_KEY,
        'TGTG Notifier Warning: Missing Item',
        err.message
      );
    } else {
      transporter.sendMail({
        from: `"TGTG Notifier" <${process.env.NODEMAILER_SENDER}>`,
        to: `"${process.env.NODEMAILER_SENDER_NAME}" <${process.env.NODEMAILER_SENDER}>`,
        subject: `\u2757 TGTG Warning: Missing Item`,
        text: `TGTG Error: ${err.name || ''}\n${err.message}\n${err.stack}`,
        html: `TGTG Error: <b>${err.name || ''}</b>\n${err.message}\n${err.stack}`
      });
    }
  }
}


module.exports.scrapeFavorites = scrapeFavorites;
