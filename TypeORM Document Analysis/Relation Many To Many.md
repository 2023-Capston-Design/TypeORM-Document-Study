# Relation : Many To Many

Many To Many 연관관계는 테이블 연관관계에서 `M:N` 을 의미하는 연관관계로서, A와 B 테이블이 있다고 가정하면 A테이블이 B테이블의 여러 요소를 가지고 있으며 반대로 B테이블도 여러개의 A요소를 가지고 있는 형태이다.

Many To Many 예시로는 `Question` 과 `Category` 테이블을 활용해서 예시를 든다.

 

```tsx
// category.entity.ts
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "./question.entity";

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToMany(() => Question)
  questions: Question[]

  constructor(data: Omit<Category, 'id'>) {
    Object.assign(this, data)
  }
}

// question2.entity.ts
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./category.entity";

@Entity('question2')
export class Question2 {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  text: string

  @ManyToMany(() => Category, {
    cascade: true
  })
  @JoinTable()
  categories: Category[]

  constructor(data: Omit<Question2, 'id'>) {
    Object.assign(this, data)
  }
}
```

`@JoinTable` 은 `@ManyToMany` 를 사용하기 위해서 필수로 사용해야한다. `@ManyToMany` 를 사용하는 프로퍼티중 하나에 선언해 주어야 한다. 

여기서는 연결테이블을 통해서 값을 가져오기 때문에 두번째 매개변수를 통해 반대편 테이블에서 자신을 참조하고 있는 프로퍼티 키를 지정하지 않아도 된다(`@OneToMany`, `@OneToOne` 에서 했던것과 같이 말이다)

위 코드를 통해 3개의 테이블이 생성되게 된다.

아래 결과를 통해서 `@ManyToMany` 를 사용할때 `@JoinTable` 을 통해 연결테이블 명을 설정해 주지 않으면

> (테이블)_(테이블)_category
> 

형식으로 연결테이블 이름을 짓는것을 볼 수 있다.

```tsx
mysql> desc category;
+-------+--------------+------+-----+---------+----------------+
| Field | Type         | Null | Key | Default | Extra          |
+-------+--------------+------+-----+---------+----------------+
| id    | int          | NO   | PRI | NULL    | auto_increment |
| name  | varchar(255) | NO   |     | NULL    |                |
+-------+--------------+------+-----+---------+----------------+
2 rows in set (0.01 sec)

mysql> desc question2;
+-------+--------------+------+-----+---------+----------------+
| Field | Type         | Null | Key | Default | Extra          |
+-------+--------------+------+-----+---------+----------------+
| id    | int          | NO   | PRI | NULL    | auto_increment |
| title | varchar(255) | NO   |     | NULL    |                |
| text  | varchar(255) | NO   |     | NULL    |                |
+-------+--------------+------+-----+---------+----------------+
3 rows in set (0.01 sec)

mysql> desc question2_categories_category;
+-------------+------+------+-----+---------+-------+
| Field       | Type | Null | Key | Default | Extra |
+-------------+------+------+-----+---------+-------+
| question2Id | int  | NO   | PRI | NULL    |       |
| categoryId  | int  | NO   | PRI | NULL    |       |
+-------------+------+------+-----+---------+-------+
2 rows in set (0.00 sec)
```

## Many To Many 저장하기

앞에서 보았던것과 다를께 없다. 동일하게 엔티티에 `Cascade` 설정이 되어있다면 한번의 save 메소드로 모든 사항을 저장할 수 있다. 아래 코드 또한 엔티티에 cascade가 적용되었다(엔티티는 위를 참고)

```tsx
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
```

## Many To Many 삭제하기

```tsx
const questionRepo = connection.getRepository(Question2);

const question2 = await questionRepo.findOne({
  where: {
    id: 2
  },
  relations: {
    categories: true
  }
})

const categoryIdToRemove = 1

question2.categories = question2.categories.filter(({ id }) => {
  return id !== categoryIdToRemove
})

await questionRepo.save(question2)

// 혹은

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
```

앞에서 보았던 내용들과 동일하다. 그렇기에 자세한 설명은 생략하도록 한다. filtering 후 다시 save. cascade가 정의되어있으면 연관 데이터의 저장이 가능하다. 

만약 cascade가 적용되어있다면 관련 변경사항을 한번의 save로 모두 저장이 가능하다.

## 양방향 관계

엔티티간 양방향 관계를 표현하고 싶은 경우에는 `@ManyToMany()` 의 두번째 매개변수로 상대 엔티티에서 자신을 참고하고 있는 프로퍼티를 지정하면 된다(앞에서 보았던것과 동일한 방식) 물론 양방향 관계라고 해서 `@JoinTable` 을 두 엔티티 모두에 정의해주어서는 안된다. `@JoinTable` 은 항상 한쪽에만 선언되어 있어야 한다.

```tsx
@ManyToMany(() => Question2, (question) => question.categories)
```