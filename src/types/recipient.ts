export const NOTIFY = {
  EMAIL: 'email',
  ALTERTZY: 'alertzy',
  PUSHOVER: 'pushover'
} as const;

export interface Recipient {
  name: string;
  trigger: 'always' | 'available';
  notifyBy: typeof NOTIFY[keyof typeof NOTIFY];
  notifyKey: string;
  locations: Array<string>;
}