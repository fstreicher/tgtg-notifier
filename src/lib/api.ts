import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { ItemResponse, LoginResponse, RefreshResponse } from '../types';

const BASE_URL = 'https://apptoogoodtogo.com';
const PATH = {
  LOGIN: '/api/auth/v2/loginByEmail/',
  REFRESH: '/api/auth/v2/token/refresh/',
  ITEM: '/api/item/v7/'
};
const HEADERS = {
  'Content-Type': 'application/json',
  'User-Agent': 'TooGoodToGo/21.3.0 (935) (iPhone/iPhone X (GSM); iOS 14.4.2; Scale/3.00)'
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

  public static login(email: string, password: string): AxiosPromise<LoginResponse> {
    const data = {
      device_type: 'IOS',
      email: email,
      password: password
    }
    return ApiWrapper.makeRequest(PATH.LOGIN, data);
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
