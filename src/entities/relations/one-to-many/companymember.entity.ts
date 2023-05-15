import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Department } from "./department.entity";

@Entity('companymember')
export class CompanyMember {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar', {
    nullable: false,
    unique: false
  })
  name: string

  @Column('int', {
    nullable: false,
    unique: false
  })
  age: number

  @Column('text', {
    nullable: true,
    unique: false
  })
  description: string

  // Cacade should be defined in one side
  // TypeORMError: Relation Department#member and CompanyMember#department both has cascade remove set. This may lead to unexpected circular removals. Please set cascade remove only from one side of relationship.
  @ManyToOne(() => Department, (department) => department.member, {
    cascade: true
  })
  @JoinColumn({
    name: 'department_id'
  })
  department: Department

  constructor(obj: Omit<Partial<CompanyMember>, 'id'>) {
    Object.assign(this, obj)
  }
}