import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';
import { Item, LoginResponse, RefreshResponse } from '../types';

const USER_AGENT = 'TooGoodToGo/21.3.0 (935) (iPhone/iPhone X (GSM); iOS 14.4.2; Scale/3.00)';
const BASE_URL = 'https://apptoogoodtogo.com';
const PATH = {
  LOGIN: '/api/auth/v2/loginByEmail/',
  REFRESH: '/api/auth/v2/token/refresh/',
  ITEM: '/api/item/v7/'
};
const HEADERS = {
  'Content-Type': 'application/json',
  'User-Agent': USER_AGENT
};

export abstract class ApiWrapper {
  public static login(email: string, password: string): AxiosPromise<LoginResponse> {
    const options: AxiosRequestConfig = {
      baseURL: BASE_URL,
      url: PATH.LOGIN,
      method: 'POST',
      headers: HEADERS,
      data: {
        device_type: 'IOS',
        email: email,
        password: password
      }
    };

    return axios(options);
  }

  public static refreshToken(token: string): AxiosPromise<RefreshResponse> {
    const options: AxiosRequestConfig = {
      baseURL: BASE_URL,
      url: PATH.REFRESH,
      method: 'POST',
      headers: HEADERS,
      data: {
        refresh_token: token
      }
    };

    return axios(options);
  }


  public static getFavorites(
    userId: string,
    authToken: string,
    lat: string,
    long: string
  ): AxiosPromise<{ items: Array<Item> }> {
    const options: AxiosRequestConfig = {
      baseURL: BASE_URL,
      url: PATH.ITEM,
      method: 'POST',
      headers: {
        ...HEADERS,
        'Authorization': `Bearer ${authToken}`
      },
      data: {
        user_id: userId,
        origin: {
          latitude: lat,
          longitude: long
        },
        radius: 0,
        favorites_only: true
      }
    };

    return axios(options);

  }
}
