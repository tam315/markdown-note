# プロを目指す人のための TypeScript 入門

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

- 使うな。代わりに Map を使え。
  - 「どんな名前のプロパティにもアクセスできる」という特性により型安全を破壊してしまうため

```ts
// ブラケットを使った定義
type PriceData = {
  [key: string]: number;
};

// Recordを使った定義
type PriceData = Record<string, number>;
```

#### 変数から型を作る

- `typeof`を使う
- 変数が持つ型を取得する
- 非常に強力な機能
- ただし乱用すべきでない
  - Source of truth をどこに置くか、で利用を判断する
    - 定数など、値が根源であるものには最適

### 部分型関係

#### 部分型とは

- B が A の部分型であるということは
  - **B は A としても使える**ということ
  - B が A の持っている全ての性質を持っているということ
  - B が A を「包含する」の方が直感的かも？
    - partial という言葉から受けるイメージとは逆なので注意
- 構造的部分型 structural subtyping
  - プロパティを実際に比較して動的に決める
  - TypeScript はコレ
- 名前的部分型 nominal subtyping
  - 明示的に宣言されたものだけが部分型とみなされる

### 型引数を持つ型

- ジェネリック型、型関数とも呼ばれる

```ts
type User<T> = {
  namr: string;
  child: T;
};
```

- 「型引数を持つ型（ジェネリック型）」は：
  - 型を作るためのもの
  - それ自体は型ではない
  - `<>`を用いて全ての型引数を指定することで、初めて型となる
  - 構造にのみ言及する
  - ある種の抽象化
- 型引数に制約をかけるには`extends`を使う

```ts
type User<T extend HasName> = {}
```

- オプショナルな型引数を設定するには`= 型`を使う

```ts
type User<T = SomeType> = {};
```

### 配列

- Iterable
  - 配列、Map、文字列などは Iterable である
  - `for-of`文などで扱える
- 配列のインデックスアクセスは避けろ
  - `for-of`文などを使え

### 分割代入

- デフォルト値の設定は undefined にのみ適用される点に注意

```ts
const a = { b: null };
const { b = 123 } = a; // bはnullのままになる
```

### その他の組み込みオブジェクト

#### Map

- ただのオブジェクトよりも連想配列として優れている
  - キーとしてオブジェクトを使える
- メソッド
  - `set`
  - `get`
  - `has`
  - `delete`
  - `clear`
  - `keys`
  - `values`
  - `entries`

#### Set

- キーだけで値のない Map
- メソッド
  - `add`
  - `delete`
  - `has`

#### WeakMap, WeakSet

- キーとして使えるのはオブジェクトのみ
- 列挙系のメソッド（`keys`, `values`, `entries`）がない
  - Gabage Collection を可能にするため
- Gabage Collection されるオブジェクトをキーにしたいときは使うと良い

#### プリミティブなのにプロパティがあるように見える件

- 実はプリミティブに対してプロパティーアクセスを行うたびに一時的にオブジェクトが作られている

```ts
const str = 'hello';
console.log(str.length); // 5
```

- 実は`{}`型は中身が本当にオブジェクトであるかを確認しない

```ts
type HasLength = { length: number };
const a: HasLength = 'asdf'; // ok
```

- 真にオブジェクトである値のみを扱いたいときは`object`型を使う

```ts
type HasLength = { length: number } & object;
const a: HasLength = 'asdf'; // error
```

### 雑学(プロパティアクセス可能かどうか)

- `value != null`で以下に絞り込める
  - `{[key: string]: unknown}` （同義 → `Record<string, unknown>`)
- どんなプロパティ名でアクセスしても unknown 型になるの意
- JS の仕様上、null と undefined 以外の値はプロパティアクセスが可能

## TypeScript の関数

### 関数の作り方

- 関数は、関数オブジェクトという**値**が変数に代入されたものである
  - このことはどの方法で関数を作ったとしても共通する
- 関数宣言で作る - function declaration

```ts
function myFunc(a: number): number {}

// 返り値がない関数
function myFunc(a: number): void {}
```

- 関数式で作る - function expression
  - hoisting は行われない
  - 使う機会はほぼない

```ts
const myFunc = function (a: number): number {};
```

- アロー関数式で作る - arrow function expression
  - hoisting は行われない

