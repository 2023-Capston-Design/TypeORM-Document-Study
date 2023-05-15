import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Name } from "./name";

@Entity('employee')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number

  @Column(() => Name)
  name: Name

  @Column("int")
  salary: number
}
