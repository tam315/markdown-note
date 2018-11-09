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

#### その 1

あるオブジェクト(`obj`)において、他のオブジェクトのメソッド(`otherObj.sayName`)を呼ぶと、その関数内の `this` は、`obj`でも`otherObj`でもなく、グローバルオブジェクトを指す。

```js
const otherObj = {
  name: 'John',
  sayName: function() {
    console.log(this.name);
  },
};

const obj = {
  sayName: otherObj.sayName,
};

obj.sayName(); // undefined
```

#### その 2

あるオブジェクト(`otherObj`)のメソッドをグローバル変数に代入すると、`this` はグローバルオブジェクトを指す。

```js
const obj = {
  name: 'John',
  sayName: function() {
    console.log(this.name);
  },
};
const someGlobal = obj.sayName;

someGlobal(); // undefined
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

### プライベートメンバ

原則として、Javascript オブジェクトのメンバは全てパブリックである。
以下では、プロパティやメソッドを擬似的にプライベートにする方法を説明する。

#### コンストラクタでプライベートメンバを作る

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

- ここでの`getName()`のように、プライベートな変数へのアクセス権を持つメソッドを、**特権メソッド**と呼ぶことがある。
- オブジェクトや配列を Return してしまうと参照を返すので、プライベート変数を変更することが可能になってしまう。これを回避するには、オブジェクトをクローンして返すか、必要最低限のプリミティブのみを返すようにすること。（POLA の法則：Principle Of Leart Authority - 最小権限の法則）

#### オブジェクトリテラルでプライベートメンバを作る

オブジェクトリテラルでプライベートなメンバを作るには、無名即時関数が作成するクロージャを利用する。（＝**モジュールパターン**という）

```js
let obj;

(function() {
  const name = 'john';
  obj = {
    getName: function() {
      return name;
    },
  };
})();

console.log(obj.getName());
```

または

```js
const obj = (function() {
  const name = 'john';
  return {
    getName: function() {
      return name;
    },
  };
})();

console.log(obj.getName());
```

#### プロトタイプを使ってプライベートメンバを作る

コンストラクタでプライベートメンバを作ると、すべてのインスタンスに重複してメンバが作成されてしまい、効率が悪い。
これを避けるには、プロトタイプを使ってプライベートメンバを作成する。

```js
function Car() {}

Car.prototype = (function() {
  const secret = 'my-secret';
  return {
    getSecret: function() {
      return secret;
    },
  };
})();

const car = new Car();
console.log(car.getSecret()); // => 'my-secret'
```

#### プライベート関数を開示する

プライベートメソッドをパブリックメソッドとして開示する方法（=**開示パターン**）。
仮にパブリックなメソッドが書き換えられても、プライベートなメソッドは無事である。（イマイチ使いみちがわからない）

```js
let myUtil;

(function() {
  function a() {}
  function b() {}
  function c() {}
  myutil = { a, b, c };
});
```

### モジュールパターン

機能ごとにそれぞれ完結したいくつかのコード群に分ける方法。以下の機能を組み合わせて実現する。

- 名前空間
- 即時関数
- プライベートメンバと特権メソッド
- 依存関係の宣言

#### オブジェクトを作成するモジュール

```js
// 名前空間
MYAPP = { utilities: {} };

// 即時関数でクロージャを作成
MYAPP.utilities.array = (function(global) {
  // 依存関係の宣言
  const utilObj = MYAPP.utilities.object;
  const utilLang = MYAPP.utilities.lang;

  // プライベートメンバ
  const privateVar = 1;
  const privateMethod = function() {};

  // 一度限りの初期化処理
  doSomething();

  // パブリックAPI
  return {
    // ここでプライベートメンバを使ってなにかを行う
    somePublicMethod: function() {},
    somePublicMethod2: function() {},
  };
})(global); // globalを渡してクロージャ内部で使うことが多い
```

#### コンストラクタを作成するモジュール

```js
MYAPP = { utilities: {} };

