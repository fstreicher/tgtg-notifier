# TGTG Notifier

A command line tool that monitors your favorite TooGoodToGo stores and notifies you, when they have items available.

---

## Usage
### 1. Create an `.env` file according to the template.

- Your GMail data is used to send emails via [nodemailer](https://nodemailer.com/):
```
GMAIL_USER=
GMAIL_PW=
```

- Configure your outgoing nodemailer settings (these will also be used to send you notifications about any erros that might occur):
```
NODEMAILER_SENDER=
NODEMAILER_SENDER_NAME=
```

- Enter your [alertzy](https://alertzy.app/) key, if you want to receive push notifications instead of emails (this is optional):
```
ALERTZY_KEY=
```

- Enter your [Pushover](https://pushover.net/apps/build) app token, if you want to send push notifications via pushover:
```
PUSHOVER_KEY=
```

- Finally, enter your TGTG login data and any coordinates as your origin (this is needed for getting any stores, and I didn't feel like generating random coordinates). Additionally, set the most recent user agent, old ones are blocked by the TGTG API:
```
TGTG_EMAIL=
TGTG_PASSWORD=
TGTG_USER_ORIGIN=
HEADER_UA=
```

### 2. Configure notification recipients
- Create a `recipients.jsonc` according to the template. This file is read every iteration, so you don't need to restart the service if you change any information.
```jsonc
{
  "name": "firstName lastName",
  "trigger": "always | available",
  "notifyBy": "email | alertzy | pushover",
  "notifyKey": "email | key",
  "locations": [
    "item_id", // comment
  ]
}
```
- `name` is the name used for sending out emails  
- `trigger` defines when a user should be notified.
  - `always` notifies whenever there is a change in available items (eg: `3 -> 2 -> 1`, but only for `>0` )
  - `available` only notifies users, once the stock changes from `0` to `>0`
- `notifyBy` the channel on which the recipient wants to receive updates
- `notifyKey` is the users email adress to receive notification emails, or the users key for the app (alertzy, Pushover)
- `locations` is an array of item ids (which you will need to find out yourself 😉)


### 3. Adjust your execution intervals
- In [src/lib/cron.js](src/lib/cron.ts) you can tweak, when the tool should check for available items

### 4. Start the service
- install and compile  
`npm i && npm run build`
- run  
`npm start`