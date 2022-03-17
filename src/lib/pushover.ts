import axios, { AxiosRequestConfig } from 'axios';

import { PushoverPriority } from '../types';

export function pushover(appToken: string, userKey: string, title: string, message: string, prio = PushoverPriority.NORMAL): void {

  const options: AxiosRequestConfig = {
    baseURL: 'https://api.pushover.net',
    url: `/1/messages.json?token=${encodeURIComponent(appToken)}&user=${encodeURIComponent(userKey)}&title=${encodeURIComponent(title)}&message=${encodeURIComponent(message)}&priority=${prio}`,
    method: 'POST'
  };

  axios.request(options)
    .catch(err => console.error(err));
}
