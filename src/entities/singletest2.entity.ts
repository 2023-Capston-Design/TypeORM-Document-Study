import { ChildEntity, Column } from "typeorm";
import { singletest } from "./singletest.entity";

@ChildEntity()
export class singletest2 extends singletest {
  @Column()
  size: string
}  