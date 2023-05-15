# TypeORM

- Example code with TypeScript
- Official Document : https://typeorm.io

# TypeORM : About

TypeORM is an [ORM](https://en.wikipedia.org/wiki/Object-relational_mapping) that can run in NodeJS, Browser, Cordova, PhoneGap, Ionic, React Native, NativeScript, Expo, and Electron platforms and can be used with TypeScript and JavaScript (ES5, ES6, ES7, ES8). Its goal is to always support the latest JavaScript features and provide additional features that help you to develop any kind of application that uses databases - from small applications with a few tables to large scale enterprise applications with multiple databases.

TypeORM supports both [Active Record](https://typeorm.io/active-record-data-mapper#what-is-the-active-record-pattern) and [Data Mapper](https://typeorm.io/active-record-data-mapper#what-is-the-data-mapper-pattern) patterns, unlike all other JavaScript ORMs currently in existence, which means you can write high quality, loosely coupled, scalable, maintainable applications the most productive way.

TypeORM is highly influenced by other ORMs, such as [Hibernate](http://hibernate.org/orm/), [Doctrine](http://www.doctrine-project.org/) and [Entity Framework](https://www.asp.net/entity-framework).

# Default Database : Docker setting

```jsx
docker run -d --name assigndb -e MYSQL_ROOT_PASSWORD=hoplin1234! -e MYSQL_DATABASE=assign -p 3306:3306 mysql
```

# TypeORM environment setting

```jsx
// Dev Dependencies
yarn add -D typescript @types/node tslint

// Dependencies
yarn add class-transformer class-validator typeorm mysql2

./node_modules/.bin/tsc init 
```

# TypeScript tsconfig.json setting

```jsx
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "es2017",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false
  }
}
```

# Pages

[Start TypeORM](./TypeORM%205a04a85edd384ef7b169b0e6caf5fd28/Start%20TypeORM.md)

[Entity](./TypeORM%20Document%20Analysis/Entity.md)

[Embedded Entites & Entity Inheritance](./TypeORM%20Document%20Analysis/Embedded%20Entites%20%26%20Entity%20Inheritance.md)

[Relation](./TypeORM%20Document%20Analysis/Relation.md)

[Relation : One to One](./TypeORM%20Document%20Analysis/Relation%20One%20to%20One.md)

[Relation : One to Many / Many to One](./TypeORM%20Document%20Analysis/Relation%20One%20to%20Many%20Many%20to%20One.md)

[Relation : Many To Many](./TypeORM%20Document%20Analysis/Relation%20Many%20To%20Many.md)