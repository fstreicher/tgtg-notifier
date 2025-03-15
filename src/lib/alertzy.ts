import axios, { AxiosRequestConfig } from 'axios';
import { AlertzyPriority, type TAlertzyPriority } from '../types';

export function alertzy(
  key: string,
  title: string,
  message: string,
  group?: string,
  priority: TAlertzyPriority = AlertzyPriority.NORMAL
): void {

  const paramObj = {
    accountKey: key,
    title,
    message,
    priority,
    group
  };

  // Filter out undefined values
  const params = new URLSearchParams(
    Object.entries(paramObj)
      .filter(([_, value]) => value !== undefined)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
  );

  const options: AxiosRequestConfig = {
    baseURL: 'https://alertzy.app',
    url: `/send?${params.toString()}`,
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