MYAPP.utilities.Array = (function() {
  /* この部分は先例と同じ */

  // パブリックAPI　コンストラクタ
  const Constructor = function() {
    // ここでプライベートメンバを使ってなにかを行う
  };

  // パブリックAPI　プロトタイプ
  Constructor.prototype = {
    // ここでプライベートメンバを使ってなにかを行う
  };

  return Constructor;
})(global);
```

### サンドボックスパターン

モジュールパターンが持つ以下の欠点を克服するために使う。

- 同じ名前空間名を同時に使えない（バージョン違いなどのテストがやりにくい）
- 名前が長たらしい（MYAPP.utilities.array など）

サンドボックス環境にモジュール（機能）をインジェクトし、サンドボックス内で処理を完結する。
AngularJS と同じパターンかも。

1. インスタンスを作成する
1. インスタンスに機能をインジェクトする
1. コールバック関数内でインスタンスを操作して必要な処理を行う（下記で言う`box`）

詳細なコードは、本書の 5.5.2, 5.5.3 を参照すること。

```js
new Sandbox(['module1', 'module2'], function(box) {
  // `box`には、すでにmodule1/module2の機能がインジェクトされている。
  // ここで、それらの機能を活用して必要な処理を行う
});

function Sandbox(modules, callback) {
  /* thisに対してSandbox.modules.module1などをアタッチする処理を行ったのち、callbackする */
  callback(this);
}

// モジュールはコンストラクタ関数にアタッチしておく
Sandbox.modules.module1 = function something();
Sandbox.modules.module2 = function something2();
```

### スタティックメンバ

スタティック＝クラス全体で共有するもの

#### パブリックなスタティックメンバ

```js
const Car = function() {};

// スタティックメソッド
Car.ride = function() {};

// インスタンスメソッド
Car.prototype.sayName = function() {};

const bmw = new Car();

Car.ride(); // ok
Car.sayName(); // bad
bmw.ride(); // bad
bmw.sayName(); // ok
```

インスタンスからスタティックメソッドにアクセスしたい時は、プロトタイプにスタティックメソッドを追加しておく。
この場合、スタティックメソッド内で、スタティックに呼ばれたのかインスタンスから呼ばれたのかを判定し、適切な分岐処理を行う必要がある。

```js
Car.ride = function() {
  if (this instanceof Car) {
    /* インスタンスメソッドとして呼び出された場合の処理 */
  }
};

Car.prototype.sayName = Car.ride;
```

#### プライベートなスタティックメンバ

```js
const Car = (function() {
  let count = 0; // プライベートなスタティックメンバ

  // returnするコンストラクタ
  const NewCar = function() {
    couner += 1; // newされるたびにスタティックメンバを加算する
  };

  // スタティックメンバを取得する特権メソッド
  NewCar.prototype.getLastId = function() {
    return counter;
  };

  return NewCar;
})();

const car1 = new Car();
const car2 = new Car();
car1.getLastId(); // 1
car2.getLastId(); // 2
```

### オブジェクト定数

Javascript に定数はない。しかし、定数を静的プロパティとしてコンストラクタ関数に追加することはよく行われる。

```js
Car.MAX_HEIGHT = 1500;
Car.MAX_WIDTH = 1780;
```

### 連鎖（Chain）パターン

基本的に、オブジェクトのメソッドは`this`を返すようにしておくとよい（意味のある値を返す必要がある場合を除く）。
これにより、メソッドのチェーンが可能になる。

- メリット
  - タイピング量の減少
  - 簡潔で文のように読める
  - 処理を分割でき保守性が高い
- デメリット
  - デバッグが難しくなる

```js
const obj = {
  value: 1,
  increment: function() {
    this.value++;
    return this;
  },
  decrement: function() {
    this.value--;
    return this;
  },
};

console.log(
  obj
    .increment()
    .increment()
    .decrement().value, // 2
);
```

## コード再利用パターン(クラシカル)

- prototype プロパティは関数ではなくオブジェクトである必要がある。これは重要なことなのでよく覚えること。

### 両方を継承

```js
Child.prototype = new Parent();
```

- プロパティ・プロトタイプの両方を継承するパターン
- このパターンでは、親のインスタンスメンバ（例：`name`）とプロトタイプメンバ（例：`say`）が、全て子に継承される。ただしこれはプロトタイプ連鎖によるもので、コピーされているわけではない。
- 欠点
  - 親のインスタンスメンバが継承されるが、これは不要なことが多い
  - 子から親にパラメータを渡せない

```js
// 親
function Parent() {
  this.name = 'Adam';
}
Parent.prototype.say = function() {
  return this.name;
};

