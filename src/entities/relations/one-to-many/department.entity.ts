import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CompanyMember } from "./companymember.entity";


@Entity('department')
export class Department {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar', {
    unique: true,
    nullable: false
  })
  name: string


  @OneToMany(() => CompanyMember, (member) => member.department)
  member: CompanyMember | CompanyMember[]

  constructor(obj: Omit<Partial<Department>, 'id'>) {
    Object.assign(this, obj)
  }
}