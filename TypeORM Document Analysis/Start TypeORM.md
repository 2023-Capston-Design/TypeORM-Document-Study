# Start TypeORM

데이터베이스와의 상호작용을 위해서는 `DataSource` 를 설정함으로서 가능하다. TypeORM의 `DataSource` 는 데이터베이스와의 연결정보를 가지고 있으며, 최초 데이터베이스와의 연결을 수행, connection, connection pool을 생성한다.

## connect / disconnect

연결을 위해서는 `DataSource` 인스턴스의 `initialize` 메소드를 실행해야한다. `initialize` 는 기본적으로 `Promise` 를 반환한다

반대로 연결을 끊기 위해서는 `DataSource` 인스턴스의 `destroy` 메소드를 실행한다.

**일반적으로 애플리케이션에서 데이터베이스와의 연결을 위해 `initialize` 를 수행한 후 프로그램 종료시 `destroy` 메소드를 사용하여 연결을 종료한다**

## DataSource 생성하기

`DataSource` 인스턴스를 생성해 본다. 그리고 `initialize` 메소드를 실행해본다.

```jsx
import { DataSource } from "typeorm";
import * as dotenv from 'dotenv';
import { } from 'class-validator';

dotenv.config()

console.log(process.env.DB_HOST)

const connection = new DataSource({
  type: 'mysql',
  entities: [`${__dirname}/**/*.entity{.ts.js}`],
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PW,
  database: 'assign',
  synchronize: false
})

connection.initialize()
  .then(() => {
    console.log("Database connection success!")
    connection.destroy()
  })
  .catch((err) => {
    console.error(err)
  })
```

`DataSource` 에는 다양한 옵션들을 넣어주어야 한다. 다만, 각각의 RDBMS, NoSQL 엔진에 따라 옵션이 다르기 때문에 자세한건 [Document](https://typeorm.io/data-source-options#mysql--mariadb-data-source-options)를 참고하자. 우선 위에서 사용한 옵션들을 간단히 정리한다

- type : 사용할 데이터 베이스의 종류이다.
- entities: TypeORM Entity 파일이 담긴 파일들을 찾는다 `**` 는 재귀적으로 디렉토리를 탐색하라는 의미이다.
- synchronize: 프로그램 재시작시 데이터베이스 스키마를 자동으로 만들어야 하는지의 여부이다. 이 옵션은 production 레벨에서는 사용하지 않는것이 좋다. 이 옵션은 디버깅 혹은 순수 개발중에만 유용하다.
- database : 기본으로 지정할 데이터베이스 이름