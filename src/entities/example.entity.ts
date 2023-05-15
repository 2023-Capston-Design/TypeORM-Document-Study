import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

type exampleJSON = {
  name: string
  age: number
  description?: string
}


@Entity('example')
export class Example {
  @PrimaryGeneratedColumn()
  id: number

  @Column("json")
  info: exampleJSON

  constructor(data: {
    info: exampleJSON
  }) {
    Object.assign(this, data)
  }
}