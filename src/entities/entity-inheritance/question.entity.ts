import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Content } from "./content";

@Entity('question')
export class Question extends Content {
  @Column("int")
  answerCount: number
}