export interface TgtgError extends Error {
  isAxiosError: true;
  response: {
    status: number;
    statusText: string;
    data: {
      error: string;
      message: string;
      path: string;
      status: number;
      timestamp: number;
    }
  }
}