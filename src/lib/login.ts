import * as fs from 'fs';

import { alertzy } from './alertzy';
import { ApiWrapper } from './api';
import { AlertzyPriority, Credentials } from '../types';


const tokenLifetime = 4 * 3600 * 1000;

export async function checkCredentials(): Promise<Credentials> {
  let credentials = null;
  if (!fs.existsSync('./credentials.json')) {
    console.info('No credentials found, logging in...');
    return await login();
  } else {
    credentials = JSON.parse(fs.readFileSync('./credentials.json', { encoding: 'utf-8' }));
    if (Date.now() - credentials.timestamp > tokenLifetime) {
      console.info('Credentials invalid, refreshing token...');
      return await refresh(credentials);
    }
    else {
      console.info('Credentials found & valid');
      return credentials;
    }
  }
}

function login(): Promise<Credentials> {
  let credentials: Credentials;
  const email = process.env.TGTG_EMAIL || '';
  const password = process.env.TGTG_PASSWORD || '';
  return ApiWrapper.login(email, password)
    .then(res => {
      credentials = {
        access_token: res.data.access_token,
        refresh_token: res.data.refresh_token,
        timestamp: Date.now()
      }
      console.info('Logged in');
      fs.writeFileSync('./credentials.json', JSON.stringify(credentials, null, 2));
      return Promise.resolve(credentials);
    })
    .catch(err => {
      console.error(err);
      alertError(err);
      return Promise.reject();
    });
}


function refresh(credentials: Credentials): Promise<Credentials> {
  return ApiWrapper.refreshToken(credentials.refresh_token)
    .then(res => {
      credentials = {
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
      AlertzyPriority.CRITICAL
    );
  }
}
