export interface LoginPayload {
  device_type: 'IOS' | 'ANDROID';
  email: string;
  request_polling_id?: string;
  request_pin?: string;
}