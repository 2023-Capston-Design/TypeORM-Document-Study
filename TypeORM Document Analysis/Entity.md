# Entity

Entity란 데이터베이스 테이블에 매핑되는 클래스이다. `@Entity` 데코레이터를 사용하여 엔티티 클래스임으로 지정한다.  `@Entity` 는 매개변수로 생성할 테이블 명을 받으며 만약 매개변수를 주지 않으면, `@Entity` 클래스의 클래스 이름을 테이블 이름으로 지정한다.

간단한 User Entity를 작성해본다. 여기서는 `class-validator` 과 함께 사용해본다

```tsx
// user.interface.ts
interface UserInterface {
  username: string
  password: string
  age?: number
}

// user.entity.ts

import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator'

@Entity('users')
export class User implements UserInterface {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @IsString()
  @Column({
    type: String,
    nullable: false,
    unique: true
  })
  username: string;

  @IsString()
  @Column({
    type: String,
    nullable: false,
    unique: false
  })
  password!: string;

  @IsOptional()
  @IsDate()
  @Column({
    type: Number,
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
```

## Entity Columns

데이터베이스 테이블은 기본적으로 `column` 들로 이루어지게 된다. `@Column` 데코레이터로 작성한 클래스 프로퍼티들은 모두 데이터베이스 Column으로 지정되게 된다.

```tsx
 @Column({
    type: Number,
    nullable: true,
    unique: true
  })
  age!: number
```

## Primary Columns

각각의 엔티티는 최소 하나의 `primary column` 을 가지고 있어야한다. `primary column` 을 만들기 위한 몇몇 타입이 존재한다

- `@PrimaryColumn` 은 어떤 타입이 되도 상관없도록 primary column을 지정한다. 대신, 해당 프로퍼티의 타입을 지정해주면, 해당 타입을 primary column의 타입으로 지정하게 된다. 아래 예시의 경우에는 primary column의 타입을 int로 지정하게 된다.
    
    ```tsx
    @Entity()
    export class User {
      @PrimaryColumn()
      id: number;
    
    ...
    ```
    
- `@PrimaryGeneratedColumn()` 은 `**auto-increment` 와 `auth-generated`가 적용된 primary column**이 생성되게된다. 기본적인 타입은 `int` 으로 지정되게 된다.
    
    값은 자동으로 생성되기 때문에 수동으로 primary column의 값을 지정할 필요가 없다. 
    
    ```tsx
    export class User {
      @PrimaryGeneratedColumn()
      id: number;
    ```
    
    ![Untitled](Entity%2098e2985714cb46cf985dbae9e486d44e/Untitled.png)
    
- `@PrimaryGeneratedColumn('uuid')` 는 위에서 봤던 `int` 형이 순차적으로 증가되는것이 아닌 랜덤 uuid가 id로 들어가는 형태를 의미한다.
    
    ![Untitled](Entity%2098e2985714cb46cf985dbae9e486d44e/Untitled%201.png)
    

TypeORM Document에 나와있듯이 아래 형식과 같이 여러개의 프로퍼티를 `PrimaryColumn()` 으로 지정함으로서 복합키를 만들 수 도 있다.

```tsx
import { Entity, PrimaryColumn } from "typeorm"

@Entity()
export class User {
    @PrimaryColumn()
    firstName: string

    @PrimaryColumn()
    lastName: string
}
```

테이블에 데이터를 저장하는 코드를 작성해본다.

