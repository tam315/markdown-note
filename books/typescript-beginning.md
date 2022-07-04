# プロを目指す人のための TypeScript 入門

## メモ

- `value != null`で以下に絞り込める
  - `{[key: string]: unknown}` or
  - `Record<string, unknown>`
  - どんなプロパティ名でアクセスしても unknown 型になるの意
  - JS の仕様上、null と undefined 以外の値はプロパティアクセスが可能

## オブジェクトの基本とオブジェクトの型

一部のみ

### オブジェクトとは

- 近年はオブジェクトの書き換えは禁忌される傾向にある
  - `readonly`や`as const`の積極的な利用を検討
- スプレッド演算子
  - ネストしたオブジェクトの参照先は変わらない
  - ネストしたオブジェクトも含めて全部複製する標準的な方法は今のところない

### オブジェクトの型

- 近年は interface より type を優先して使う傾向あり

#### インデックスシグネチャ

- 基本使うな。代わりに Map を使え。
  - 「どんな名前のプロパティにもアクセスできる」という特性により型安全を破壊してしまうため

```ts
type PriceData = {
  [key: string]: number;
};
```

#### `typeof`

- 変数が持つ型を取得する
- 非常に強力な機能
- ただし乱用すべきでない
  - Source of truth をどこに置くか、で利用を判断する
    - 定数など、値が根源であるものには最適

### 部分型関係

#### 部分型とは

- B が A の部分型であるということは
  - B が A としても使えるということ
  - B が A の持っている全ての性質を持っているということ
  - B が A を「包含する」の方が直感的かも？
    - partial という言葉から受けるイメージとは逆なので注意
- 構造的部分型 structural subtyping
  - プロパティを実際に比較して動的に決める
  - TypeScript はコレ
- 名前的部分型 nominal subtyping
  - 明示的に宣言されたものだけが部分型とみなされる

## 高度な型

### ユニオン型とインターセクション型

#### ユニオン型

- `型Tまたは型U`
- 「型としてない」と「実際にない（値としてない）」は違うので注意
  - 例えば型としてはプロパティがなくても実際に値は存在することもある
- ユニオン型に共通するプロパティがある場合、そのプロパティの型は、ユニオン構成要素の各プロパティの型を合成したユニオン型になる。
  - 関数の場合も、だいたいそんな感じ

#### インターセクション型

- `型Tでありかつ型Uでもある値`
- 「オブジェクト型を拡張した新しい型を作る」という用途で使われることが多い

```ts
type Animal = {
  species: string;
  age: number;
};

// インターセクション型(Animal型を拡張している)
type Human = Animal & {
  name: string;
};
```

- `プリミティブ型 & プリミティブ型`のインターセクション型は never 型になる（あり得ないから）
  - ただし、`Animal & string`などは never 型にならない。説明略。型チェックは効くから気にするな。

#### オプショナルプロパティ

以下のような型があったとして

```ts
type Human = {
  // 1
  age?: number;

  // 2
  age: number | undefined;
};
```

- 許容されるパターン
  - 1 の場合
    - プロパティが存在しない
    - プロパティが number
    - プロパティが undefined
      - ただし exactOptionalPropertyTypes が有効ならこれはエラーになる
  - 2 の場合
    - プロパティが number or undefined (プロパティがないことは認められない)
- 使い分けは**省略を許すかどうか**で決めると良い

### リテラル型

#### ４種類のリテラル型

- リテラル型とは**プリミティブ型をさらに細分化した型**のこと
- 4 種類ある

```ts
// 文字列のリテラル型
type A = 'foo';

// 数値のリテラル型
type B = 123;

// 真偽値のリテラル型
type C = true;

// BigIntのリテラル型
type D = 3n;
```

#### テンプレートリテラル型

- 文字列型の一種
- リテラル型とはやや異なる性質

```ts
let myString: `Hello, ${string}`;

// ok
myString = 'Hello World';

// not ok
myString = 'Hello World again';
```

