# JavaScript

[[toc]]

[参考資料](https://qiita.com/hakozaru/items/c00e472ab0f5e823098c)

## Functions

- アロー関数は無名関数である。名前のついた関数を作る場合は function を使う。

## Arguments

- 多く渡しても、少なく渡してもエラーは発生しない
- 足りない分は undefined となり、余った分は何事もないかのように振る舞う
- スプレッド演算子が便利

  ```js
  function hoge(...aaa) {
    console.log(aaa);
  }
  hoge(1, 2, 3, 4, 5); //=> (5) [1, 2, 3, 4, 5]

  function hoge(...aaa) {
    console.log(...aaa);
  }
  hoge(1, 2, 3, 4, 5); //=> 1 2 3 4 5
  ```

## this

this は**関数の呼び出され方**に依存している。「関数の宣言された場所」には依存しない。

```js
const obj = {
  name: 'たなか',
  speak() {
    return `私の名前は${this.name}です`;
  },
};

obj.speak(); //=> 私の名前はたなかです

const func = obj.speak;
func(); //=> 私の名前はです

window.name = 'グローバル';
func(); //=> 私の名前はグローバルです

// ちゃんとオブジェクトに束縛させればOK
const obj2 = {
  name: 'さとう',
};
obj2.speak = obj.speak;
obj2.speak(); //=> "私の名前はさとうです"
```

## this の束縛(call, bind, アロー関数)

this は呼び出した時の状況によって参照先が変化してしまう。call、bind、アロー関数を使用することにより、常に指定したものを this として動作させることができる。

## constructor

コンストラクタから生成されたオブジェクトは、生成に使用したコンストラクタ関数を保持している。

```js
function TestConstructor() {}
const test = new TestConstructor();

test.constructor; // => ƒ TestConstructor() {}
```

この constructor は、コンストラクタ関数の prototype として存在するもの。

```js
TestConstructor.prototype.constructor; // => ƒ TestConstructor() {}
```

instanceof と異なり、コンストラクタの種類が判定できるため「出所不明」なオブジェクトの詳細を調べる際に使える。

```js
const a = [];
const b = {};
const c = function() {};

a.constructor; //=> ƒ Array() { [native code] }
b.constructor; //=> ƒ Object() { [native code] }
c.constructor; //=> ƒ Function() { [native code] }

// 自作コンストラクタ(無名関数にすると名前は調べられないので注意)
const Myfunc = function Myfunction() {};
const func = new Myfunc();
func.constructor; //=> ƒ Myfunction() {}
```

## リテラル

データ型に格納できる値そのもの、または値の表現方法のこと

- 数値リテラル
- 文字列リテラル
- 配列リテラル
- オブジェクトリテラル

## null と undefined

- 「null」 は null を設定した状態。設定しない限り存在しない。
- 「undefined」は未定義、何も設定していない状態。

## if 文で false と判定される条件

- undefined
- null
- 0
- 空文字("")
- false
- NaN

## typeof

タイプを調べる時に使う。**プリミティブにのみ使用**すべきである。配列や null が object として判定されるなど、不思議な側面があるため。

## instanceof

- オブジェクトが何のコンストラクタから生成されたかを判定する。
- instanceof 演算子はプロトタイプチェーンを辿ってチェックを行うため、`something instanceof Object` は原則として true となる。（全てのオブジェクトは Object から派生しているため）

```js
const a = {};
const b = [];
const c = function() {};

a instanceof Object; //=> true
b instanceof Array; //=> true
c instanceof Function; //=> true
```

## Symbol

- プリミティブに分類される
- Symbol() コンストラクタから作成する。new は不要。
- 作成されたシンボルは必ずユニークとなる。
- オブジェクトの Key として使うことができる。文字列ではないのでブラケットをつけるのを忘れずに。

```js
const obj = {};
const HOGE = Symbol();

typeof HOGE === 'symbol'; // => true

obj[HOGE] = 123;
obj.HOGE = 999; // or obj['HOGE'] = 999;

obj; // => {HOGE: 999, Symbol(): 123}
```

## Map / Set

- **Map**
  - key-value ペアを扱う
  - key となるオブジェクトに対し、オブジェクトを汚さずに情報を付加できる
- **Set**
  - 重複のないデータセットを扱う

いずれも、key には primitives と object を使うことができる。

## WeakMap / WeakSet

基本的には Map / Set と同じ。異なる点は以下の通り。

- key はオブジェクトである必要がある。プリミティブは使えない。
- key の一覧を取得する方法がない。
- key として設定されているのオブジェクトへの参照が一つもなくなった時点で、外部から情報を取得する手段がなくなるため、ガベージコレクションの対象になる。（=**弱い参照**）

```js
vm = new WeakMap();
let key = {}; // キーにはオブジェクトを使用する

wm.set(key, 100); // keyに100を関連付ける
wm.get(key); // => 100

key = { some: 'new object' }; // 参照元が一つもなくなる
wm.get(key); // => undefined
```

[参考資料](https://uhyohyo.net/javascript/16_1.html)

## URI エンコード

エンコードが必要な部分ごとに `encodeURIComponent` をかけた上で結合し、URI を完成させること。

firebase storage のダウンロードリンクを作成する際によく使う。

[参考](http://www.m-bsys.com/code/javascripr-encodeuri)

```js
encodeURIComponent('post/filename.jpg');
// => "post%2Ffilename.jpg"
```

## Object のクローン

spread(`...`)を使ってオブジェクトをコピーしても、2 階層目以下の変数は依然同じオブジェクトを指し示す。
これを回避するには lodash の`cloneDeep`などが必要となるが、手っ取り早くやるには下記のようにするとよい。

```js
var oldObject = {
  address: {
    street: 'Station Road',
    city: 'Pune',
  },
};
var newObject = JSON.parse(JSON.stringify(oldObject));

newObject.address.city = 'Delhi';
console.log(oldObject); // => Pune
console.log(newObject); // => Delhi
```

## Async / Await の落とし穴

`forEach`の中では`await`が効かない。
`for`, `for-of`, `for-in`を使え。

## Generator

通常のファンクションと似ているが、処理途中の段階で値を取り出す（yield）ことができること、その状態を保持したまま何度も呼び出して処理を継続できる点が異なる

```js
function* generator() {
  for (i = 0; i < 10; i++) {
    yield i;
  }
}

for (i of generator()) {
  console.log(i);
}
// => 123456789
```
