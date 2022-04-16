import { Router } from 'express';
import { DataBaseConnector } from '../lib/db-connector';
import { Recipient } from '../lib/typeORM';

const updateRouter = Router();

updateRouter.post('/', (req, res, next) => {
  const headers = req.headers;
  const userNotifyKey = headers['x-user-id'];
  if (!userNotifyKey) {
    res.status(400).send('USER_ID_MISSING');
    return;
  }

  const recipients: Array<Recipient> = DataBaseConnector.getRecipients();
  const user = recipients.find(r => r.notify_key === userNotifyKey);

  if (!user) {
    res.status(404).send('USER_NOT_FOUND');
    return;
  }

  const pauseNotifications = req.body?.pauseNotifications;

  if (typeof pauseNotifications !== 'boolean') {
    res.status(400).send('INVALID_PAYLOAD');
    return;
  }

  DataBaseConnector.updateNotifcationStatus(user.id, pauseNotifications)
    .then(() => res.status(200).send('SUCCESS'))
    .catch(err => res.status(500).send(err));
});

export default updateRouter;