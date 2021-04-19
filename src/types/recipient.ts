export interface Recipient {
  name: string;
  trigger: 'always' | 'available';
  alertzyKey?: string;
  email?: string;
  locations: Array<string>;
}