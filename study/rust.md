# Rust

## 変数と可変性

- デフォルトで不変。変更可能にするには`let mut x=5`のようにする。
- 定数
  - `const MAX_POINTS: u32 = 100_000;`
  - 型注釈は必須
  - `mut`は使えない
  - `const`で宣言する
- シャドーイング
  - 前に定義した変数と同じ名前の変数を新しく宣言して上書きすること。`mut`はあくまで同じ型だが、こちらは型を変更できる。

## データ型

- スカラー型
  - 整数
    - 特に理由がなければ`i32`を使うこと。
  - 浮動小数点数
    - 特に理由がなければ`f64`を使うこと。
  - 論理値
  - 文字
    - char 型
    - シングルクオートで表す
    - ユニコードのスカラ値であり、世間一般的な「文字」とは異なるので留意(例えばゼロ幅スペースなど)
- 複合型
  - タプル
  - 配列
    - スタックまたは確実に固定長であるものに最適。それ以外であれば可変長であるベクタ型を使え。
    - 長さは変えられない
    - 配列の終端を超えたアクセスはパニックになる

### タプル型の書き方例

```rust
let tup: (i32, f64, u8) = (500, 6.4, 1);
// or
let tup = (500, 6.4, 1);

// 分配と呼ばれる代入方法
let (x, y, z) = tup;

// 0番目の要素にアクセス
let five_hundred = x.0;
```

### 推論

複数の型が推論される可能性がある場合、型注釈が必須。

```rust
let guess: u32 = "42".parse().expect("Not a number!");
```

## 関数

- rust の関数や変数はスネークケースで書く
- 文 --- Statement, 値を返さない
- 式 --- Expression, 値を返す
  - スカラ値
  - 関数呼び出し（最後にセミコロンはつけない。つけると文になる。）
  - マクロ呼び出し
  - スコープ（最後にセミコロンはつけない。つけると文になる。）

関数の書き方

```rust
fn main() {
    let x = plus_one(5);

    println!("The value of x is: {}", x);
}

fn plus_one(x: i32) -> i32 {
    x + 1
}
```

## フロー制御

- if
  - 式なので代入できる

```rust
let condition = false;
let num = if condition { 5 } else { 6 };
```

- loop

```rust
loop {
    // do something
}
```

- while

```rust
while number != 0 {
    // do something
}
```

- for

```rust
let a = [10, 20, 30, 40, 50];
for element in a.iter() {
    println!("the value is: {}", element);
}
```

- range

```rust
for number in (1..4) {
    // do something
}
```

## 所有権

なぜ所有権が必要なのか？

- ヒープメモリを効率的に管理するため
- メモリの二重開放を防ぐため
- GC を不要にするため

### 基本

- Rust の各値は、所有者と呼ばれる変数と対応している。
- いかなる時も所有者は一つである。
- 所有者がスコープから外れたら、値は破棄される。

### ムーブ

- 代入しても所有権が移動しない(Copy される)型
  - 整数型、論理値型、浮動小数点型、文字型
  - 上記から成るタプル
- 代入すると所有権が移動する(Move される)型
  - String 型その他

ムーブしたくない場合は`.clone()`などする必要がある

### 参照と借用

- 関数の引数として渡すと、所有権は関数に渡る。そうしたくない時は参照(`&`)を使う。
- そうすることで、新たな変数（参照）が作られる。

```rust
fn main() {
    let s1 = String::from("hello");

    let len = calculate_length(&s1);

    println!("The length of '{}' is {}.", s1, len);
}

fn calculate_length(s: &String) -> usize {
    s.len()
    // sはこの後破棄されるが、参照なので問題ない
}
```

- 参照を可変にしたい場合は`&mut 変数名`とする。
- スコープ内では以下のいずれかを使用できる
  - 一つの可変参照
  - 多数の不変参照
- 参照は常に有効でなければならない。必要に応じて参照ではなく実体を使うこと。

### スライス

- スライスとは、文字列や配列の一部分に対する参照
- なお、文字列リテラルは自ずから文字列スライスである

```rust
let my_string = String::from("hello world");
&my_string[..]

let numbers = [1, 2, 3, 4, 5];
&numbers[1..3];
```

## 構造体

```rust
// 構造体
struct User {
    username: String,
    email: String,
    sign_in_count: u64,
    active: bool,
}

// タプル構造体
struct Color(i32, i32, i32);

// ユニット構造体
struct UnitBook;
```

構造体をプリントする方法

```rust
// deriveを記述する
#[derive(Debug)]
struct Rectangle {}

let rect = Rectangle {};

// `:?`が大事
println!("rect is {:?}", rect);
```

### メソッド(instance メソッド)と関連関数(≒static メソッド)

```rust
impl Rectangle {
  // メソッド(selfをとる)
  fn can_hold(&self, other: &Rectangle) -> bool {
    self.width > other.width && self.height > other.height
  }

  // 関連関数(selfを取らない)
  fn square(size: isize) -> Rectangle {
    Rectangle {
      width: size,
      height: size,
    }
  }
}
```

## Enum