// 子
function Child() {}

// 継承
Child.prototype = new Parent();

const child = new Child();
child.say(); // Adam
```

上記の例では、プロパティやメソッドは下記の順に遡って検索される。

1. Child インスタンス
1. Child コンストラクタのプロトタイプ（Parent インスタンス）
1. Parent コンストラクタのプロトタイプ

### 両方を継承（コンストラクタ拝借）

```js
function Child(...args) {
  Parent.apply(this, args);
}
Child.prototype = new Parent();
```

- プロパティ・プロトタイプの両方を継承するパターン
- 前項と異なり、コンストラクタを拝借することで、親のインスタンスメンバは子にコピーされる
- 親のプロトタイプも、連鎖により子に継承される

```js
// 親
function Parent(name) {
  this.name = name || 'Adam';
}
Parent.prototype.say = function() {
  return this.name;
};

// 子
function Child(...args) {
  Parent.apply(this, args);
}
Child.prototype = new Parent();

const child = new Child('Patrick');
console.log(child.name); // Patrick
console.log(child.say()); // Patrick
```

### プロパティのみ継承

```js
function Child(...args) {
  Parent.apply(this, args);
}
```

コンストラクタを拝借して、プロパティのみ継承（コピー）する。

- 親のインスタンスメンバ（例：`name`）のみ継承される。親のプロトタイプメンバは継承されない。
- 利点
  - 親のインスタンスメンバのコピーを得られる
- 欠点
  - 親のプロトタイプからなにも継承されないので、連鎖は壊れる

```js
// 親
function Parent() {
  this.name = 'Adam';
}

// 子
function Child(...args) {
  Parent.apply(this, args);
}

const child = new Child();
console.log(child.name); // Adam
console.log(child.hasOwnProperty('name')); // true
```

### プロトタイプのみ継承（共有）

```js
Child.prototype = Parent.prototype;
```

- 利点
  - 速い、シンプル
- 欠点
  - 一箇所のプロトタイプの変更が、すべての子・親に影響を与えてしまう。

### プロトタイプのみ継承（プロキシ）

パターン 4 を改善したもの。
一時的コンストラクタによるプロキシをかませることで、先祖のプロトタイプが変更されてしまうことを防いでいる。
これが、ほぼベストと言える。

```js
const Proxy = function() {};
Proxy.prototype = Parent.prototype;
Child.prototype = new Proxy();
Child.prototype.constructor = Child; // Parentじゃないよーと明示
```

## コード再利用パターン(モダン)

### プロトタイプのみ継承

[`Object.create()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create)を使う。

