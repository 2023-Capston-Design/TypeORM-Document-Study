import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Question2 } from "./question2.entity";

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToMany(() => Question2, (question) => question.categories)
  questions: Question2[]

  constructor(data: Omit<Category, 'id' | 'questions'>) {
    Object.assign(this, data)
  }
}