- contextual typing で使うのが自然

```ts
function getHelloStr(): `Hello ${string}` {
  // こうしておけば返り値が特定の文字列形式であることを強要できる
}
```

#### ユースケース

- 関数のオプション指定などで、ユニオン型+リテラル型、の組み合わせは頻出

```ts
function myFunc(plusOrMinus: 'plus' | 'minus') {}
```

- 予断だが、オプションによる処理分岐が適しているのは、関数の一部分の処理が違う場合だ。全く違ってくるなら関数を分けろ。

#### widening

- リテラル型が自動的に対応するプリミティブ型に置き換わること
- 以下の場合に発生する
  - `let`を使った場合
  - オブジェクトのプロパティの場合
- 防ぐには
  - 変数の場合、`const`を使うか明治的にリテラル型を指定しておく
  - オブジェクトプロパティの場合
    - プロパティに`readonly`をつける
    - オブジェクト全体に`as const`をつける

#### 型の絞り込み

- 等価演算子を使う

```ts
if (v === 'plus') {
}
```

- conditional value の存在を確認してから使う

```ts
type Animal {
  name?: string
}
if (animal?.name) {
}
```

- `typeof`を使う
  - 型としての`typeof`とは異なるので注意

```ts
if (typeof v === 'undefined') {
}
```

- `instanceof`を使う
  - クラスの場合
- `in`を使う
  - プロパティの有無により絞り込みを行う
- タグ付きユニオンを使う
  - a.k.a 代数的データ型、alberaic data types、ADT
  - 極めて基本的な設計パターンである
    - 複数種類のデータが混ぜて扱われる場合に、それぞれを別の型で現したうえで、**タグ**となるプロパティを型に埋め込んでおく
    - それらのユニオン型を作れば「扱われうる全てのデータ」を表す型ができる
    - データを使う側はタグを頼りに**型の絞り込み**を行う
  - ランタイムに型情報を取得できない問題を克服するための手法とも言える
- switch 文を使う
  - 特にタグ付きユニオンと相性が良い
- ユーザ定義の型ガード関数を使う
  - with a type predicate
    - 真偽値で結果を返したい場合
  - with an assertion signature
    - 失敗時にはエラーを投げたい場合

### keyof 型、lookup 型

#### lookup 型

- `T[K]`
- T はオブジェクト型、K は文字列リテラル、というパターンが多い
- 型情報を DRY にする意図
- 使いすぎは良くない
- 「T というオブジェクトの K プロパティからとった値を引数として渡してほしい」という意思表示をしたい場合に使うと良い

#### keyof 型

- オブジェクト型からそのオブジェクトのプロパティ名の型を得る
- 結果は**文字列のリテラル型**となる
- keyof は非常に奥が深い
  - 型から別の型を作れるため、「型レベル計算」の第一歩となるものだから

```ts
// 定数的なオブジェクトから型情報を生成することで、
// `値`をデータの源とすることができる
const conversionTable = {
  mm: 1,
  m: 1e3,
  km: 1e6,
};
type Unit = keyof typeof conversionTable; // 'mm' | 'm' | 'km'
```

#### keyof 型、lookup 型とジェネリクス

- ジェネリクス（型引数を持つ関数）において、型変数（中身がわからない型）と組み合わせて使える

```ts
function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const dummyObject = {
  name: 'hamada',
  age: 26,
};

// string型になる
const name = get(dummyObject, 'name');

// number型になる
const age = get(dummyObject, 'age');
```

- 上記のように型引数を省略すると、実引数の値から推論される
- 型引数の記述部分で、T に制約を加えている
  - この制約により keyof 型が正常に機能する

#### number 型もキーになれる？

- 型のうえでは、なれる
- ただし、ランタイムでは文字列に統一して扱われる（！）
- 実は T にどんな値がきても、`K extends keyof T`は`string | number | symbol`になる。
  - string 型に絞り込みたい場合などは以下のようにする。例えば string 型にしたい場合：

