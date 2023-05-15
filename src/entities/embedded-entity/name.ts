import { Column, PrimaryGeneratedColumn } from "typeorm";

export class Name {
  @Column("varchar")
  firstname: string

  @Column("varchar")
  lastname: string
}