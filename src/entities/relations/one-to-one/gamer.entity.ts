import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm"
import { Profile } from "./profile.entity"

@Entity('gamer')
export class Gamer {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @OneToOne(() => Profile, (profile) => profile.gamer, {
    cascade: true,
  })
  @JoinColumn({
    name: "gamer_profile"
  })
  profile: Profile
}