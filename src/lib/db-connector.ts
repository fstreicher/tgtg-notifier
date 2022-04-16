import { Recipient } from './typeORM';
import { AppDataSource } from './typeORM/data-source';

export class DataBaseConnector {

  // TODO use RecipientDTO with joined locations

  public static getRecipients(): Promise<Array<Recipient>> {
    return AppDataSource.manager.find(Recipient);
    // [{
    //   id: 1,
    //   name: 'Fabian Streicher',
    //   notify_by: 'alertzy',
    //   notify_key: 'foobar',
    //   pause_notifications: 0,
    //   trigger: 'available',
    //   locations: []
    // }];
  }

  public static getLocationsForRecipient(key: string): Promise<Array<Notification>> {
    return AppDataSource.manager.findBy(Notification, {recipient_id: key});
  }

  public static updateNotifcationStatus(userId: number, pauseNotifications: boolean): Promise<void> {
    return Promise.resolve();
  }
}