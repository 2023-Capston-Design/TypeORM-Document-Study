import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator'

@Entity('users')
export class User implements UserInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column("varchar", {
    nullable: false,
    unique: true
  })
  username: string;

  @IsString()
  @Column("varchar", {
    nullable: false,
    unique: false
  })
  password!: string;

  @IsOptional()
  @IsDate()
  @Column("int", {
    nullable: true,
    unique: true
  })
  age!: number

  @IsOptional()
  @IsDate()
  @UpdateDateColumn()
  updatedAt!: Date

  @IsOptional()
  @IsDate()
  @DeleteDateColumn()
  deletedAt!: Date

  @CreateDateColumn()
  createdAt: Date

  constructor(data: UserInterface) {
    Object.assign(this, data)
  }
}