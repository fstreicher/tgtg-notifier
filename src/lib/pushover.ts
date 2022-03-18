import axios, { AxiosRequestConfig } from 'axios';

import { PushoverPriority } from '../types';

export function pushover(appToken: string, userKey: string, title: string, message: string, prio = PushoverPriority.NORMAL): void {

  let url = '/1/messages.json';
  url += `?token=${encodeURIComponent(appToken)}`;
  url += `&user=${encodeURIComponent(userKey)}`;
  url += `&title=${encodeURIComponent(title)}`;
  url += `&message=${encodeURIComponent(message)}`;
  url += `&html=1`;
  url += `&priority=${prio}`;

  const options: AxiosRequestConfig = {
    baseURL: 'https://api.pushover.net',
    url,
    method: 'POST'
  };

  axios.request(options)
    .catch(err => console.error(err));
}
