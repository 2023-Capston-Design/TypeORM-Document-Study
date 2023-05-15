# Embedded Entites & Entity Inheritance

결론적으로 두가지 특성 모두 테이블에서 중복되는 필드에 대해 중복 코딩하는것을 방지해주는 feature들이다. 다만 두 방법간에 약간의 차이가 존재한다.

## Entity Inheritance

아래와 같이 세개의 테이블이 있다고 가정하자

```tsx
// photo.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('photo')
export class Photo {
  @PrimaryGeneratedColumn()
  id: number

  @Column("varchar")
  title: string

  @Column("text")
  description: string

  @Column("varchar")
  size: string
}

// question.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('question')
export class Question {
  @PrimaryGeneratedColumn()
  id: number

  @Column("varchar")
  title: string

  @Column("text")
  description: string

  @Column("int")
  answerCount: number
}

// post.entity.ts

import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('post')
export class Post {
  @PrimaryGeneratedColumn()
  id: number

  @Column("varchar")
  title: string

  @Column("text")
  description: string

  @Column("int")
  viewCount: number
}
```

위 세 테이블에는 공통적으로 `id`, `title`, `description` 필드가 중복으로 존재하는것을 볼 수 있다. 여기서 중복성을 줄이기 위해서는 테이블에 대해 추상활르 진행할 수 있다. 세 테이블을 묶은 `Content` 라는 테이블 엔티티를 생성해본다. 추상클래스 형태로 정의하며, 이 자체로는 엔티티로 사용하지 않을것이기에 `@Entity` 를 붙이지 않는다. 다만 각 프로퍼티는 Column, Primary Key로 사용될 것이므로 해당 사항에 대해서는 표시해준다.

```tsx
import { Column, PrimaryGeneratedColumn } from "typeorm";

export abstract class Content {
  @PrimaryGeneratedColumn()
  id: number

  @Column("varchar")
  title: string

  @Column("text")
  description: string
}
```

그리고 위에서 생성한 세개의 entity 클래스들이 `Content` 추상 클래스를 상속받게끔한다.

```tsx
// photo.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Content } from "./content.entity";

@Entity('photo')
export class Photo extends Content {
  @Column("varchar")
  size: string
}

// question.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Content } from "./content.entity";

@Entity('question')
export class Question extends Content {
  @Column("int")
  answerCount: number
}

// post.entity.ts

import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Content } from "./content.entity";

@Entity('post')
export class Post extends Content {
  @Column("int")
  viewCount: number
}
```

![Untitled](Embedded%20Entites%20&%20Entity%20Inheritance%20734b52e2cb8d456cb1e9c75c1e849770/Untitled.png)

위 사진에서 볼 수 있듯이, `post`, `photo` , `question` 테이블에는 상속받은 `content` 클래스의 프로퍼티들을 필드로 가지고 있는것을 볼 수 있다.

## Embedded Entity

위에서 보았던 Entity Inheritance같은 경우에는 클래스를 상속하는 방식으로 동작을 하였다. Embedded Entity는 이와 달리 특정 Column을 중복되는 Column들이 묶여있는 클래스 타입으로 지정함으로서 중복성을 줄이는 방식이다. 세가지의 Entity를 예시로 본다

```jsx
// student.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('student')
export class Student {
  @PrimaryGeneratedColumn()
  id: number

  @Column("varchar")
  firstname: string

  @Column("varchar")
  lastname: string

  @Column("varchar")
  faculty: string
}

// employee.entity.ts

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('employee')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number

  @Column("varchar")
  firstname: string

  @Column("varchar")
  lastname: string

  @Column("int")
  salary: number
}

// teacher.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('teacher')
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number

  @Column("varchar")
  firstname: string

  @Column("varchar")
  lastname: string

  @Column("int")
  class: number
}
```

잘 적용이 되고 테이블이 생성되는것을 알 수 있다.

![Untitled](Embedded%20Entites%20&%20Entity%20Inheritance%20734b52e2cb8d456cb1e9c75c1e849770/Untitled%201.png)

이제 확인을 하였으니 위 세 테이블을 삭제해준다.

```sql
drop table employee;

drop table student;

drop table teacher;
```

동일하게 `id`, `firstname` , `lastname` 이 세가지 컬럼이 중복되는것을 볼 수 있다. 여기서도 이 세가지 Entity를 추상화해볼 수 있다. `firstname` 과 `lastname` 이름을 가지고 있기때문에 `firstname`, `lastname` 세가지 Column을 가지고 있는 `Name` 클래스를 작성한다. 단 `Entity Inheritance` 와 동일하게 해당 클래스 자체를 Entity로 사용하지 않을것이므로, `@Entity` 는 선언해주지 않아야한다. 

아래 예시에서는 class로 선언했지만 `Entity Inheritance`와 동일하게 추상 클래스로 선언해도 무방하다. 하지만 추후에 데이터를 추가하는 경우에 인스턴스를 생성하여 넣는 방식으로 하는것이 좋기 때문에 class로 선언하는것이 권장된다.

```tsx
import { Column, PrimaryGeneratedColumn } from "typeorm";

export class Name {
  @Column("varchar")
  firstname: string

  @Column("varchar")
  lastname: string
}

```

이제 `Name` 클래스를 위 세 테이블에 적용해야한다. 적용을 하기위해서는 `@Column` 데코레이터에 타입을 지정하는 부분에 `Name` 클래스 타입을 반환하는 형식의 익명함수를 작성해주면 된다. `Entity` 를 할때 봤지만, `@Column` 데코레이터에 타입을 지정하는 방법은 문자열로 지정하는 방식 이외에도 여러개가 있다는 점을 상기시킨다.

```tsx
// employee.entity.ts

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Name } from "./name";

@Entity('employee')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number

  @Column(() => Name)
  name: Name

  @Column("int")
  salary: number
}

// student.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Name } from "./name";

@Entity('student')
export class Student {
  @PrimaryGeneratedColumn()
  id: number

  @Column(() => Name)
  name: Name

  @Column("varchar")
  faculty: string
}

// teacher.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Name } from "./name";

@Entity('teacher')
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number

  @Column(() => Name)
  name: Name

  @Column("int")
  class: number
}
```

![Untitled](Embedded%20Entites%20&%20Entity%20Inheritance%20734b52e2cb8d456cb1e9c75c1e849770/Untitled%202.png)

테이블이 생성된것을 볼 수 있다. 다만 `Entity Inheritance` 와 다른 점은 아래와 같은 형태로 column이 생성된다는 것이다

```sql
(Entity에서 지정한 Column의 이름)(Embed클래스에서 지정한 column 이름)

ex) nameFirstname
```

`Entity Inheritance` 같은 경우는 일반적으로 행(혹은 레코드) 일 추가할때와 동일하다. 하지만 `Embedded Entity` 같은 경우에는 Embed한 클래스의 인스턴스를 생성하여 추가하는 방식으로 행을 추가한다.

```tsx
const repository = connection.getRepository(Student);
const newStudent = new Student();
newStudent.faculty = "Software"

const studentname = new Name();
studentname.firstname = "firstname"
studentname.lastname = "lastname"

newStudent.name = studentname

await repository.save(newStudent)
```

![Untitled](Embedded%20Entites%20&%20Entity%20Inheritance%20734b52e2cb8d456cb1e9c75c1e849770/Untitled%203.png)