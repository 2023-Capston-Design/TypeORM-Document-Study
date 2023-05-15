import { Column, Entity, PrimaryGeneratedColumn, TableInheritance } from "typeorm";

@Entity('singletest')
@TableInheritance({
  column: {
    type: "varchar",
    name: "type"
  }
})
export class singletest {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string
}