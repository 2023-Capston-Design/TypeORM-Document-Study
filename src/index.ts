import { DataSource } from "typeorm";
import * as dotenv from 'dotenv';
import { validate, validateOrReject } from 'class-validator';
import { User } from "./entities/user.entity";
import { Example } from "./entities/example.entity";
import { Student } from "./entities/embedded-entity/student.entity";
import { Name } from "./entities/embedded-entity/name";
import { Gamer } from "./entities/relations/one-to-one/gamer.entity";
import { Gender, Profile } from "./entities/relations/one-to-one/profile.entity";
import { CompanyMember } from "./entities/relations/one-to-many/companymember.entity";
import { Department } from "./entities/relations/one-to-many/department.entity";
import { ExampleTest } from "./entities/relations/one-to-many/example.entity";
import { WithoutMany2One } from "./entities/relations/one-to-many/withoutmany2one.entity";
import { Category } from "./entities/relations/many-to-many/category.entity";
import { Question2 } from "./entities/relations/many-to-many/question2.entity";

dotenv.config()

const main = async () => {
  const connection = new DataSource({
    type: 'mysql',
    entities: [`${__dirname}/**/*.entity.{ts,js}`],
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PW,
    database: 'assign',
    synchronize: true
  })
  try {
    await connection.initialize()
    const example = new Example({
      info: {
        name: 'name',
        age: 10,
        description: 'description'
      }
    })

    const categoryRepo = connection.getRepository(Category);
    const questionRepo = connection.getRepository(Question2);

    const category1 = new Category({
      name: 'memo'
    })
    const category2 = new Category({
      name: 'board'
    })

    const question1 = new Question2({
      title: "Question1",
      text: "abc",
      categories: [category1]
    })

    const question2 = new Question2({
      title: "Question2",
      text: "abcd",
      categories: [category1, category2]
    })

    await questionRepo.save([question1, question2])

    const categoryFind = await categoryRepo.findOne({
      where: {
        id: 1
      },
      relations: {
        questions: true
      }
    })

    console.log(categoryFind)

    const deleteIng = 2
    categoryFind.questions = categoryFind.questions.filter((category) => {
      return category.id !== deleteIng
    })
    console.log(categoryFind.questions)
    await categoryRepo.save(categoryFind)

  } catch (err) {
    console.error(err)
  }
}


main()


