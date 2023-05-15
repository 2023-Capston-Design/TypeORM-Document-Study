import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { WithoutMany2One } from "./withoutmany2one.entity";

@Entity('exampledb')
export class ExampleTest {
  @PrimaryGeneratedColumn()
  id: number

  @Column("varchar")
  field: string

  @ManyToOne(() => WithoutMany2One, (obj) => obj.id)
  members: WithoutMany2One[] | WithoutMany2One

  constructor(data: Omit<ExampleTest, 'id'>) {
    Object.assign(this, data)
  }
}