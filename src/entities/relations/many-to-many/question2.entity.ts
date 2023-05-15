import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./category.entity";

@Entity('question2')
export class Question2 {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  text: string

  @ManyToMany(() => Category, (category) => category.questions, {
    cascade: true,
  })
  @JoinTable()
  categories: Category[]

  constructor(data: Omit<Question2, 'id'>) {
    Object.assign(this, data)
  }
}