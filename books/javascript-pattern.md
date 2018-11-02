# JavaScript パターン

[[toc]]

## はじめに

### JavaScript はオブジェクト指向

オブジェクト＝ key-value ペアのリスト

オブジェクトの種類

- ネイティブオブジェクト
  - 組み込みオブジェクト（Array,Date など）
  - ユーザ定義オブジェクト（const a = {};）
- ホストオブジェクト（window など）

## リテラルとコンストラクタ

### オブジェクトリテラル記法

```js
a = {};
```

ちなみに、いわゆる「空のオブジェクト」とは、Object.prototype から継承したプロパティ・メソッドのみを持つオブジェクトのこと

### 組み込みコンストラクタ関数

使うな。リテラル記法を使え。

```js
const obj = new Object();
```

### カスタムコンストラクタ関数

`new`を使うと実際には下記のような処理が行われる

```js
const Person = function(name) {
  // 暗黙的にオブジェクトを作成
  // const this = Object.create(Person.prototype);
  this.name = name;

  // 暗黙的にオブジェクトを返す
  // return this;
};

Person.prototype.say = function() {
  return 'I am ' + this.name;
};
```

コンストラクタ内で明示的にオブジェクトを`return`する事もできる。
この場合、プロトタイプの継承は手動で行う必要がある。
また、暗黙的に作成されたオブジェクトは破棄される。

```js
const Person = function(name) {
  return { name: 'john' }; // Person.prototypeは継承されない
};
```

### new を忘れたときのための保険

```js
const Person = function() {
  if (!(this instanceof Person)) {
    return new Person();
  }
  // ...something...
};
```

### 配列リテラル

配列リテラルを使え。配列コンストラクタは使うな。

### 正規表現リテラル

正規表現リテラルを使え。正規表現コンストラクタは使うな。

### プリミティブのラッパー

string, number, boolean にはラッパが存在する。プリミティブは、即時にオブジェクトととして振る舞えるので、明示的にラッパを使う機会は、ほぼない。

```js
'abc'.toUpperCase();
(22 / 7).toPrecision(3);
```

使う必要があるのは、引数をプリミティブに変換したいときだけ。

```js
const num = Number('3');
const str = String(3);
```

### エラーオブジェクト

- `Error()`, `SyntaxError()`, `TypeError()`など、組み込みのエラーコンストラクタが存在する。
- これらは、`throw`とともに使用される。
- 作成されるオブジェクトは必ず`name`と`message`のプロパティを持っている。それ以外のプロパティはブラウザ拡張のため、存在は信頼できない。
- `throw`には独自のオブジェクトとを指定することもできる。

```js
throw new Error('some message'); // newはなくても動作は同じ
throw {
  name: 'MyError',
  message: 'something bad happend',
};
```

## 関数

- 関数とは、実行可能なオブジェクトのことである。
- 関数はローカルスコープを提供する

### Expression と Statement

関数の作成には 3 種類の方法がある。

```js
// named function expression(名前付き関数式)
const add = function add() {};

// anonymous function expression(無名関数式)
const add = function() {};

// function statement(関数宣言)
function add() {}
```

#### 使い分け

- Expression
  - 変数やプロパティに代入したいとき
  - 引数として渡したいとき
- Statement
  - その他の場合
  - Statement は必ずプログラムコード（関数本体の中もしくはグローバル空間）にのみ存在する

#### Named Function Expression と Function Statement の違い

- Expression は変数の宣言のみ巻き上げられる(undefined)
- Statement はファンクションの定義も巻き上げられる

```js
a(); // => ok
b(); // => errorになる。b===undefined だから。

function a() {}
const b = function() {};
```

### name プロパティ

```js
function foo(); // foo.name === 'foo'
const baz = function baz2(){}; // baz.name === 'baz2'
const bar = function(){}; // bar.name === 'bar'
```

named function にしておくと、デバッグ時にファンクション名が表示されるので便利。

### コールバックパターン

下記の目的で使う

- **関数の汎用性を高めるため**\
  → 　処理方法を外からインジェクトできるようにすることで、コールバックを差し替えればどんな処理でもできるようにしておく
- **非同期イベントを扱うため**\
  → 　イベント発生時に行いたい処理をコールバックとしてリスナに渡しておく

### 自己定義関数

1 回きりの準備作業を行う時に使う。自身を書き換える。あまり使うことがないかも。

