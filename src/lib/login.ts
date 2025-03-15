import * as fs from 'fs';

import { alertzy } from './alertzy';
import { ApiWrapper } from './api';
import { AlertzyPriority, Credentials } from '../types';


const tokenLifetime = 48 * 3600 * 1000;

export async function checkCredentials(): Promise<Credentials | void> {
  let credentials = null;
  if (!fs.existsSync('./credentials.json')) {
    console.info('No credentials found, logging in...');
    return await login();
  } else {
    credentials = JSON.parse(fs.readFileSync('./credentials.json', { encoding: 'utf-8' })) as Credentials;
    if (Date.now() - credentials.timestamp > tokenLifetime) {
      console.info('Credentials invalid, refreshing token...');
      return await refresh(credentials);

    } else {
      console.info('Credentials found & valid');
      if (credentials.cookie) {
        ApiWrapper.cookie = credentials.cookie;
      }
      return credentials;
    }
  }
}

function login(): Promise<Credentials | void> {
  let credentials: Credentials;
  const email = process.env.TGTG_EMAIL || '';
  return ApiWrapper.login(email)
    .then(res => {
      credentials = {
        access_token: res.data.access_token,
        refresh_token: res.data.refresh_token,
        timestamp: Date.now()
      };
      const cookieHeader = res.headers['set-cookie']?.[0]?.split(';').shift();
      if (cookieHeader) {
        credentials.cookie = cookieHeader;
        ApiWrapper.cookie = cookieHeader;
      }
      console.info('Received tokens');
      fs.writeFileSync('./credentials.json', JSON.stringify(credentials, null, 2));
      return Promise.resolve(credentials);
    })
    .catch(err => {
      console.error(err);
      alertError(err);
      return Promise.resolve();
    });
}

function refresh(credentials: Credentials): Promise<Credentials> {
  return ApiWrapper.refreshToken(credentials.refresh_token)
    .then(res => {
      credentials = {
        ...credentials,
        access_token: res.data.access_token,
        refresh_token: res.data.refresh_token,
        timestamp: Date.now()
      };
      fs.writeFileSync('./credentials.json', JSON.stringify(credentials, null, 2));
      return Promise.resolve(credentials);
    })
    .catch(err => {
      console.error(err);
      alertError(err);
      return Promise.reject();
    });
}

function alertError(err: Error) {
  if (process.env.ALERTZY_KEY) {
    alertzy(
      process.env.ALERTZY_KEY,
      'LoginError',
      err.message,
      'TGTG-error',
      AlertzyPriority.CRITICAL
    );
  }
}
