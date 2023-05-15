import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Content } from "./content";

@Entity('post')
export class Post extends Content {
  @Column("int")
  viewCount: number
}