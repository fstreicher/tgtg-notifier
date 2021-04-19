export interface NotificationItems {
  notify: boolean;
  items: Array<NotificationItem>
}

interface NotificationItem {
  locationName: string;
  numAvailable: number;
}