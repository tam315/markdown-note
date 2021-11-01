# Type challenges

[[toc]]

## 雑多メモ

- 左辺の`extends`は、受け取れる型の定義に使う
- 右辺の`extends`は、型の検査(===や!==に近いイメージ)に使う
  - ここでUnion型を使った場合は、総当りで処理されるイメージになる(詳細は`Exclude`を参照)
- オブジェクトのkey名部分では`[P in ***]`のような表記ができる。この`P`は右辺でそのまま使える。
- `SomeArr[number]`で配列型をUnion型に変換できる
  ```ts
  type List = (string | number | boolean)[]
  type Elem = List[number] // string | number | boolean になる
  ```

## --- Challenges - Easy ---

## Pick

```ts
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyPick<Todo, 'title' | 'completed'>

const todo: TodoPreview = {
    title: 'Clean room',
    completed: false,
}
```

```ts
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

## Readonly

```ts
interface Todo {
  title: string
  description: string
}

const todo: MyReadonly<Todo> = {
  title: "Hey",
  description: "foobar"
}
```

```ts
type MyReadonly<T> = {
  readonly [P in keyof T]: T[P]
}
```

## Tuple to object

```ts
const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const;

// expected { tesla: 'tesla', 'model 3': 'model 3', 'model X': 'model X', 'model Y': 'model Y'}
const result: TupleToObject<typeof tuple>;
```

```ts
type TupleToObject<T extends readonly string[]> = {
  [P in T[number]]: P;
};
```

## First of Array

```ts
type arr1 = ['a', 'b', 'c']
type arr2 = [3, 2, 1]

type head1 = First<arr1> // expected to be 'a'
type head2 = First<arr2> // expected to be 3
```

```ts
type First<T extends any[]> = T extends [] ? never : T[0];
```

## Length of Tuple

```ts
type tesla = ['tesla', 'model 3', 'model X', 'model Y']
type spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT']

type teslaLength = Length<tesla>  // expected 4
type spaceXLength = Length<spaceX> // expected 5
```

```ts
type Length<T extends any[]> = T['length']
```

## Exclude

```ts
// expected string | Function
type Sample = MyExclude<string | number | boolean | Function, number | boolean>;
```

```ts
type MyExclude<T, U> = T extends U ? never : T;
```

## Awaited

```ts
type MyPromise = Promise<number>
// expected number
type MyPromiseResult = Awaited<MyPromise>
```

```ts
type Awaited<T extends Promise<any>> = T extends Promise<infer A> ? A : never;
```

## If

```ts
type A = If<true, 'a', 'b'>; // expected to be 'a'
type B = If<false, 'a', 'b'>; // expected to be 'b'
```

```ts
type If<T, U, V> = T extends true ? U : V;
```

## Concat

```ts
type Result = Concat<[1], [2]>; // expected to be [1, 2]
```

```ts
type Concat<T extends any[], U extends any[]> = [...T, ...U];
```

## Includes

```ts
// expected to be `true`
type IsIncluded = Includes<['BMW', 'Mercedes', 'Audi'], 'BMW'>;
```

```ts
type Includes<T extends any[], U> = U extends T[number] ? true : false;
```

## Push

```ts
type Result = Push<[1, 2], 3> // [1, 2, 3]
```

```ts
type Push<T extends any[], U> = [...T, U]
```

## Unshift

```ts
type Result = Unshift<[1, 2], 0>; // [0, 1, 2]
```

```ts
type Unshift<T extends any[], U> = [U, ...T];
```

## Parameters

```ts
type MyFunction = (i: number, s:string) => void;
// expects [i: number, s: string]
type MyParameter = Parameter<MyFunction>
```

```ts
type Parameter<T> = T extends (...args: infer A) => any ? A : never;
```

## --- Challenges - Medium ---

## Get Return Type

```ts
const fn = (v: boolean) => {
  if (v) return 1;
  else return 2;
};

type a = MyReturnType<typeof fn>; // should be "1 | 2"
```

```ts
type MyReturnType<T> = T extends (...args) => infer R ? R : never;
```

## Omit

```ts
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyOmit<Todo, 'description' | 'title'>

const todo: TodoPreview = {
  completed: false,
}
```

```ts
type MyOmit<T, U> = {
  [P in Exclude<keyof T, U>]: T[P]
}
```

## Readonly 2

```ts
interface Todo {
  title: string
  description: string
  completed: boolean
}

const todo: MyReadonly2<Todo, 'title' | 'description'> = {
  title: "Hey",
  description: "foobar",
  completed: false,
}

todo.title = "Hello" // Error: cannot reassign a readonly property
todo.description = "barFoo" // Error: cannot reassign a readonly property
todo.completed = true // OK
```

```ts
type MyReadonly2<T, K extends keyof T> = T & {
  readonly [P in K]: T[P]
}
```