```rust
// 基本形
enum IpAddrKind {
  V4,
  V6,
}
let four = IpAddrKind::V4;
let six = IpAddrKind::V6;

// 発展形（値を持たせることができる）
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}
let m = Message::Move { x: 1, y: 2 };
```

### Option 型

Null になりうる値は Option 型として使う必要がある

```rust
// 標準ライブラリに定義されている。SomeとNoneは接頭子なしで使用できる。
enum Option<T> {
    Some(T),
    None,
}

let mut maybe_number: Option<i32>;
maybe_number = None;
maybe_number = Some(5);
```

## match

基本形

```rust
enum Coin {
  Penny,
  Nickel,
  Dime,
  Quarter(String),
}

fn value_in_cents(coin: Coin) -> u32 {
  match coin {
    Coin::Penny => 1,
    Coin::Nickel => 5,
    Coin::Dime => 10,
    Coin::Quarter(state) => { // 値を持つEnumの場合はこのように取り出せる
      println!("{}", state);
      25
    }
  }
}
```

Option との組み合わせ

```rust
fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        None => None,
        Some(i) => Some(i + 1),
    }
}

let five = Some(5);
let six = plus_one(five);
let none = plus_one(None);
```

### if let

`match`で特定のケースだけ取り扱いたい場合は、`if let`を使うことも検討すると良い。

```rust
let mut count = 0;
match coin {
    // {:?}州のクォーターコイン
    Coin::Quarter(state) => println!("State quarter from {:?}!", state),
    _ => count += 1,
}

// これは下記のようにも書ける

let mut count = 0;
if let Coin::Quarter(state) = coin {
    println!("State quarter from {:?}!", state);
} else {
    count += 1;
}
```

## Packages, Crates, and Modules

### Packages, Crates

- package
  - 一つ以上の crate で構成される。crate の数の要件は以下の通り。
    - library crate は 0 または 1 つだけ
    - binary crate はいくつでも
    - 少なくとも１つ以上の crate が必要
  - なんらかの機能を提供する
  - `cargo.toml`を含む。ここには crate のビルド方法が書かれている
- crate
  - library crate 又は binary crate のこと
- crate root
  - 下記のいずれか
    - `src/lib.rs`(library crate)
      - パッケージ名が crate 名になる
    - `src/main.rs`(binary crate)
      - パッケージ名が crate 名になる
    - `src/bin/**.rs`(binary crate)
  - その crate の root module になる
  - コンパイラが読み込みをスタートする地点

### Modules

- クレート内でコードをグルーピングするために使う
- 可読性と再利用可能性を向上させるためにある
- プライバシーの管理のためにある
  - Public --- コードの外でも使える
  - Private --- コードの外では使えない

```rs
mod front_of_house {
    mod hosting {
        fn add_to_waitlist() {}

        fn seat_at_table() {}
    }

    mod serving {
        fn take_order() {}

        fn serve_order() {}

        fn take_payment() {}
    }
}
```

上記のようなコードを crate root に定義した場合、モジュールツリーは以下のようになる

```
crate(暗黙的に命名される)
 └── front_of_house
     ├── hosting
     │   ├── add_to_waitlist
     │   └── seat_at_table
     └── serving
         ├── take_order
         ├── serve_order
         └── take_payment
```

### Path

- パスの種類
  - Absolute path --- crate name 又は`crate`のリテラルから始まる
  - Relative path --- `self`、`super`又は同一レベルにあるモジュール名から始まる
- `::`で区切る
- Private と Public の管理
  - デフォルトでは：
    - 呼び出した関数と同一レベルにあるモジュールには`pub`なしでアクセス可能
    - 子モジュールやその内部は Private。パブリックにするには`pub mod`や`pub fn`などが必要。
    - 親モジュールは Public

```rs
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

pub fn eat_at_restaurant() {
    // Absolute path
    crate::front_of_house::hosting::add_to_waitlist();

    // Relative path
    front_of_house::hosting::add_to_waitlist();
}
```

`super`を使うと親モジュールにアクセスできる

```rs
fn serve_order() {}

mod back_of_house {
    fn fix_incorrect_order() {
        cook_order();
        super::serve_order();
    }

    fn cook_order() {}
}
```

struct の要素はデフォルトで非公開

```rs
mod back_of_house {
    pub struct Breakfast {
        pub toast: String,
        seasonal_fruit: String,
    }

    impl Breakfast {
        // この関数なしではBreakfastは初期化すらできない
        pub fn summer(toast: &str) -> Breakfast {
            Breakfast {
                toast: String::from(toast),
                seasonal_fruit: String::from("peaches"),
            }
        }
    }
}

pub fn eat_at_restaurant() {
    let mut meal = back_of_house::Breakfast::summer("Rye");
    // 変更可能
    meal.toast = String::from("Wheat");

    // 以下のコードはコンパイル不可
    meal.seasonal_fruit = String::from("blueberries");
}
```

一方、enum の要素はデフォルトで公開

```rs
mod back_of_house {
    pub enum Appetizer {
        Soup,
        Salad,
    }
}

pub fn eat_at_restaurant() {
    let order1 = back_of_house::Appetizer::Soup;
    let order2 = back_of_house::Appetizer::Salad;
}
```