```tsx
const main = async () => {
  const connection = new DataSource({
    type: 'mysql',
    entities: [`${__dirname}/entities/*.entity.{ts,js}`],
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PW,
    database: 'assign',
    synchronize: true
  })
  try {
    await connection.initialize()
    const newUser = new User({
      username: 'hoplin3',
      password: 'password'
    })
    await validateOrReject(newUser)
    const repository = connection.getRepository(User)
    await repository.save(newUser)
  } catch (err) {
    console.error(err)
  }
}
```

## 특수 Column

몇몇개의 특수한 column이 존재한다.

- `@CreateDateColumn` : 데이터가 생성된 시간을 저장한다. 자동으로 생성된다.
- `@UpdateDateColumn` : 데이터가 수정된 시간을 저장한다. 자동으로 생성된다
- `@DeleteDateColumn` : 데이터가 삭제된 시간을 저장한다. 단 여기서 삭제는 `soft-delete` 로 동작하게 되며, `@DeleteDateColumn` 이 설정되면, 기본적인 스코프는 `non-deleted` 로 설정된다.

# 아래 예시부터 새로 엔티티 생성 후 시작

```tsx
@Entity('example')
export class Example {
  @PrimaryGeneratedColumn()
  id: number
}
```

## Column 타입

TypeORM은 일반적으로 DB엔진에서 사용되는 대부분의 자료형을 지원한다. 각각의 RDBMS / NoSQL에 대해서 지원하는 자료형이 다르니 아래 [Document](https://typeorm.io/entities#column-types-for-mysql--mariadb)를 참고하자. 각각의 column의 자료형을 지정하기 위해서는 column을 지정하기 위해 사용했던 `@Column` 데코레이터의 인수를 전달하면 된다. 예를 들어 mysql의 `int` 타입을 지정하고 싶다면 아래와 같이 지정할 수 있다.

```tsx
@Column("int")
exmaple: number
```

Column 타입에는 문자열 형태의 타입 지정 이외에도 다양한 형태로 함수가 오버라이딩 되어있다.

[https://github.com/typeorm/typeorm/blob/master/src/decorator/columns/Column.ts](https://github.com/typeorm/typeorm/blob/master/src/decorator/columns/Column.ts)

## Column 타입 Options

`@Column` 에는 단순히 자료형 뿐만 아니라 추가적인 옵션을 작성해줄 수 있다. 예를 들어 문자열 타입의 경우 기본적으로 255 최대 length를 가진다. 하지만 만약 길이를 제한해 주고 싶다면 아래와 같이 option을 주어 제한할 수 있다. 아래 사진에서 좌측은 옵션을 주지 않은 경우 우측은 옵션을 준 경우에 해당한다.

```tsx
@Column("varchar", {
    length: 100,
    nullable: true
  })
  exmaple: string
```

![Untitled](Entity%2098e2985714cb46cf985dbae9e486d44e/Untitled%202.png)

![Untitled](Entity%2098e2985714cb46cf985dbae9e486d44e/Untitled%203.png)

자세한 옵션들은 아래 링크를 참고한다(Document)

[https://typeorm.io/entities#column-options](https://typeorm.io/entities#column-options)

## Column 타입 Enum

`enum` column은 `postgresql`, `mysql` 에 한해 지원된다. `enum` 타입을 명시하는 방법에는 두가지 대표적인 방법이 있다.

1. TypeScript Enum을 사용하는 방법

```tsx
export enum UserRole {
  ADMIN = "admin",
  EDITOR = "editor",
  GHOST = "ghost"
}

@Entity('example')
export class Example {
  @PrimaryGeneratedColumn()
  id: number

  @Column("enum", {
    enum: UserRole,
    default: UserRole.GHOST
  })
  role: UserRole
}
```

1. 일반적인 배열을 사용하는 방법.아래 예시에서는 배열의 요소들의 타입을 제한하기 위해 `UserRoleType` 이라는 타입을 정의해 주었다. 

```tsx
type UserRoleType = "admin" | "editor" | "ghost"

@Entity('example')
export class Example {
  @PrimaryGeneratedColumn()
  id: number

  @Column("enum", {
    enum: ["admin", "editor", "ghost"],
    default: "ghost"
  })
  role: UserRoleType
}
```

## Column 타입 simple-array 타입

`simple-array` 이라는 특별한 타입이 있다. 이는 배열을 문자열 배열 형식으로 저장하는 것이다. 모든 값은 comma로 구분이 되게 된다. 아래 예시코드를 참고한다. 

```tsx
type UserRoleType = "admin" | "editor" | "ghost"

@Entity('example')
export class Example {
  @PrimaryGeneratedColumn()
  id: number
  
  constructor(data: { names: string[] }) {
    Object.assign(this, data)
  }
}
```

```tsx
await connection.initialize()
const example = new Example({
  names: ["a", "b", "c", "d", "e"]
})
const repository = connection.getRepository(Example)
await repository.save(example)
```

![Untitled](Entity%2098e2985714cb46cf985dbae9e486d44e/Untitled%204.png)

위 사진을 보면 알 수 있듯이 `simple-array` 라는 타입이 존재하는것은 아니다. 다만  `text` 타입으로 배열의 요소들이 comma로 구분되어 하나의 텍스트로 들어가는것임을 알 수 있다.

## Column 타입 simple-json 타입

`simple-json` 이라는 특별한 타입이 있다. 이는 데이터베이스에 `JSON.stringfy` 를 통해 객체를 문자열로 변환한 값을 데이터 베이스에 넣는 방식으로 동작한다. 만약 데이터베이스에서 `json` 타입을 지원하지 않는 경우 유용하다.(MS-SQL이 대표적인 예시이다). 대부분의 RDBMS에서는 `json` 타입을 지원하기에, 지원하는 경우에는 네이티브 `json` 을 사용하자

```tsx
type exampleJSON = {
  name: string
  age: number
  description?: string
}

@Entity('example')
export class Example {
  @PrimaryGeneratedColumn()
  id: number

  @Column("simple-json")
  info: exampleJSON

  constructor(data: {
    info: exampleJSON
  }) {
    Object.assign(this, data)
  }
}
```

```tsx
await connection.initialize()
const example = new Example({
  info: {
    name: 'name',
    age: 10,
    description: 'description'
  }
})
const repository = connection.getRepository(Example)
await repository.save(example)
```

![Untitled](Entity%2098e2985714cb46cf985dbae9e486d44e/Untitled%205.png)

`simple-json` 또한 위 사진과 같이 내부적으로 `text` 타입으로 구현되어있는것을 볼 수 있다. 그렇게 안정적인 방법은 아닌것 같다. 여기서 사용하는 기준인 `MySQL / MariaDB` 에서는 `json` 타입이 지원되므로 네이티브 `json` 타입을 되도록이면 사용하자

```tsx
@Column("json")
info: exampleJSON
```

![Untitled](Entity%2098e2985714cb46cf985dbae9e486d44e/Untitled%206.png)