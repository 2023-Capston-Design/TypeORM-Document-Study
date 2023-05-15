import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm"
import { Gamer } from "./gamer.entity"

export enum Gender {
  MALE = "male",
  FEMALE = "FEMALE"
}

@Entity('profile')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number

  @Column("enum", {
    enum: Gender
  })
  gender: string

  @Column()
  photo: string

  @OneToOne(() => Gamer, (gamer) => gamer.profile)
  gamer: Gamer
}