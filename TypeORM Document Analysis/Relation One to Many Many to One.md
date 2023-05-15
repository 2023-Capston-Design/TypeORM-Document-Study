# Relation : One to Many / Many to One

One to Many, 그리고 Many to One은 흔히 테이블 관계에서 `1:N` 혹은 `N:1` 관계를 의미한다. 우선 두개의 테이블 엔티티를 작성한다. 하나는 `CompanyMember` 다른 하나는 `Department` 로 선언한다

```tsx
// CompanyMember

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

// Department

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
```

![Untitled](Relation%20One%20to%20Many%20Many%20to%20One%207b515ffcfa5649e382d9b736421c0ef9/Untitled.png)

위 두 엔티티간의 관계는 위에 있는 ERD를 참고하자.

위 코드에서 `Department` 엔티티의  `member` 프로퍼티에 `@OneToMany` 를 추가해준것을 볼 수 있다. 그리고 타겟 relation을 `CompanyMember` 로 지정한다.  반대로 `CompanyMember` 엔티티의 `department` 프로퍼티에 `@ManyToOne` 을 추가해준것을 볼 수 있다. 

각각의 데코레이터에 **첫번째 매개변수로는 타겟 엔티티를, 두번째 매개변수는 타겟 엔티티중 자신을 참고하고 있는 프로퍼티를 지정**한다. 세번째 매개변수에서 option인 `cascade` 옵션은 `Member` 에 설정을 해준다.

앞에서도 봤듯이 `**@JoinColumn` 을 선언하려면, 외래키를 소유할 테이블 엔티티에 선언을 해주어야 한다. 여기서는 `CompanyMember` 테이블이 외래키를 가지고 있기때문에 `CompanyMember`에 정의를 하였으며, 외래키 저장 칼럼을 ‘department_id’ 로 지정하였다.**

> `@OneToMany` / `@ManyToOne` 관계에서는 `@JoinColumn` 데코레이터 설정이 필수가 아니다.
> 

## `@OneToMany` 와 `@ManyToOne` 의 성질

`@OneToMany` 는 `@ManyToOne` 데코레이터 없이는 존재할 수 없다. `**@OneToMany` 를 사용하기 위해서는 `@ManyToOne` 을 필수적으로 사용해야한다.** 

```tsx
// Entity : ExampleTest
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { WithoutMany2One } from "./withoutmany2one.entity";

@Entity('exampledb')
export class ExampleTest {
  @PrimaryGeneratedColumn()
  id: number

  @Column("varchar")
  field: string

  @OneToMany(() => WithoutMany2One, (obj) => obj.id)
  members: WithoutMany2One[] | WithoutMany2One

  constructor(data: Omit<ExampleTest, 'id'>) {
    Object.assign(this, data)
  }
}

// Entity : WithoutMany2One

import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('without')
export class WithoutMany2One {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar')
  example: string

  constructor(data: Omit<WithoutMany2One, 'id'>) {
    Object.assign(this, data)
  }
}

// 저장

const exRepo = connection.getRepository(ExampleTest)
const newRepo = connection.getRepository(WithoutMany2One)

const newWithoutMany2One = new WithoutMany2One({
  example: 'test'
})
const newEx = new ExampleTest({
  field: 'test',
  members: newWithoutMany2One
})

await newRepo.save(newWithoutMany2One)
await exRepo.save(newEx)

// 에러메세지

TypeError: relatedEntities.forEach is not a function
at OneToManySubjectBuilder.buildForSubjectRelation (/Users/hoplin/studies/typeorm/node_modules/typeorm/persistence/subject-builder/OneToManySubjectBuilder.js:79:25)
at /Users/hoplin/studies/typeorm/node_modules/typeorm/persistence/subject-builder/OneToManySubjectBuilder.js:37:22
at Array.forEach (<anonymous>)
at /Users/hoplin/studies/typeorm/node_modules/typeorm/persistence/subject-builder/OneToManySubjectBuilder.js:33:49

// MySQL 콘솔

mysql> select * from information_schema.table_constraints where table_name = 'exampledb';
+--------------------+-------------------+-----------------+--------------+------------+-----------------+----------+
| CONSTRAINT_CATALOG | CONSTRAINT_SCHEMA | CONSTRAINT_NAME | TABLE_SCHEMA | TABLE_NAME | CONSTRAINT_TYPE | ENFORCED |
+--------------------+-------------------+-----------------+--------------+------------+-----------------+----------+
| def                | assign            | PRIMARY         | assign       | exampledb  | PRIMARY KEY     | YES      |
+--------------------+-------------------+-----------------+--------------+------------+-----------------+----------+

mysql> select * from information_schema.table_constraints where table_name = 'without';
+--------------------+-------------------+-----------------+--------------+------------+-----------------+----------+
| CONSTRAINT_CATALOG | CONSTRAINT_SCHEMA | CONSTRAINT_NAME | TABLE_SCHEMA | TABLE_NAME | CONSTRAINT_TYPE | ENFORCED |
+--------------------+-------------------+-----------------+--------------+------------+-----------------+----------+
| def                | assign            | PRIMARY         | assign       | without    | PRIMARY KEY     | YES      |
+--------------------+-------------------+-----------------+--------------+------------+-----------------+----------+
```

**반대로 `@ManyToOne` 을 사용할때는 `@OneToMany` 를 꼭 사용할 필요는 없다.**  

