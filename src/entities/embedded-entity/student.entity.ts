import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Name } from "./name";


@Entity('student')
export class Student {
  @PrimaryGeneratedColumn()
  id: number

  @Column(() => Name)
  name: Name

  @Column("varchar")
  faculty: string
}