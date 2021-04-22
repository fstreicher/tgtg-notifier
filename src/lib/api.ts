import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';
import { Item, LoginResponse, RefreshResponse } from '../types';

const userAgent = 'TooGoodToGo/20.2.0 (740) (iPhone/iPhone X (GSM); iOS 13.3.1; Scale/3.00)';

export class ApiWrapper {
  public static login(email: string, password: string): AxiosPromise<LoginResponse> {
    const options: AxiosRequestConfig = {
      baseURL: 'https://apptoogoodtogo.com',
      url: '/api/auth/v1/loginByEmail/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': userAgent
      },
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
      baseURL: 'https://apptoogoodtogo.com',
      url: '/api/auth/v1/token/refresh/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': userAgent
      },
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
      baseURL: 'https://apptoogoodtogo.com',
      url: '/api/item/v7/',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'User-Agent': 'TooGoodToGo/20.2.0 (740) (iPhone/iPhone X (GSM); iOS 13.3.1; Scale/3.00)'
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