```tsx
// Entity : ExampleTest

import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { WithoutMany2One } from "./withoutmany2one.entity";

@Entity('exampledb')
export class ExampleTest {
  @PrimaryGeneratedColumn()
  id: number

  @Column("varchar")
  field: string

  @ManyToOne(() => WithoutMany2One, (obj) => obj.id)
  members: WithoutMany2One[] | WithoutMany2One

  constructor(data: Omit<ExampleTest, 'id'>) {
    Object.assign(this, data)
  }
}

// Entity : WithoutMany2One
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('without')
export class WithoutMany2One {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar')
  example: string

  constructor(data: Omit<WithoutMany2One, 'id'>) {
    Object.assign(this, data)
  }
}

// 저장

const exRepo = connection.getRepository(ExampleTest)
const newRepo = connection.getRepository(WithoutMany2One)

const newWithoutMany2One = new WithoutMany2One({
  example: 'test'
})
const newEx = new ExampleTest({
  field: 'test',
  members: newWithoutMany2One
})

await newRepo.save(newWithoutMany2One)
await exRepo.save(newEx)

// MySQL 콘솔
mysql> select * from information_schema.table_constraints where table_name = 'exampledb';
+--------------------+-------------------+--------------------------------+--------------+------------+-----------------+----------+
| CONSTRAINT_CATALOG | CONSTRAINT_SCHEMA | CONSTRAINT_NAME                | TABLE_SCHEMA | TABLE_NAME | CONSTRAINT_TYPE | ENFORCED |
+--------------------+-------------------+--------------------------------+--------------+------------+-----------------+----------+
| def                | assign            | PRIMARY                        | assign       | exampledb  | PRIMARY KEY     | YES      |
| def                | assign            | FK_30e2dff770e3f17796d82c4f54e | assign       | exampledb  | FOREIGN KEY     | YES      |
+--------------------+-------------------+--------------------------------+--------------+------------+-----------------+----------+
2 rows in set (0.00 sec)

mysql> select * from information_schema.table_constraints where table_name = 'without';
+--------------------+-------------------+-----------------+--------------+------------+-----------------+----------+
| CONSTRAINT_CATALOG | CONSTRAINT_SCHEMA | CONSTRAINT_NAME | TABLE_SCHEMA | TABLE_NAME | CONSTRAINT_TYPE | ENFORCED |
+--------------------+-------------------+-----------------+--------------+------------+-----------------+----------+
| def                | assign            | PRIMARY         | assign       | without    | PRIMARY KEY     | YES      |
+--------------------+-------------------+-----------------+--------------+------------+-----------------+----------+
1 row in set (0.01 sec)

mysql> select * from without;
+----+---------+
| id | example |
+----+---------+
|  1 | test    |
+----+---------+
1 row in set (0.00 sec)

mysql> select * from exampledb;
+----+-------+-----------+
| id | field | membersId |
+----+-------+-----------+
|  1 | test  |         1 |
+----+-------+-----------+
1 row in set (0.00 sec)
```

위 이유에 대해 **Document에 자세히 나와있지 않지만 대략 추측하자면, ManyToOne의 경우에는 여러개가 unique한 성질의 값 하나를 선택하기에 문제가없지만, OneToMany의 경우에는 하나가 unique하지 않은 여러개의 열을 지정해야되기 때문에 차이가 있는것으로 추측한다**

이러한 특성이 있지만, 되도록 사용하지 않는것이 좋을것같다. 명시적으로 `@OneToMany` , `@ManyToOne` 이 두개를 써서 관계를 명확하게 정의하자.

## 1:N 관계 값 저장하기

다시 돌아와 값을 저장할때 앞에서 보았던것과 동일하게 `EntityManager` 혹은 `Repository` 를 사용해서 저장할 수 있다. 아래 예시에서는 `@OneToOne` 의 경우와 동일하게 cascade설정이 되었기에 save를 한번만 호출하여 연관관계에 있는 값들을 한번에 저장한다. 만약 cascade가 설정되어있지 않다면 각각의 엔티티를 일일히 저장해주어야한다.

```tsx
const cmRepo = connection.getRepository(CompanyMember)

const newDP = new Department({
  name: 'DSC',
})
const newDP2 = new Department({
  name: 'GameSW',
})

const newCm = new CompanyMember({
  name: 'hoplin',
  age: 24,
  department: newDP
})
const newCm2 = new CompanyMember({
  name: 'hoplin2',
  age: 25,
  department: newDP2
})

const newCm3 = new CompanyMember({
  name: 'hoplin3',
  age: 26,
  department: newDP
})
const newCm4 = new CompanyMember({
  name: 'hoplin4',
  age: 27,
  department: newDP
})

await cmRepo.save([newCm, newCm2, newCm3, newCm4])
```

## 1:N관계 불러오기

연관관계에 있는 테이블의 정보까지 들고오고 싶은 경우에는 find 메소드(find, 혹은 find로 시작하는 모든 메소드 해당)의 `relations` 옵션을 설정하면 된다. relations 안에는 Entity에서 외래키로 참조하기 위해 설정했던 프로퍼티(`@OneToMany` 혹은 `@ManyToOne`)에 대해 true / false를 지정해주면 된다.

```tsx
const memberRepository = connection.getRepository(CompanyMember);
const departmentRepository = connection.getRepository(Department)

const getMember = await memberRepository.findOne({
  where: {
    id: 1
  },
  relations: {
    department: true
  }
})
console.log(getMember)

const getDepartment = await departmentRepository.findOne({
  where: {
    id: 1
  },
  relations: {
    member: true
  }
})

console.log(getDepartment)

/*
CompanyMember {
  id: 1,
  name: 'hoplin',
  age: 24,
  description: null,
  department: Department { id: 1, name: 'DSC' }
}
Department {
  id: 1,
  name: 'DSC',
  member: [
    CompanyMember { id: 1, name: 'hoplin', age: 24, description: null },
    CompanyMember {
      id: 3,
      name: 'hoplin3',
      age: 26,
      description: null
    },
    CompanyMember {
      id: 4,
      name: 'hoplin4',
      age: 27,
      description: null
    }
  ]
}
*/-

```