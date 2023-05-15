import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('without')
export class WithoutMany2One {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar')
  example: string

  constructor(data: Omit<WithoutMany2One, 'id'>) {
    Object.assign(this, data)
  }
}