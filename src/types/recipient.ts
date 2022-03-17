export enum NOTIFY {
  EMAIL = 'email',
  ALTERTZY = 'alertzy',
  PUSHOVER = 'pushover'
}

export interface Recipient {
  name: string;
  trigger: 'always' | 'available';
  notifyBy: NOTIFY;
  notifyKey: string;
  locations: Array<string>;
}