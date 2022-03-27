import { Router } from 'express';
import * as fs from 'fs';
import * as jsonc from 'jsonc-parser';
import { Recipient } from '../types';


const updateRouter = Router();

updateRouter.post('/', (req, res, next) => {
  const headers = req.headers;
  const userId = headers['x-user-id'];
  if (!userId) {
    res.status(400).send('USER_ID_MISSING');
    return;
  }

  const recipients: Array<Recipient> = jsonc.parse(fs.readFileSync('./recipients.jsonc', { encoding: 'utf-8' })) || [];
  const userIndex = recipients.findIndex(r => r.notifyKey === userId);
  
  if (userIndex === -1) {
    res.status(404).send('USER_NOT_FOUND');
    return;
  }
  
  const user = recipients[userIndex];
  const pauseNotifications = req.body?.pauseNotifications;

  if (typeof pauseNotifications !== 'boolean') {
    res.status(400).send('INVALID_PAYLOAD');
    return;
  }

  user.pauseNotifications = pauseNotifications;

  recipients.splice(userIndex, 1, user);

  fs.writeFileSync('recipients.jsonc',JSON.stringify(recipients, null, 2));

  res.status(200).send();
});

export default updateRouter;