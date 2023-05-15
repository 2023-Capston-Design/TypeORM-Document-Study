import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Content } from "./content";


@Entity('photo')
export class Photo extends Content {
  @Column("varchar")
  size: string
}