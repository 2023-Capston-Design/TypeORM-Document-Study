# Relation

Relation은 알다싶이 테이블간의 연관관계를 나타내는 성질이다. `1:1`(`@OneToOne`), `1:n` (`@OneToMany`), `n:1` (`@ManyToOne`),`m:n` (`@ManyToMany`)이 존재한다. 괄호 안에 작성되어있는 것은 각각의 연관관계를 표현할 때 사용하는 데코레이터들이다.

## Relation Options

Relation 관련 데코레이터를 사용할때는 연관관계 옵션을 줄 수 있다. 가능한 옵션들은 아래와 같다.

- eager (boolean) : true로 설정하면 이 엔티티에서 find* 메서드 또는 QueryBuilder를 사용할 때 항상 기본 엔티티와 관계가 로드된다.
- cascade (boolean or ("insert" | "update" | "remove" | "soft-remove" | "recover")[]) : true로 설정하면 관련 개체가 데이터베이스에 삽입되고 업데이트된다. 기본은 false이다.
- onDelete ("RESTRICT"|"CASCADE"|"SET NULL”) : 참조된 개체가 삭제될 때 외부 키가 작동하는 방식을 지정한다.
- onUpdate ("RESTRICT"|"CASCADE"|"SET NULL”) : 참조된 개체가 수정될 때 외부 키가 작동하는 방식을 지정한다.
- nullable (boolean) : 이 관계의 열이 null인지 여부를 나타낸다. 기본적으로 이 값은 true이다.

## Cascade Option

테이블간 관계를 나타내는 모든 데코레이터들의 옵션으로 cascade 옵션을 줄 수 있다. cascade 옵션은 boolean 혹은 배열 타입으로 줄 수 있다. 배열 타입으로 옵션을 주는 경우, 아래 옵션들 중 선택하여 배열로 넘겨주어야 한다

```tsx
("insert" | "update" | "remove" | "soft-remove" | "recover")[].
```

만약 boolean 타입으로 주게 된다고 할 때 `true` 인경우, 위의 모든 옵션이 활성화 되며, 기본값은 `false` 로 설정되어있다. 예시 코드는 아래와 같이 사용할 수 있다

```tsx
@ManyToMany((type) => PostDetails, (details) => details.posts, {
        cascade: ["insert"],
})

@ManyToMany((type) => Category, (category) => category.questions, {
        cascade: true,
})
```

## `@JoinColumn` Option

### 기본 사용법

`@JoinColumn` 은 외래 키를 사용하여 조인 열을 포함하는 관계가 어느 쪽인지 정의할 뿐만 아니라 join할 열 이름과 참조된 열 이름을 사용자 정의할 수 있다. `@JoinColumn` 을 설정하면 

```sql
propertyName + referencedColumnName
```

 형태의 이름의 열이 데이터베이스에 자동으로 생성된다. 아래 예시를 예를 들면

```tsx
@ManyToOne(type => Category)
@JoinColumn() 
category: Category; // Category의 id열을 참조하고 있다고 가정한다
```

위 예시는 `categroyId` 라는 이름의 열이 생성되게 된다. 주의해야할 점은 `@OneToMany` 혹은 `@ManyToOne` 을 사용할때는 필수가 아니지만 **`@OneToOne` 을 사용할때는 필수라는 점**이다.

< 중요 >

`**@JoinColumn` 의 경우, 외래키를 소유할 테이블 엔티티에 선언을 해주어야 한다.**

### 이름 지정

위에서 봤듯이 기본으로 생성되는 이름이 아닌 이름을 지정해 주고 싶은 경우에는 `name` 프로퍼티를 설정해주면 된다.

```tsx
@ManyToOne(type => Category)
@JoinColumn({ name: "cat_id" })
category: Category;
```

### 참조할 열 지정

`@JoinColumn` 은 기본적으로 `primary key` 열을 참조하게 된다. 하지만 다른 열과 연관관계를 맺고 싶은 경우에는 `referencedColumName` 프로퍼티를 설정해주면 된다.

```tsx
@ManyToOne(type => Category)
@JoinColumn({ referencedColumnName: "name" })
category: Category;
```

### 다중 연관관계 설정

테이블의 열간에 다중 연관관계를 설정해줄 수 있다. 하지만 주의할 점은, 하나의 연관관계를 설정할때는 `primary key` 열을 참조했지만, 다중 연관관계에서는 참조할 열(`referencedColumnName`)을 지정해 주어야 한다.

```tsx
@ManyToOne(type => Category)
@JoinColumn([
    { name: "category_id", referencedColumnName: "id" },
    { name: "locale_id", referencedColumnName: "locale_id" }
])
category: Category;
```

## `@JoinTable` Option

@JoinTable은 `M:N` 관계에 사용되며 연결 테이블의 조인 column을 설명한다.연결 테이블은 연관된 entity간 참조하는 열들이 존재하는 테이블로서, TypeORM에 의해 자동으로 생성되는 특수한 별도의 테이블이다. 일반적으로 M:N관계는 아래와 같은 형태를 갖춘다.

아래 사진과 같이 두 테이블간 연결테이블이 존재하는것을 볼 수 있다.

@JoinColumn:을(를) 사용하여 연결 테이블 및 참조된 열 내부의 열 이름을 변경할 수 있다 또한 생성된 연결 테이블의 이름을 변경할 수도 있다. 조금더 자세한 것은 `M:N` 을 보면서 확인한다

![Untitled](Relation%20b1d5b10555674b0ea4e946e20723602e/Untitled.png)

```tsx
@ManyToMany(type => Category)
@JoinTable({
    name: "question_categories", // table name for the junction table of this relation
    joinColumn: {
        name: "question",
        referencedColumnName: "id"
    },
    inverseJoinColumn: {
        name: "category",
        referencedColumnName: "id"
    }
})
categories: Category[];
```