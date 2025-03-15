import axios, { AxiosError, AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  DiscoverResponse,
  LoginPayload,
  LoginRequestResponseData,
  LoginResponseData,
  RefreshResponse,
  TgtgHeaders
} from '../types';
import { getLoginPin } from './gmail';

const MAX_POLLING_TRIES = 24; // 24 * POLLING_WAIT_TIME = 2 minutes
const POLLING_WAIT_TIME = 5000;
const BASE_URL = 'https://apptoogoodtogo.com';
const PATH = {
  LOGIN: '/api/auth/v5/authByEmail/',
  PIN: '/api/auth/v5/authByRequestPin/',
  REFRESH: '/api/auth/v5/token/refresh/',
  DISCOVER: '/api/discover/v1/bucket',
};


export abstract class ApiWrapper {

  public static cookie: string;

  private static makeRequest<T>(path: string, data: Record<string, any>, headers?: Record<string, string>): AxiosPromise<T> {
    const options: AxiosRequestConfig = {
      baseURL: BASE_URL,
      url: path,
      method: 'POST',
      headers: {
        ...this.getHeaders(),
        ...headers
      },
      data: data
    };

    return axios(options);
  }


  public static async login(email: string): Promise<AxiosResponse<LoginResponseData>> {
    const data: LoginPayload = {
      device_type: 'IOS',
      email
    };
    let retryCounter = 0;
    let pin: string = '';
    let loginResponse: AxiosResponse<LoginRequestResponseData>

    try {
      loginResponse = await ApiWrapper.makeRequest<LoginRequestResponseData>(PATH.LOGIN, data);
    } catch (err) {
      if ((err as AxiosError).response?.status === 429) {
        return Promise.reject((err as AxiosError).message);
      }
      if ((err as AxiosError).response?.status === 403) {
        const cookieHeader = (err as AxiosError).response?.headers['set-cookie']?.[0]?.split(';').shift();
        if (cookieHeader) {
          ApiWrapper.cookie = cookieHeader;
        }
        return Promise.reject((err as AxiosError).message);
      }
      return Promise.reject(err);
    }

    while (retryCounter < MAX_POLLING_TRIES && !pin) {
      retryCounter++;
      console.debug(`waiting for confirmation email [${retryCounter}]`)
      pin = await new Promise((resolve) => setTimeout(
        () => {
          getLoginPin()
            .then(res => {
              console.debug(`found pin: ${res}`);
              resolve(res);
            })
            .catch((err) => {
              console.error(err.message);
              console.debug(`failed to get code at try ${retryCounter}`, err);
            });
        },
        POLLING_WAIT_TIME
      ));
    }

    if (!pin) {
      return Promise.reject('Error during login');
    }

    data.request_polling_id = loginResponse.data.polling_id;
    data.request_pin = pin;

    return ApiWrapper.makeRequest<LoginResponseData>(PATH.PIN, data)
      .then(res => res)
      .catch(err => err);
  }


  public static refreshToken(token: string): AxiosPromise<RefreshResponse> {
    return ApiWrapper.makeRequest(PATH.REFRESH, { refresh_token: token });
  }


  public static getFavorites(authToken: string, latitude: string, longitude: string): AxiosPromise<DiscoverResponse> {
    const headers = {
      'Authorization': `Bearer ${authToken}`
    };
    const data = {
      radius: 5,
      paging: {
        page: 0,
        size: 50
      },
      origin: {
        latitude,
        longitude
      },
      bucket: {
        filler_type: 'Favorites'
      }
    }

    return ApiWrapper.makeRequest(PATH.DISCOVER, data, headers);
  }


  private static getHeaders(): TgtgHeaders {
    const userAgent = process.env.HEADER_UA;
    if (!userAgent) {
      throw new Error('no user agent set in env variables');
    }

    const headers: TgtgHeaders = {
      'Content-Type': 'application/json',
      'User-Agent': userAgent
    };
    if (this.cookie) {
      headers['Cookie'] = this.cookie;
    }
    return headers;
  }
} 
