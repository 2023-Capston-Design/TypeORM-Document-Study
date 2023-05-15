import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Name } from "./name";

@Entity('teacher')
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number

  @Column(() => Name)
  name: Name

  @Column("int")
  class: number
}