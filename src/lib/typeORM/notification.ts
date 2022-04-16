import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('int')
  public recipient_id: number;

  @Column('int')
  public location_id: number;
}