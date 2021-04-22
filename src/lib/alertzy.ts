import * as https from 'https';
import { AlertzyPriority } from '../types';

export function alertzy(key: string, title: string, message: string, prio: AlertzyPriority = AlertzyPriority.NORMAL): void {

  const options: https.RequestOptions = {
    hostname: 'alertzy.app',
    path: `/send?accountKey=${encodeURIComponent(key)}&title=${encodeURIComponent(title)}&message=${encodeURIComponent(message)}&priority=${prio}`,
    method: 'POST'
  };

  const req = https.request(options);

  req.on('error', e => {
    console.error(e);
  });

  req.end();
}
