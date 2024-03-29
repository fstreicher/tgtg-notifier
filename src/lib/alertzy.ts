import axios, { AxiosRequestConfig } from 'axios';

import { AlertzyPriority } from '../types';

export function alertzy(key: string, title: string, message: string, prio: AlertzyPriority = AlertzyPriority.NORMAL): void {

  const options: AxiosRequestConfig = {
    baseURL: 'https://alertzy.app',
    url: `/send?accountKey=${encodeURIComponent(key)}&title=${encodeURIComponent(title)}&message=${encodeURIComponent(message)}&priority=${prio}`,
    method: 'POST'
  };

  axios.request(options)
    .then(res => {
      if (res.data?.response === 'fail') {
        console.error(res.data.error);
      }
    })
    .catch(err => console.error(err));
}