```ts
// `& string`をつける
function get<T, K extends keyof T & string>(obj: T, key: K): T[K] {
  // そしたらstring型に代入もできる
  const keyName: string = key;
  return obj[key];
}
```

- keyof を扱っているときに`number`と`symbol`がどうのこうの言ってきたら思い出すと良い。

#### as による型アサーション

- 基本的に使うな
- TypeScript の型推論がアホなときに、限定的に使うもの
- 「不正確な型を正しく直す」ために使う
- 使ったら理由をコメントに残しておこう
- ユーザー定義型ガードの方を好んで使え

#### as const

- 各種リテラルを「変更ができない」ものにする
- 危険ではない、素晴らしい機能
- 値から型を作る手段としてよく使われる
  - 値をデータの源としたい時

```ts
const names = ['john', 'lisa', 'zowie'] as const;
type Name = typeof names[number]; // 'john' | 'lisa' | 'zowie'
```

### その他の型

#### any 型

- 絶対使うな
- 型チェクを無効化する型
- 最終的に全てはランライムエラーという結果に帰する
- JS から TS への移行のためだけに存在する
- 代わりにユーザ定義型ガードなどを使え

#### unknown 型

- なんでも入れられる、ただしそのままでは何もできない
- 型の絞り込みしをしてから使う
- 何がくるか全くわからない場合には、積極的に使って OK

#### object 型

- `object`という型は、「プリミティブ以外の全て」を表す
  - `{}`（空のオブジェクト）型は null と undefined を含むが、`object`型は含まない
  - WeakMap のキーの型として使うなどのユースケースが主に想定される

#### never 型

- 「当てはまる値が存在しない」という型
- never 型の値が存在しているコードは、実際には実行されない
- never 型は全ての型の部分型である
  - なのでこの値はどんな型にも代入できる。逆説的だけど。
- never 型がユニオン型の中にあると消える

#### ユーザ定義型ガード（型述語）

- 型の絞り込みが機能しない場合に使うもの
- 危険な機能の一つ
- とはいえ any や as よりはマシなので本当に必要な時には細心の注意を払いながら使え
- 書いた人はその型判定処理について全責任を負え

`is`を使った記法

```ts
// 真偽値を返す関数を
function isString(value: unknown): boolean {
  return typeof value === 'string';
}

// このように書き換える
function isString(value: unknown): value is string {
  // 略
}
```

`asserts`を使った記法

- 関数が無事に終われば、その値がその型である、と見なされる
- 例外を用いるロジックと親和性がある

```ts
function assertString(value: any): asserts value is string {
  if (typeof value !== 'string') {
    throw 'ちゃうで';
  }
}
```

#### mapped types

- `{[P in K]: T}`
- P は mapped types でのみ使える新しい型変数
  - 必要があれば T の一部として使用することができる
- K はプロパティとして許容された型(string | number | symbol)である必要がある

```ts
type Fruit = 'apple' | 'orange' | 'strawberry';
type FruitNumbers = {
  [P in Fruit]: number;

  // Pは値の型の一部としても使える
  [P in Fruit]: P[];　// e.g. ['orange','orange','orange']
};
```

#### conditional types

- `X extends Y ? S : T`
- 型の条件分岐を行う
- X が Y の部分型なら S、そうでなければ T

#### 組み込みの型

- `Readonly<T>`
  - 全てのプロパティを読み取り専用に
- `Partial<T>`
  - 全てのプロパティをオプショナルに
- `Required<T>`
  - 全てのプロパティを必須に
- `Pick<T,K>`
  - K で指定したプロパティのみ残した T
  - K はユニオン型でも OK
- `Omit<T,K>`
  - Pick の逆
- `Extract<T,U>`
  - T(ユニオン型)のうち U の部分型であるもののみを抜き出した新しいユニオン型
- `Exclude<T,U>`
  - Extract の逆
- `NonNullable<T>`
  - T(ユニオン型)のうち null と undefined の可能性を除いた型