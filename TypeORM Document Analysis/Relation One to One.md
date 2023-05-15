# Relation : One to One

데이터베이스 Relation을 살펴본다. 먼저 `1 : 1` 관계에 대해 알아본다. 1:1 관계는 기본적으로 하나의 레코드가 다른 레코드 한개와 연결된 경우를 의미한다.

![Untitled](Relation%20One%20to%20One%20017e7830f4424828a2ae8435556aa22c/Untitled.png)

`Profile` 과 `Gamer` 두개의 Entity를 생성한다

```tsx
// profile.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

export enum Gender {
  MALE = "male",
  FEMALE = "FEMALE"
}

@Entity('profile')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number

  @Column("enum", {
    enum: Gender
  })
  gender: string

  @Column()
  photo: string
}

// gamer.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm"
import { Profile } from "./profile.entity"

@Entity('gamer')
export class Gamer {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @OneToOne(() => Profile, {
    cascade: true,
  })
  @JoinColumn({
    name: "gamer_profile"
  })
  profile: Profile
}
```

위 예시 코드를 보면 `@OneToOne` 데코레이터를 `Gamer` 의 `profile` 프로퍼티에 정의하였으며, 타겟 Entity는 `Profile` 로 설정한것을 볼 수 있다. 또한 `cascade` relation option을 true로 설정해 주었다.

그리고 `@JoinColumn` 은 앞에서 말했듯이 `@OneToOne` 은 필수로 사용해야한다고 하였다. 여기서는 `name` 을 지정했기 때문에 기본으로 생성되는 column 명인, `profileId` 대신 `gamer_profile` 이라는 이름의 열이 생성되게된다.   `**@JoinColumn` 은 연관관계간의 테이블 중 한쪽에만 설정되어야하며 foreign key가 지정될 테이블에만 설정되어야 한다**.

![Untitled](Relation%20One%20to%20One%20017e7830f4424828a2ae8435556aa22c/Untitled%201.png)

이제 위에서 정의한 1 : 1 관계에 대해 추가해보자.

```tsx
// Cascade가 설정되어있는경우

const gamerRepository = connection.getRepository(Gamer);

const newProfile = new Profile();
newProfile.gender = Gender.MALE;
newProfile.photo = "profile.jpg"

const newGamer = new Gamer();
newGamer.name = "gamer1"
newGamer.profile = newProfile

await gamerRepository.save(newGamer);
```

![Untitled](Relation%20One%20to%20One%20017e7830f4424828a2ae8435556aa22c/Untitled%202.png)

잘 추가가 된것을 볼 수 있다. 위 예시에서는 `@OneToOne` 에 cascade 옵션을 true로 설정하여 한번의 `save` 호출로 데이터가 저장된다. 하지만 만약 cascade 옵션이 false로 되어있다면 두번의 `save` 를 해주어야한다.

```tsx
// Cascade가 설정되어있지 않은 경우

const gamerRepository = connection.getRepository(Gamer);
const profileRepository = connection.getRepository(Profile);

const newProfile = new Profile();
newProfile.gender = Gender.MALE;
newProfile.photo = "profile.jpg"

await profileRepository.save(newProfile)

const newGamer = new Gamer();
newGamer.name = "gamer1"
newGamer.profile = newProfile

await gamerRepository.save(newGamer);
```

이번에는 조회를 해보자. 우선 `Gamer` 요소들을 조회해본다.

```tsx
const gamerRepository = connection.getRepository(Gamer);

const getGamers = await gamerRepository.find()
console.log(getGamers)
```

![Untitled](Relation%20One%20to%20One%20017e7830f4424828a2ae8435556aa22c/Untitled%203.png)

위 결과에서도 알 수 있듯이 `gamer` 테이블에 있는 정보들만 불러오는것을 볼 수 있다. 만약 연관관계에 있는 테이블의 정보까지 들고오고 싶은 경우에는 find 메소드(find, 혹은 find로 시작하는 모든 메소드 해당)의 `relations` 옵션을 설정하면 된다. relations 안에는 Entity에서 외래키로 참조하기 위해 설정했던 프로퍼티(`@OneToOne`)에 대해 true / false를 지정해주면 된다.

```tsx
const getGamers = await gamerRepository.find({
  relations: {
    profile: true
  }
})
console.log(getGamers)
```

![Untitled](Relation%20One%20to%20One%20017e7830f4424828a2ae8435556aa22c/Untitled%204.png)

관계는 단방향 및 양방향일 수 있다. 위의 예시가 대표적인 단방향 관계이다. 한쪽에만 데코레이터가 정의되어있다. 반대로 양방향으로 정의하기 위해서는 양쪽의 엔티티에 데코레이터를 정의해주어야한다. 

양방향 정의를 해주기 위해서 주의할점은, `@OneToOne` 두번째 매개변수에 관계를 맺은 상대 엔티티의 프로퍼티중 자신을 참조하고 있는 프로퍼티를 정의해주어야한다.

```tsx
// gamer.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm"
import { Profile } from "./profile.entity"

@Entity('gamer')
export class Gamer {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @OneToOne(() => Profile, (profile) => profile.gamer, {
    cascade: true,
  })
  @JoinColumn({
    name: "gamer_profile"
  })
  profile: Profile
}

// profile.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm"
import { Gamer } from "./gamer.entity"

export enum Gender {
  MALE = "male",
  FEMALE = "FEMALE"
}

@Entity('profile')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number

  @Column("enum", {
    enum: Gender
  })
  gender: string

  @Column()
  photo: string

  @OneToOne(() => Gamer, (gamer) => gamer.profile)
  gamer: Gamer
}
```

양방향 관계를 활용하여 양방향으로 조회를 진행해본다.

```tsx
const getGamer = await gamerRepository.find({
  relations: {
    profile: true
  }
})
console.log(getGamer)

const getProfile = await profileRepository.find({
  relations: {
    gamer: true
  }
})
console.log(getProfile)
```

![Untitled](Relation%20One%20to%20One%20017e7830f4424828a2ae8435556aa22c/Untitled%205.png)

양방향 참조가 잘 되는것을 볼 수 있다. 반대로 양방향 참조가 아닌 단방향 참조를 한 위에서는 `Profile` 을 통해서 `Gamer` 참조가 불가능하다.