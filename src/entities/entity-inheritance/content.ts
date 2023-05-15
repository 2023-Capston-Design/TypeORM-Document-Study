import { Column, PrimaryGeneratedColumn } from "typeorm";

export abstract class Content {
  @PrimaryGeneratedColumn()
  id: number

  @Column("varchar")
  title: string

  @Column("text")
  description: string
}