```ts
const myFunc = (a: number): number => {};
```

- メソッド記法で作る
  - 部分型の扱いで問題点があるため、原則使うな。通常の記法を使え。

```ts
const obj = {
  // メソッド記法
  myFunc(a: number): number {},

  // 通常の記法
  myFunc: (a: number): number => {},
};
```

#### 可変長引数とスプレッド構文

- この二つは組み合わせで使われることが多い

```ts
const sum = (...args) => {
  return otherFunc(...args);
};
```

#### 高階関数

- higher-order function
- コールバック関数を受け取る関数のこと
- `map`や`filter`などは全て高階関数

### 関数の型

- 関数型という
  - 引数部分はアロー関数と同じ記法が使える
  - 引数名の情報はエディタ支援を充実させるために書くもの

```ts
type MyFunc = (num: number) => string;
```

- 返り値の型は推論される。
- ただし、明示的に書くことで意図がコンパイラに正しく伝わるので、よりわかりやすいエラーメッセージを得られる。
- Source of truth をどこにおくかで判断するとよい

#### 引数の型注釈を省略する

- 逆方向の型推論(Contextual Typing)が働く場合
  - つまり、式の型が先にわかっている場合
  - コールバック関数などでよく見かける

#### コールシグネチャ

- ほぼ使われないので雑学程度に
- 「プロパティを持つ関数」を定義するために使う

```ts
type MyFunc = {
  isUsed: boolean;
  (arg: number): void;
};
```

### 関数型の部分型

- 関数の部分型が成立するための 3 条件
  - 返り値
    - 共変(covariant)の位置にあるので、
    - 順方向(自然な方向)の部分型が成立していること
  - 引数
    - 反変(contravariant)の位置にあるので、
    - 逆方向の部分型が成立していること
  - 引数の数
    - 引数の数が少ない関数型はより引数が多い関数型の部分型となる

### ジェネリクス

- 型引数を受け取る関数（ジェネリック関数）を作る機能
- どの書き方をした場合でも、型引数リストが実引数リストの直前に置かれる

```ts
// 関数宣言
function repeat<T>(element: T, length: number): T[] {}

// 関数式
const repeat = function <T>(element: T, length: number): T[] {};

// アロー関数式
const repeat = <T>(element: T, length: number): T[] => {};
```

- 下記の要件を満たすために使われることが多い
  - 入力の値はなんでもいい
  - 入力の型によって出力の方が決まる
- `extends`やオプショナル型引数も使える
- 使用時に型引数を省略した場合は、実引数の型から推論される
  - つまり「好きな値で呼び出せばいい感じに型を推論してくれる」

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

## TypeScript のモジュールシステム

一部のみ

- default エクスポートはエディタのサポートが十分に効かないことがあるため使わない、という流派もある
- CommonJS モジュールとは
  - ES Modules の前から存在するシステム
  - 必要となる場面
    - コンパイル後の JS に目を通したい場合、
    - ちょっとした設定ファイルを JS で書きたい場合、など
  - `requre`は`import`と異なり動的なモジュール読み込みである
    - 実行されて初めてそのモジュールの読み込みが行われる
    - このため特定の条件のときだけモジュールを読み込む、といったことが可能
    - ES modules でも似たことはできるが、ES の方は非同期的という点で依然異なる

## TypeScript のコンパイラオプション

### tsconfig.json

- `tsc --init`で`tsconfig.json`を自動生成できる
- `include`
  - コンパイルの起点となるファイル群
  - glob パターンが使える
- `exclude`
  - `include`で指定した起点から除くものを指定する
  - glob パターンが使える
  - あくまで「起点に含まない」という意味で、他の起点ファイル経由でインポートされていたらインポートされる
- `files`
  - 最近は使わない
  - glob パターンが使えない

### チェックの厳しさに関するオプション

- `strict`が最も重要
  - strict 系と呼ばれる設定群が有効になる
  - 新たに strict 系の設定が追加された場合は自動で有効になる
- おすすめ設定
  - `strict`
  - `noUncheckedIndexedAccess`
  - `exactOptionalPropertyTypes`
  - 以下はお好みで
    - `noImplicitReturns`
    - `noFallthroughCasesInSwitch`
    - `noImplicitOverride`
