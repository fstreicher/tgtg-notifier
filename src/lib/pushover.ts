import axios, { AxiosRequestConfig } from 'axios';
import { PushoverPriority, TPushoverPriority } from '../types';

export function pushover(
  appToken: string,
  userKey: string,
  title: string,
  message: string,
  prio: TPushoverPriority = PushoverPriority.NORMAL
): void {

  const params = new URLSearchParams();
  params.append('token', encodeURIComponent(appToken));
  params.append('user', encodeURIComponent(userKey));
  params.append('title', encodeURIComponent(title));
  params.append('message', encodeURIComponent(message));
  params.append('html', '1');
  params.append('priority', prio.toString());

  const options: AxiosRequestConfig = {
    baseURL: 'https://api.pushover.net',
    url: `/1/messages.json?${params.toString()}`,
    method: 'POST'
  };

  axios.request(options)
    .catch(err => console.error(err));
}