```js
let scareMe = () => {
  console.log('Boo!');
  scareMe = () => {
    console.log('Double Boo!');
  };
};

scareMe(); // => Boo
scareMe(); // => Double Boo
```

### 即時関数（IIFE）

グローバル環境を汚さずに初期セットアップをする際によく使われる。

```js
(function(global) {
  const a = 1; // ローカル変数

  // ここでglobalを操作
})(this);
```

IIFE は値を返すので、クロージャを作る時に便利

```js
const a = (function() {
  return 1;
})();
```

### 即時オブジェクト初期化

immediate object initialization という。
IIFE と同じく、グローバルを汚さずに初期設定を行うために使う。

```js
({
  a: 1,
  b: 2,
  init: () => {
    /* 何らかの初期化作業 */
  },
}.init());
```

### 関数プロパティによるメモ化パータン

ファンクションの実行結果を、ファンクションのプロパティ(例えば`cache`など)に保持しておくパターン。
重たい処理を無駄に行わないために使う。

```js
const myFunc = param => {
  // キャッシュがあればそれを返す
  if (myFunc.cache[param]) return myFunc.cache[param];

  /* 重たい処理など */
  const result = 'some result';

  myFunc.cache[param] = result;
  return result;
};

// キャッシュの初期化
myFunc.cache = {};
```

### 設定オブジェクト

関数の引数をオブジェクトで渡す方法。

- メリット
  - 順序を気にしなくていい
  - オプションのパラメータを安全に省略できる
  - 読みやすく保守が楽
  - パラメータの追加・削除が容易
- デメリット
  - パラメータの名前を覚える必要がある
  - プロパティ名がミニファイされない

### カリー化

#### 関数の適用

- 関数プログラミングにおいて、関数は呼び出し（Invoke）されるものではなく、適用（Apply）されるものである。
- 関数の適用には`Function.prototype.apply()`を使う。
  - 第一引数には、`this`にしたいオブジェクトを指定する
  - 第二引数には、渡したい引数を Array で指定する

```js
const alien = {
  name: 'UFO',
  sayHi: function(message) {
    console.log(this.name, message);
  },
};

alien.sayHi.apply(null, ['hello']); // undefined hello
alien.sayHi.apply(alien, ['hello']); // UFO hello

alien.sayHi('hello'); // UFO hello <= これは、前行のシンタックスシュガーと言える
```

- 上記の例から、「関数の呼び出し」は、「関数の適用」のシンタックスシュガーに過ぎないと言える。
- `call()`も、`apply()`のシンタックスシュガーである。

#### 部分適用とカリー化

TODO：よくわからない、ざっくり下記の感じ？

```txt
カリー化 : f(a, b, c) → g(a)(b)(c)
部分適用 : f(値 1, 値 2, c) → g(c)
```

### （番外編）this の不思議な動作

あるオブジェクト(`otherObj`)のメソッドではない関数(`obj.sayName`)を呼ぶと、その関数内の `this` は、`obj`でも`otherObj`でもなく、グローバルオブジェクトを指す。

```js
obj = {
  name: 'John',
  sayName: function() {
    console.log(this.name);
  },
};

otherObj = {
  sayName: obj.sayName,
};

otherObj.sayName(); // undefined
```

## オブジェクト作成のパターン

### 名前空間パターン

好きな名前をつけたグローバルオブジェクトを一つだけ用意し、変数や関数を、そのオブジェクトに付与していくパターン

### 依存関係の宣言

依存するモジュールを、関数やモジュールの冒頭で宣言しておくと良い。取り込む必要のあるモジュールがひと目で分かるから。

この際、ローカル変数を作成してモジュールを指しておくことで、読み込みが高速になり、またミニファイしやすくなる。

```js
const myFunc = () => {
  const event = Yahoo.util.Event;
};
```

### プロパティやメソッドをプライベートにするには

原則として、オブジェクトのメンバは全てパブリックである。

#### プライベートメンバ

プライベートメンバを作成したいときは、コンストラクタでクロージャを使う。

```js
function Car() {
  // private
  const name = 'bmw';

  // public
  this.getName = function() {
    console.log(name);
  };
}
```

クラスだとこんなかんじ

```js
class Car {
  constructor() {
    // private
    const name = 'bmw';

    // public
    this.getName = function() {
      console.log(name);
    };
  }
}
```
