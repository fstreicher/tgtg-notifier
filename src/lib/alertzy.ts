import * as https from 'https';

export function alertzy(key: string, title: string, message: string): void {

  const options: https.RequestOptions = {
    hostname: 'alertzy.app',
    path: `/send?accountKey=${encodeURIComponent(key)}&title=${encodeURIComponent(title)}&message=${encodeURIComponent(message)}`,
    method: 'POST'
  };

  const req = https.request(options);

  req.on('error', e => {
    console.error(e);
  });

  req.end();
}
