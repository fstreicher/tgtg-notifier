import { AxiosResponse } from 'axios';

export interface TgtgError extends Error {
  isAxiosError: true;
  response: AxiosResponse;
}