import * as fs from 'fs';
import * as jsonc from 'jsonc-parser';

import { AlertzyPriority, Item, ItemHistory, NotificationItems, NOTIFY, Recipient, TgtgError } from '../types';
import { alertzy } from './alertzy';
import { ApiWrapper } from './api';
import { checkCredentials } from './login';
import { transporter } from './nodemailer';
import { pushover } from './pushover';



export async function scrapeFavorites(): Promise<void> {

  const credentials = await checkCredentials();

  if (credentials && process.env.TGTG_USER_ORIGIN) {

    ApiWrapper.getFavorites(
      credentials.user_id,
      credentials.access_token,
      process.env.TGTG_USER_ORIGIN.split(',')[0],
      process.env.TGTG_USER_ORIGIN.split(',')[1]

    )
      .then(res => {
        const items: Array<Item> = res.data.items;
        fs.writeFileSync('./current-favorites.json', JSON.stringify(items, null, 2));
        let lastItems: ItemHistory = {};
        if (fs.existsSync('./lastItems/favorites.json')) {
          lastItems = JSON.parse(fs.readFileSync('./lastItems/favorites.json', { encoding: 'utf-8' }));
        } else {
          items.forEach((item: Item) => lastItems[item.item.item_id] = item.items_available);
        }

        const recipients: Array<Recipient> = jsonc.parse(fs.readFileSync('./recipients.jsonc', { encoding: 'utf-8' })) || [];

        recipients.forEach(target => {
          console.info(`\nChecking items for ${target.name}`);
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

          if (notificationItems.notify && !target.pauseNotifications) {
            console.info(`    \u27f9  Sending notification about ${notificationItems.items.length} item(s) to ${target.name} via ${target.notifyBy}`);
            switch (target.notifyBy) {
              case NOTIFY.EMAIL:
                transporter.sendMail({
                  from: `"TGTG Notifier" <${process.env.NODEMAILER_SENDER}>`,
                  to: `"${target.name}" <${target.notifyKey}>`,
                  subject: `Your favorite locations have items available!`,
                  html: notificationItems.items.map(item => `${item.locationName}: <b>${item.numAvailable}</b>`).join('<br>')
                });
                break;
              case NOTIFY.ALTERTZY:
                alertzy(
                  target.notifyKey,
                  'TooGoodToGo',
                  notificationItems.items.map(item => `${item.locationName}: ${item.numAvailable}`).join('\n')
                );
                break;
              case NOTIFY.PUSHOVER:
                pushover(
                  process.env.PUSHOVER_KEY,
                  target.notifyKey,
                  'TooGoodToGo',
                  notificationItems.items.map(item => `${item.locationName}: <b>${item.numAvailable}</b>`).join('\n')
                );
                break;
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
}

function sendError(err: TgtgError) {
  if (!fs.existsSync('./reqFailed.txt')) {
    console.info('  \u27f9  Sending error notification!');
    fs.writeFileSync('./reqFailed.txt', '1');
    if (process.env.ALERTZY_KEY) {
      alertzy(
        process.env.ALERTZY_KEY,
        `TGTG Notifier Error${err.response?.status ? ': ' + err.response.status : ''}`,
        `${err.response.data.error}: ${err.message}`,
        AlertzyPriority.CRITICAL
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
        err.message,
        AlertzyPriority.HIGH
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
