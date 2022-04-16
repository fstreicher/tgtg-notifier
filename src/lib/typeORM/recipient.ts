import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Location } from './location';

@Entity()
export class Recipient {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ length: 64 })
  public name: string;

  @Column({ type: 'enum', enum: ['email', 'alertzy', 'pushover'] })
  public notify_by: 'email' | 'alertzy' | 'pushover';

  @Column({ length: 64 })
  public notify_key: string;

  @Column({ type: 'enum', enum: ['available', 'always'] })
  public trigger: 'available' | 'always';

  @Column()
  public pause_notifications: 0 | 1;

  @ManyToMany(() => Location)
  @JoinTable()
  locations: Location[]
}