第一引数にプロトタイプとなるべきオブジェクトを、第二引数に[Properties Object](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create#Using_propertiesObject_argument_with_Object.create()>)を記載する

```js
// 親
function Parent(name) {
  this.name = name || 'Adam';
}
Parent.prototype.say = function() {
  return this.name;
};

const parent = new Parent();
const child = Object.create(parent, { age: { value: 17 } });

console.log(child.hasOwnProperty('name')); // false => prototype
console.log(child.hasOwnProperty('say')); // false => prototype
console.log(child.hasOwnProperty('age')); // true
console.log(child.say()); // Adam
```

上記の例は、クラシカルパターン１と同じ動作になる。

```js
const child = Object.create(Parent.prototype, { age: { value: 17 } });
```

上記の例は、クラシカルパターン 4 と同じ動作になる。

### プロパティのみ継承

単純に親のプロパティを子にコピーする。下記の二種類がある。

- Shallow Copy（`Object.assign()`など）
- Deep Copy (lodash の deep clone など)

### ミックスイン

複数のオブジェクトを混ぜ合わせて新しいオブジェクトを作る。実装は簡単で、単にプロパティをコピーしていくだけでよい。

```js
const cake = mix(
  { egg: 2, large: true },
  { butter: 1, salted: true },
  { sugar: 'sure!' },
);
```

### メソッドの拝借

あるオブジェクトのメッソドを使いたい、しかし親子関係は作りたくない、そういうときはメソッドの拝借を使うと便利。

先述の通り、`apply`や`call`を使う。

```js
function slice(...args) {
  return Array.prototype.slice.apply(args, [1, 3]);
}
console.log(slice(1, 2, 3, 4, 5, 6)); // 2, 3
```

#### 束縛

あるオブジェクトのファンクションに this をバインドしたいときは、下記のようにする（ES5 以前）

```js
function bind(obj, func) {
  return function(...args) {
    return func.apply(obj, args);
  };
}

newFunc = bind(object, someObject.oldFunc);
```

ES5 移行では、`Function.prototype.bind()`を使うことで束縛できる。
第一引数に this となるべきオブジェクトを指定する。
第二引数以降を指定することで部分適用も行うことができる。

```js
someObject.oldFunc.bind(object, arg1, arg2);
```

## デザインパターン

### シングルトン

JavaScript にはクラスがない。オブジェクト自体がすでにシングルトンである。

```js
obj1 = {};
obj2 = {};
obj1 === obj2; // false
```

以下、実際には訳には立たないが、実験的に実装してみた例。

#### new を使ってシングルトンを作る（スタティックプロパティにキャッシュ）

```js
function Car() {
  if (typeof Car.cache === 'object') {
    return Car.cache;
  }
  // do something like `this.name = 'bmw'`
  Car.cache = this;
}
console.log(new Car() === new Car()); // true
```

#### new を使ってシングルトンを作る（クロージャにキャッシュ）

先例では書き換えが可能なので、書き換えをできなくしたパターン。

```js
const Car = (function() {
  // プライベートメンバ
  let instance;

  // 特権メソッド（コンストラクタ）を返す
  return function() {
    // キャッシュがあればそれを返して終わる
    if (instance) return instance;

    // キャッシュしておく
    instance = this;

    // this.name = 'something'などの処理をここでする
  };
})();

console.log(new Car() === new Car()); // true
```

### ファクトリ

実行時に文字列として指定された型でオブジェクトを作成するためのメソッド。

- クラスまたはクラスの静的メソッドで実装する
- ファクトリで作成したオブジェクトは、共通の親を継承する
- 以下のメリットがある
  - 似たようなオブジェクトを楽に量産できる（`new`もオブジェクトリテラルも使わないで OK）
  - 型を知らなくてもオブジェクトを作成できる手段を提供する

```js
function Car() {}

Car.prototype.drive = function() {
  console.log(`I have ${this.doors} doors.`);
};

Car.Compact = function() {
  this.doors = 4;
};
Car.Convertible = function() {
  this.doors = 2;
};
Car.Bus = function() {
  this.doors = 20;
};

Car.factory = function(type) {
  // 一度だけプロトタイプを継承する処理
  if (typeof Car[type].prototype.drive) {
    Car[type].prototype = new Car();
  }
  // 適切なコンストラクタでオブジェクトを作成して返す
  return new Car[type]();
};

compact = Car.factory('Compact');
convertible = Car.factory('Convertible');
bus = Car.factory('Bus');

compact.drive(); // I have 4 doors.
convertible.drive(); // I have 2 doors.
bus.drive(); // I have 20 doors.
```

### イテレータ

複雑な構造のデータをループで巡回処理するために、必要な API を公開するパターン。
API には、`next()`,`hasNext()`,`rewind()`,`current()`などを用意する。
データはプライベートにすることが多い。

```js
iterable = (function() {
  let index = 0;
  const data = [1, 2, 3, 4, 5];

  return {
    next: function() {
      if (!this.hasNext()) return null;
      element = data[index];
      index += 1;
      return element;
    },
    hasNext: function() {
      return index < data.length;
    },
    rewind: function() {
      index = 0;
    },
    current: function() {
      return data[index];
    },
  };
})();

console.log(iterable.next()); // 1
console.log(iterable.next()); // 2
console.log(iterable.next()); // 3
console.log(iterable.next()); // 4
console.log(iterable.next()); // 5
console.log(iterable.next()); // null
```

### デコレータ

実行時に動的に機能を追加していくパターン。下記の例では`getPrice()`に動的に機能を追加している。

```js
function Sale(price) {
  this.price = price;
  this.queue = [];
}

// デコレータには、デコレートしたい関数と同名の関数を持たせる
Sale.decorators = {
  tax: {
    getPrice: price => price * 1.05,
  },
  sending: {
    getPrice: price => price + 1500,
  },
  jpy: {
    getPrice: price => `JPY:${price}`,
  },
};

// 実行時にデコレータが追加されたら、キューに保存しておく
Sale.prototype.decorate = function(decorator) {
  this.queue.push(decorator);
};

// キューからデコレータを読み出し順に実行していく
Sale.prototype.getPrice = function() {
  let price = this.price;
  for (name of this.queue) {
    price = Sale.decorators[name].getPrice(price);
  }
  console.log(price);
};

const sale = new Sale(10000);

// getPrice()に対し動的に機能を追加している
sale.decorate('tax');
sale.decorate('sending');
sale.decorate('jpy');

// 実行すると、「JPY:12000」が出力される
sale.getPrice();
```

### ストラテジー

- 実行時にいくつかのアルゴリズム（戦略・ストラテジー）の中から最適なものを選択するパターン。
- validation などでよく使われる。

```js
const validator = {
  // これがストラテジー（戦略）
  strtegy: {
    isNonEmpty: {
      validate: _ => _ !== '',
      instructions: '何か入力してください',
    },
    isNumber: {
      validate: _ => !isNaN(_),
      instructions: '数値にしてください',
    },
    isAlphaNum: {
      validate: _ => !/[^a-z0-9]/i.test(_),
      instructions: '英数字にしてください',
    },
  },

  // キー名（項目）ごとにストラテジーを割り当てておく
  config: {
    firstName: 'isNonEmpty', // 空はだめよ
    // lastNameはなんでもいいよ
    age: 'isNumber', // 数字じゃないとだめよ
    username: 'isAlphaNum', // 英数字じゃないとダメよ
  },

  messages: [],

  validate: function(data) {
    this.messages = [];
    for (key in data) {
      // プロトタイプはスルー
      if (!data.hasOwnProperty(key)) continue;

      // キーに適合するストラテジー名とストラテジー本体を抽出
      const strategyName = this.config[key];
      const strategy = this.strtegy[strategyName];

      // チェックの必要がないキーはスルー
      if (!strategyName) continue;

      const valid = strategy.validate(data[key]);
      if (!valid) {
        const msg = `Error at ${key}. ${strategy.instructions}`;
        this.messages.push(msg);
      }
    }
  },

  hasErrors: function() {
    return this.messages.length !== 0;
  },
};

const data = {
  firstName: '',
  lastName: 'Doe',
  age: 'unknown',
  username: 'o_O',
};

validator.validate(data);
if (validator.hasErrors()) console.log(validator.messages);

/*
[ 'Error at firstName. 何か入力してください',
  'Error at age. 数値にしてください',
  'Error at username. 英数字にしてください' ]
*/
```

### ファサード

ファサード＝建物の正面部分のこと。

組み合わせて使われるメソッド群（あるいは設計がまずいメソッド群）を新しいメソッドで包んで、より便利なAPIを提供する方法。

```js
// 一緒に呼ぶ
myobj = {
  superMethod: (arg) => {
    method1(arg);
    method2(arg);
  }
}

// 条件分岐する
myobj = {
  method: () => {
    if() method1();
    if() method2();
  }
}

// 古いAPIをまとめて新しいAPIを作る
myobj = {
  newAPI: () => {
    /* do something new */

    // 段階的に古いAPIは廃止する
    oldAPI1();
    oldAPI2();
    oldAPI3();
  },
  oldAPI1: () => {},
  oldAPI2: () => {},
  oldAPI3: () => {},
}
```

### プロキシ

プログラムとAPIの間にプロキシをかませるパターン。下記のような目的で使う。

- 遅延初期化
  - 本当に必要になるまで、コストの掛かる作業をペンディングする
- リクエストの集約
  - bounce等を活用して、リクエストをまとめて送付することで効率を上げる
- cache
  - キャッシュがあればそれを使う

### メディエータ（仲介者）

モジュール間を疎結合に保つためのデザインパターン。

モジュール間で直接のやりとりはせずに、全てメディエータと呼ばれる仲介モジュールを介して行う方法。

### オブザーバ

Publish（発行）/Subscribe（購読）パターンともいう。オブザーブ可能なオブジェクトを作成することで、オブジェクト間を疎結合に保つ。

- 発行者は、Publisher(又は Subject)と呼ばれる。RxのSubjectとは意味が異なるので注意。
- 購読者は、Subscriber(又は Observer)などと呼ばれる。

Publisherは下記のメンバを持つ

- `subscribers`　行動者を保持する配列
- `subscribe(type, cb)`又は`on(type, cb)` 購読者を追加する
- `unsubscribe(type, cb)` 購読者を削除する
- `publish(type, arg)` イベントを発行し、各購読者に通知する

## DOMとブラウザのパターン

### 関心の分離

関心を下記の通りに分け、段階的強化（Progressive Enhansement）を行う、という考え方。

- コンテンツはHTML
- プレゼンテーションはCSS
- 振る舞いはJavascript

### DOMスクリプティング

結論：DOM走査は最小限に減らせ

データの取得

```js
// アンチパターン
const padding = doument.getElementById('some').style.padding
const margin = doument.getElementById('some').style.margin

// よりよい方法
const style = doument.getElementById('some').style
const padding = style.padding;
const margin = style.margin;
```

要素の追加（Fragentを新規に作り、下ごしらえ）

```js
const fragment = document.createDocumentFragment();
fragment.appendChild(someChild);
fragment.appendChild(someChild);

document.body.appendChild(fragment)
```

要素の変更（クローンすることでFragmentを作り、下ごしらえ）

```js
const oldNode = document.getElementById('some');
const cloneNode = oldNode.cloneNode(true);

oldNode.parentNode.replaceChild(cloneNode, oldNode);
```

### イベント委譲

```html
<div>
  <a>button1</a>
  <a>button2</a>
  <a>button3</a>
</div>
```

上記のような要素があったとき、A要素にイベントを設定せず、DIV要素にイベントを設定して一括で処理すること。DIVのイベントハンドラで下記のように処理する。

```js
if(e.target.nodeName.toLowerCase() ==="a") doSomething();
```

### 重たい処理

ブラウザをハングされるような重たい処理には、バックグラウンドで動作する WebWorker を使うと良い。
worker側で`postMessage`して、ブラウザ側の`onmessage`で受け取る事ができる。

```js
// Browser
const worker = new Worker('myWebWorker.js');
worker.onmessage = (e) => console.log(e.data); // => 'hello' 'done!'

// Web Worker
postMessage('hello')
setTimeout(()=>postMessage('done!'),1000);
```

### JSファイルの読み込み

#### script要素をどこに書くか

script要素は他のダウンロードを阻害するので、可能な限りbody終了タグの近くに書く。HEADにすべてまとめるのは最悪のアンチパターン。

#### 動的なスクリプトの読み込み

```js
const script = document.createElement('script');
script.src = "//www.google.com/some.js";

const firstScriptNode =  document.getElementByTagName('script')[0];
firstScriptNode.parentNode.insertBefore(script, firstScriptNode)
```

SCRIPT要素の前に挿入している理由は、BODY要素やHEAD要素は存在しない可能性があるが、script要素は絶対に存在する要素だから（なければこのコードは実行できないので）

#### 遅延読み込み

JSを、最低限必要なJSと、装飾的なJSに分けて、後者のみを`window.load`イベント以降に動的に読み込む方法。

```js
window.onload = () => {
  /* 動的なJSの読み込み（前項のとおり） */
}
```

#### オンデマンドで読み込む

先述の動的なスクリプトの読み込みをプログラマティックに行うだけ。なお、読み込みの完了を補足したい場合は下記のようにする。

```js
script.onload = () => {
  /* JSファイルの読み込み完了時に行いたい処理をここに。IEの場合は別の方法が必要 */
}
```