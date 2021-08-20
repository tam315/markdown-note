# Flutter - Dart

[[toc]]

## 参考資料

- [https://dart.dev/guides/language/language-tour](https://dart.dev/guides/language/language-tour)

## 基本

クラス

```dart
class Order {
  var id;
  var reference;
  var date;

  Order(id, reference, date) {
    this.id = id;
    this.reference = reference;
    this.date = date;
  }

  getInfo() {
    return "Your order information: " +
      "${this.id}, ${this.reference}, ${this.date}";
  }
}

void main() {
  var order1 = new Order(1, 'ref1', new DateTime.now());
  print(order1.getInfo());
}
```

コンストラクタのショートハンド

```dart
// 以下は前述のコードと等価
Order(this.id, this.reference, this.date);
```

Optional and positional parameter は`[]`で囲む

```dart
Order(this.id, this.reference, [this.date]);
```

Named parameter は`{}`で囲む

```dart
Order(this.id, this.reference, {this.date});

// 呼び出し方
var order1 = new Order(1, 'ref1', date:new DateTime.now());
```

複数の種類のコンストラクタを作りたいとき

```dart
Order(this._id, this._reference, {this.date});

// 別のコンストラクタを作る
Order.withDiscount(this._id, this._reference, [this.code]){
  /* 割引コードが有るときの初期化処理など */
}

// デフォルトのコンストラクタへ処理をリダイレクトすることもできる
Order.withDiscount(code) : this(123, 'ref', code);
```

Method Cascade

```dart
class Order {
  var _id;
  var _reference;
  var bookings;

  Order(this._id, this._reference);

  getInfo() {
    print("Your order information: ${this._id}, ${this._reference}");
  }
}

void main() {
  var order1 = new Order(1, 'ref1');
  order1.bookings = ['booking1','booking2','booking3'];
  order1.getInfo();

  // 上記は以下のように書ける。これがMethod Cascade
  var order1 = new Order(1, 'ref1')
    ..bookings = ['booking1','booking2','booking3']
    ..getInfo();
}
```

Constant constructors

- クラスインスタンスが変更不可のオブジェクトを生成する場合に使える
- メンバ変数はすべて final である必要がある

```dart
class ImmutablePoint {
  final double x, y;

  const ImmutablePoint(this.x, this.y);
}
```

Factory constructor

- コンストラクタが毎回新しいオブジェクトを作らない場合、たとえばキャッシュを返す場合などに使う
- factory では this にアクセスできない

```dart
class Logger {
  factory Logger(String name) {
    return cachedSomething;
  }
}
```

継承と super

```dart
class Vehicle {
  var model;
  var year;

  Vehicle(this.model, this.year);
}

class SellingCar extends Vehicle {
  var price;

  // modelとyearはメンバ変数にセットしていない点に注意
  SellingCar(model, year, this.price): super(model, year);
}

var sellingCar = SellingCar('bmw', 1992, 20000);
```

プライベートにするにはアンダースコアをつける

```dart
var _id;
```

Multiline string

```dart
"""マルチ
ライン
ストリング"""
```

new はあってもなくてもいい

```dart
new Order()
// 下記でも等価
Order()
```

`final` と `static const` の違い（クラス内で使う場合）

- final はランタイム時に与えられた引数などにより値が決まる。かつ変更不可。
- static const はコンパイル時に値が決まる。かつ変更不可。
  - クラス変数としてのみ利用可能。
  - コンパイル時に値を確定できないことから、メンバ変数に`const`をつけることはできない。
- クラス外で使用する場合は、どちらを使ってもあまり差はないが、`const`のほうが効率が良さそう。

```dart
class Person {
  static const int minAge = 18; // クラス変数
  final String name; // メンバ変数
}
```

mixin の使い方

```dart
mixin Piloted {
  int astronauts = 1;

  void describeCrew() {
    print('Number of astronauts: $astronauts');
  }
}

class PilotedCraft extends Spacecraft with Piloted {
  // ···
}
```

Async --- Future(ES6 の Promise みたいなもん) を待つことができる

```dart
const oneSecond = Duration(seconds: 1);

// Futureを普通に使うとこうなる
Future<void> printWithDelay(String message) {
  return Future.delayed(oneSecond).then((_) {
    print(message);
  });
}

// async/awaitを使うとこうなる
Future<void> printWithDelay(String message) async {
  await Future.delayed(oneSecond);
  print(message);
}
```

Stream を作るには`async*`を使う。これにより`yield`が使えるようになる。

```dart
Stream<int> counter() async* {
  var _counter_ = 0;
  while (true) {
    await Future.delayed(oneSecond);
    yield _counter_;
  }
}
```

エラーの投げ方とキャッチの仕方

```dart
throw StateError('No astronauts.');

try {
  // ...
} on IOException catch (e) {
  // ...
} finally {
  // ...
}
```

const value というものもある。`const`は[冗長に書かない](https://dart.dev/guides/language/effective-dart/usage#dont-use-const-redundantly)こと。

```dart
var foo = const [];
foo.add(123); // 不可
foo = [5,6,7]; // 可

const bar = [];
foo.add(123); // 不可
foo = [5,6,7]; // 不可
```
