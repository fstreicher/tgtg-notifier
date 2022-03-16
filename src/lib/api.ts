import axios, { AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios';

import { ItemResponse, LoginPayload, LoginRequestResponse, LoginResponse, RefreshResponse } from '../types';
import { getLoginPin } from './gmail';

const MAX_POLLING_TRIES = 24; // 24 * POLLING_WAIT_TIME = 2 minutes
const POLLING_WAIT_TIME = 5000;
const BASE_URL = 'https://apptoogoodtogo.com';
const PATH = {
  LOGIN: '/api/auth/v3/authByEmail/',
  PIN: '/api/auth/v3/auhtByRequestPin/',
  REFRESH: '/api/auth/v3/token/refresh/',
  ITEM: '/api/item/v7/'
};
const HEADERS = {
  'Content-Type': 'application/json',
  'User-Agent': 'TooGoodToGo/22.1.1 (1203) (iPhone/iPhone X (GSM); iOS 15.1; Scale/3.00)'
};

export abstract class ApiWrapper {

  private static makeRequest<T>(path: string, data: Record<string, any>, headers?: Record<string, string>): AxiosPromise<T> {
    const options: AxiosRequestConfig = {
      baseURL: BASE_URL,
      url: path,
      method: 'POST',
      headers: {
        ...HEADERS,
        ...headers
      },
      data: data
    };

    return axios(options);
  }


  public static async login(email: string): Promise<LoginResponse> {
    const data: LoginPayload = {
      device_type: 'IOS',
      email: email
    };
    let retryCounter = 0;
    let pin: string = '';
    let loginResponse: LoginRequestResponse;

    try {
      loginResponse = (await ApiWrapper.makeRequest<LoginRequestResponse>(PATH.LOGIN, data)).data;
    } catch (err) {
      if ((err as AxiosError).response?.status === 429) {
        return Promise.reject((err as AxiosError).message);
      }
      return Promise.reject(err);
    }

    while (retryCounter < MAX_POLLING_TRIES && !pin) {
      retryCounter++;
      console.debug('waiting for confirmation email')
      pin = await new Promise((resolve) => setTimeout(
        () => {
          getLoginPin()
            .then(res => {
              console.debug(`found pin: ${res}`);
              resolve(res);
            })
            .catch(() => console.debug(`failed to get code at try ${retryCounter}`));
        },
        POLLING_WAIT_TIME
      ));
    }

    if (!pin) {
      return Promise.reject('Error during login');
    }

    data.request_polling_id = loginResponse.polling_id;
    data.request_pin = pin;

    return ApiWrapper.makeRequest<LoginResponse>(PATH.PIN, data)
      .then(res => res)
      .catch(err => err);
  }


  public static refreshToken(token: string): AxiosPromise<RefreshResponse> {
    return ApiWrapper.makeRequest(PATH.REFRESH, { refresh_token: token });
  }


  public static getFavorites(userId: string, authToken: string, lat: string, long: string): AxiosPromise<ItemResponse> {
    const headers = {
      'Authorization': `Bearer ${authToken}`
    };
    const data = {
      user_id: userId,
      origin: {
        latitude: lat,
        longitude: long
      },
      radius: 0,
      favorites_only: true
    }

    return ApiWrapper.makeRequest(PATH.ITEM, data, headers);
  }
}
