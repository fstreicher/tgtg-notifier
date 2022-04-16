import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Location {
  @PrimaryColumn()
  public id: number;

  @Column({ length: 64 })
  public name: string;

  @Column({ length: 32 })
  public city: string;
}