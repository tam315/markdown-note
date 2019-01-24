# Golang

[[toc]]

## Packages, Valiables and Functions

### Packages

- Go のプログラムはパッケージで成り立っている
- `main`パッケージの`main`関数からプログラムが始まる
- パッケージ名はインポートパスの最後の要素と同じ名前である(`math/rand`なら`rand`)

#### Imports

```go
// bad
import "fmt"
import anotherName "math"
import _ "io" // 初期化処理だけ使いたい場合

// good (factored import)
import (
  "fmt"
  anotherName "math"
  import _ "io"
)
```

#### Exported names

- 大文字で始まる名前がエクスポートされる
- パッケージをインポートしたとき、エクスポートされた名前のみ参照できる

### Functions

- 各引数の後に型を記載する
- `()`の後に返値の型を記載する

```go
func add(x int, y int) int {
  return x + y
}

// 連続する引数が同じタイプなら省略できる
func add(x, y int) int {
  return x + y
}
```

#### Multiple results

ファンクションは複数の値を返すことができる。

```go
func swap(x, y string) (string, string) {
  return y, x
}

func main() {
  a, b := swap("hello", "world")
  fmt.Println(a, b) // => world hello
}
```

#### Named return values

- 戻り値に名前をつけると、関数の最初で定義した変数として扱われる
- 名前付き戻り値を使い、かつ return に何も書かなかった場合、自動的に名前付き戻り値がリターンされる（naked return）。ただし、長い関数では読みやすさの点から明示的に記載すること。
- 戻り値の意味を表す名前をつけるよう心がけること

```go
func split(sum int) (x, y int) {
  x = sum / 2
  y = sum - x
  return
}

func main() {
  a, b := split(20)
  fmt.Println(a, b)
}
```

#### 値渡しと参照渡し

- 関数に引数を渡した場合、値はコピーされる。つまり、呼び出し元の変数とは別物である。
- 下記の場合、`i`は`myInt`のコピーであり、`p`は`myPointer`のコピーである。

```go
func test(i int, p *int) {}

func main() {
  myInt := 123
  myPointer := &myInt
  test(myInt, myPointer)
}
```

#### 可変長パラメータ

- 最後の引数に限って、`...`をつけることで可変長のパラメータとして受け取れる
- 受け取ったパラメータはスライスとして扱われる。

```go
// c の型は []string になる
func someFunc(a int, b int, c ...string){}
```

#### 関数リテラル

- 匿名関数（クロージャ）を作るときに使う
- 記法としては、通常の関数宣言から名前を削除するだけ
- リテラルの外側の変数にアクセス可能
- 名前がないので、関数を呼び出す際には、IIFE にするか、変数に代入して後から呼び出す。

```go
// 関数リテラル
func (a string, b int) []string {}
```

#### 関数型

- 関数を変数に代入するときの型として扱うためのもの
- 引数名は省略可能であり、通常は書かない

```go
// 関数型の宣言
var a func(int, int) int

// 実装
a = func(a int, b int) int {}
```

### Variables

`var`で変数を宣言できる。

```go
// 複数の同じ型の変数はまとめて宣言できる。
var a, b, c bool

func main() {
  var d int
  fmt.Println(a, b, c, d) // => false false false 0
}
```

#### Initializers

宣言時に内容を設定する場合は、型定義を省略できる。

```go
var a, b, c = 1, true, "no!"
// or factored style
var (
  a = 1
  b = true
  c = no
)

fmt.Println(a, b, c) // => 1 true "no!"
```

#### Short variable declarations

- **ファンクションの中であれば**、`:=`を使うことで`var`を省略できる。
- ファンクションの外では、すべての Statement は`var`,`func`,`import`などのキーワードから始まる必要があるため、省略形は使えない。

```go
func someFunc() {
  a, b, c := 1, true, "no!"
  fmt.Println(a, b, c) // => 1 true "no!"
}
```

#### Basic types

- `int`, `uint`, `uintptr`は、32bit システムでは 32bit、64bit システムでは 64bit である。
- 特に理由がなければ、サイズ指定やアンサインドは使わず、`int`を使うこと。

```txt
bool

string

int  int8  int16  int32  int64
uint uint8 uint16 uint32 uint64 uintptr (u = unsigned)

byte // alias for uint8

rune // alias for int32
    // represents a Unicode code point

float32 float64

complex64 complex128
```

#### Zero values

明示的に初期値を設定しない限り、変数には「Zero Values」がセットされる

| type                           | value                         |
| ------------------------------ | ----------------------------- |
| 数値                           | `0`                           |
| boolean                        | `false`                       |
| 文字列                         | `""`(空文字列)                |
| struct                         | 各フィールドがゼロ値の struct |
| 配列、スライス                 | 各要素がゼロ値の配列          |
| マップ                         | 空のマップ？                  |
| その他（ポインタ、関数型など） | `nil`                         |

```go
var a int     // => 0
var b float64 // => 0
var c bool    // => false
var d string  // => ""
```

#### Type conversions

`Type(value)`の形で型変換を行える。

```go
var i float64 = float64(123)
j := uint(456)
```

#### Type inference

- 明示的に型を指定しなかった場合は、右辺の値から型推論される。
- 数値の場合は、必要な精度により、適切な方が自動で選択される。

```go
var i = 1 // int
j := 1 // int

a := 42           // int
b := 3.142        // float64
c := 0.867 + 0.5i // complex128
```

### Constants

- 定数には文字列、ブーリアン、数値を使うことができる。
- `:=`記法は使えない

```go
const Pi float64 = 3.14
const (
  A int = 123
  B string = "hello"
)
```

### Numeric Constants

- 数値定数は untyped（型を持たない）にできる
- untyped な数値定数は高精度である
- untyped な数値定数は、実行時の文脈で型が決まる

```go
// タイプを指定していない
const Big = 1 << 100

func needFloat(x float64) float64 { return x * 0.1 }

func main() {
  fmt.Println(needFloat(Big)) // ここで初めて型が決まる(float64)
}
```

### Literals

```go
// 論理値リテラル
true, false

// 整数リテラル
8, 0x23

// 浮動小数点リテラル
0.0, 12.5, 12e5

// 虚数リテラル
0i, -123.45i

// 文字（ルーン）リテラル
'a', 'b'

// 文字列リテラル
"エスケープが\n解釈される"
`エスケープが\n無視されるが、
改行を入れることができる`

// 関数リテラル
func (string, int) []string {}
```

## Flow control statements

### for

- 3 つの要素を記載できる
  - init statement：初回のみ実行。ここで定義した変数は for の中でのみ有効。
  - condition expression：毎回繰り返しの冒頭で**評価**
  - post statement：毎回繰り返しの最後で**実行**
- `()`は不要

```go
for i := 0; i < 10; i++ { }

// 一部を省略できる
for ; sum < 1000; i++ { }

// init statementとpost statementを両方省略するときは
// セミコロンを省略できる
for sum < 1000 { }

// 何も要素を記載しなければwhileとして使える
for { }
```

### range

`range()`を使うと便利にループ処理できる。

```go
for index, value := range my_slice {}
// 省略するときは`_`にするか、削除する
for index := range slice {}
for _, value := range slice {}
```

range で使える型は下記の通り

| type         | 1st value          | 2nd value                       |
| ------------ | ------------------ | ------------------------------- |
| Array, Slice | インデックス       | 値                              |
| string       | バイトインデックス | unicode コードポイント(rune 型) |
| map          | キー               | 値                              |
| channel      | 値                 | -                               |

### if

- `()`は不要
- init statement を記載することができる。ここで定義した変数は if の中でのみ有効。

```go
if x < 0 {

} else {

}

if x := 100; x < 0 {
  // 実行されない
} else {
  // 実行される
}
```

### switch

- init statement を記載することができる。ここで定義した変数は switch の中でのみ有効。
- 上から順に評価され、最初に当てはまった１つのケースだけ実行される。`break`は不要。

```go
switch a := 1; a {
case 1:
  fmt.Println("number is one")
case 2:
  fmt.Println("number is two")
}
```

- 他の言語と異なり、Go では`case`節に式を書くことができる。
- 条件式を省略すると、`switch true`を指定したのと同じことになる。
- 上記を組み合わせることで、`if-elseif-else`を簡略に書くことができる

```go
switch {
case b == 1:
  fmt.Println("number is one")
case b == 2:
  fmt.Println("number is two")
}
```

### defer

引数の**評価**のみ即時に行い、自身を包含するファンクションが`return`するまで待ってから**実行**する。

```go
func main() {
  defer fmt.Println("world")
  fmt.Println("hello")
} // => "hello world"
```

defer statement はスタックに追加されていくため、最終的には逆順で実行される。

```go
for i := 0; i < 10; i++ {
  defer fmt.Println(i) // 9 8 7 6 5 4 3 2 1 0
}
```

## More types

### Pointers

ポインタ＝「変数の内容が存在するメモリ上のアドレス」を保持する変数

`*タイプ`でポインタを宣言できる

```go
var pointer *int
```

`&変数`でメモリアドレスを取得できる

```go
i := 123
pointer = &i
```

`*ポインタ`で「そのメモリアドレスに存在する内容」を参照できる。これを、dereferencing、indirecting、値参照、間接参照などという。

```go
fmt.Println(*pointer) // => 123
*pointer = 456
fmt.Println(*pointer) // => 456
```

#### メモリ領域の確保

`new()`を使うことで、ポインタに明示的にメモリ領域を割り当てることができる。確保された領域にはゼロ値が代入される。

```go
var i *int = new(int) // i == メモリアドレス, *i == 0
*i := 123 // => ok
```

```go
var i *int // i == nil
*i := 123 // => panic
```

#### 変数とポインタの違い

ポインタは、「メモリアドレス型」の変数と考えるべし（ただし、特別な挙動を持つ）

その証拠に、変数・ポインタの、どちらも「値」と「メモリアドレス」を持つ。
値には無印で、メモリアドレスには`&`を頭につけることでアクセスできる。

```go
i := 1234
p := &i
fmt.Println(i, &i) // => 1234 0xc000018090
fmt.Println(p, &p) // => 0xc000018090 0xc000006028
```

- 特別な挙動
  - ポインタだけが持つ特別な挙動が、値参照である。
  - `*`を頭につけることで、**値として持っているメモリアドレス**内に存在する値にアクセスできる。
- 代入時等の振る舞い
  - 代入をすれば、当然ながら「値」がコピーされる
  - 変数なら、「値」は実値なので実値がコピーされる
  - ポインタなら、「値」はアドレスなのでアドレスがコピーされる
- 最も低レベルで考えた時、変数やポインタが実際に格納している本質は、**アドレスとその解釈方法**である
  - 解釈方法 = 型 = 数値として読む、文字として読む、アドレスとして読む、など

### Structs

- `struct`型は、複数フィールドから成る型である
- struct の値にはドットでアクセスできる

```go
var x struct {
  // 先頭を大文字にすると外部パッケージからもアクセスできるようになる
  i int
  f float32
  s string
}
x.i = 1
x.f = 1.1
x.s = "hello"
```

- 構造体型を毎回手書きするのは面倒なので、名前のついた Struct 型として宣言することができる
- 名前をつけると、後述の Struct Literals を使うことで簡単に構造体を生成できる。

```go
type Car struct {
  Name string
  Age  int
}
car := Car{"bmw", 15}
```

#### Zero Values

Struct の各フィールドには Zero Values がセットされる

```go
type MyType struct {
  MyString string
  MyInt    int
  MyFloat  float64
}

func main() {
  var t MyType
  fmt.Printf("%T %v\n", t.MyString, t.MyString) // => ''
  fmt.Printf("%T %v\n", t.MyInt, t.MyInt) // => 0
  fmt.Printf("%T %v\n", t.MyFloat, t.MyFloat) // => 0
}
```

#### Pointers to structs

- struct のポインタで値参照する場合は、単純に`pointer.Name`のようにすればできる。
- `*(pointer).Name`などとする必要はない

```go
car := Car{"bmw", 15}
pointer := &car
fmt.Println(pointer.Name) // => {bmw 15}
```

#### Struct Literals

全てのフィールド値を順番に記述する方法

```go
car := Car{"bmw", 15}
```

`name: value`構文を使って、一部の値だけを記述する方法（指定しなかったフィールドには zero values が設定される）

```go
car := Car{Name: "bmw"}  // Age:0 implicitly
car := Car{}      // Name:"" and Age:0 implicitly
```

`&`を頭につけると、作成された struct へのポインタを取得できる。

```go
p := &Car{} // has type *Car
```

改行するときは、最後のトレーリングカンマが必須なので注意。

```go
car := Car{
  Name: "bmw",
  Age: 18, // このカンマが無いとエラーになる
}
```

#### 匿名フィールド

フィールド名を省略すると、型名がフィールド名になる。こうしたフィールドを「匿名フィールド」という。

```go
type someStruct struct {
  int // フィールド名は`int`
  uini64 // フィールド名は`uint64`
  *byte // フィールド名は`byte`
}
```

#### 埋め込み

- 子 struct に親 struct を匿名フィールドとして指定することで、親の持つフィールドとメソッドを子で利用可能になる。これを「埋め込み」という。
- 親のフィールドやメソッドを使うときは単に`child.doSomething()`のようにすればよい。ただし、複数の struct を埋め込んで名前が重複したときは、明示的に`child.parentStruct.doSomething()`のように指定する必要がある。
- 埋め込みを使うと、継承に似たことができる。

```go
type parentStruct struct {
  i int
}

func (e parentStruct) doSomething() {
  fmt.Println("hello")
}

type childStruct struct {
  parentStruct
}

func main() {
  var child childStruct
  child.doSomething()  // => "hello"
//child.parentStruct.doSomething()としなくていい！

  fmt.Println(child.i) // => 0
//fmt.Println(child.parentStruct.i)としなくていい！
}
```

### Arrays

- `[n]T`で、長さ n で型が T の配列を作成できる。配列の長さも**型の定義に含まれる**。長さは後から変更できない。
- 配列の作成は配列リテラルを使う。

```go
var a [3]int // 各要素はゼロ値
a[0] = 100
a[1] = 200
a[2] = 300

// 配列リテラル
b := [6]int{} // 各要素はゼロ値
c := [6]int{2, 3, 5, 7, 11, 13}

// ...を使うと、長さが自動で設定される。下記の例だと3になる。
d := [...]int{2, 3, 5}
```

Array 型の変数は、配列全体を表現している。C 言語のように配列の先頭を指すポインタではない。このため、代入を行うと配列全体がコピーされる。

```go
a := [3]int{1, 2, 3}
b := a
b[0] = 999

fmt.Printf("%v", a) // [1 2 3]
fmt.Printf("%v", b) // [999 2 3]
```

### Slices

詳細は[このブログ](https://blog.golang.org/go-slices-usage-and-internals)を参照

- スライスは Array の上に構築されている。Go では配列よりもスライスをよく使う。
- スタートを前にずらすことはできない。後ろにずらすことはできる。
- エンドは、前後にずらすことができる。
- `someArray[1:4]`で、要素 1 から要素 3 までを含むスライスを作成できる

```go
[]T // スライス型
array_or_slice[MIN:MAX] // スライス式
```

```go
array := [6]int{1, 2, 3, 4, 5, 6}

var slice []int // スライス型の変数を容易
slice = array[1:4] // スライス式でスライスを作成して代入

fmt.Println(slice) // => 2,3,4
```

#### Slices are like references

- スライスは配列への参照のようなもの
- スライスはどんなデータも格納しておらず、単に元の配列の一部分を指し示しているだけ
- スライスの要素を変更すると、その元となる配列の対応する要素が変更される
- 同じ元となる配列を共有しているスライスは、お互いの変更が反映される

```go
array := [6]int{1, 2, 3, 4, 5, 6}

slice1 := array[0:3]
slice2 := array[0:3]

slice1[0] = 123

fmt.Println(array)  // => 123, 2, 3, 4, 5, 6
fmt.Println(slice1) // => 123, 2, 3
fmt.Println(slice2) // => 123, 2, 3
```

#### Creating a slice with literals

- いきなりスライスを作成するリテラル
- 長さを指定しない配列リテラルのような書き方をする
- 下記のスライスは、上段の配列と全く同じものを**作成**した上で、その配列を**参照**するスライスを返す。

```go
// array literal
[3]bool{true, false, false}

// slice literal
[]bool{true, false, false}
```

#### Creating a slice with make

- `make(スライス, length, capacity)`関数を使ってスライスを作成することで、動的にサイズ変更できる配列を取得できる。
- 配列の各要素は Zero Values で埋められる

```go
a := make([]int, 5) // [0:5]
// len=5 cap=5 [0 0 0 0 0]

b := make([]int, 1, 5) // [0:1]
// len=1 cap=5 [0]

c := b[:2] // [0:2]
// len=2 cap=5 [0 0]

d := c[2:5] // [2:5]
// len=3 cap=3 [0 0 0]
```

#### Slice default

スライスを作るときの上限・下限の値は省略できる

```go
// 長さが10のArrayがあったとすると、下記はどれも等価
a[0:10]
a[:10]
a[0:]
a[:]
```

#### Slice length and capacity

- スライスの上限・下限はあとから変更できる
- length = スライスが持つ要素の数。`len(s)`で取得する。
- capacity = スライスの最初の要素から数えた、元配列の要素数。`cap(s)`で取得する。

```go
s := []int{2, 3, 5, 7, 11, 13}
// len=6 cap=6 [2 3 5 7 11 13]

s = s[:0]
// len=0 cap=6 []

s = s[:4]
// len=4 cap=6 [2 3 5 7]

s = s[2:]
// len=2 cap=4 [5 7]
```

スライスのスタートを後から遡って変更することはできない。一方、エンドポイントは cap の値まで拡張できる。

```go
a := []int{1, 2, 3, 4, 5}

b := a[2:4]
fmt.Printf("%v", b) // [3 4]

c := b[0:cap(b)]
fmt.Printf("%v", c) // [3 4 5]
```

#### Nil slices

- スライスの Zero Values は`nil`である
- Nil slice は length と capacity が 0 で、元となる配列を持たない

```go
var s []int // s==nil len(s)==0 cap(s)==0
```

#### Slices of slices

スライスはどんな型の値でも格納できる。例えば、スライスでも。

```go
board := [][]string{
  []string{"_", "_", "_"},
  []string{"_", "_", "_"},
  []string{"_", "_", "_"},
}
board[0][0] = "X"
```

#### appending to a slice

- `append()`を使うことで、簡単にスライス（配列）に要素を追加できる
- スライスの背後にある配列の大きさが余っているときは、単に追加される。
- スライスの背後にある配列の大きさが足りなくなったとき：
  - 新しい配列が作成される。このとき、余分に配列の長さが確保される。
  - 古い配列の内容が新しい配列にコピーされる
  - 新しいスライスは新しい配列を指す

```go
s := []int{1,2,3,4} // cap == 4
s = append(s, 5) // cap == 8
s = append(s, 6) // cap == 8
s = append(s, 7) // cap == 8
s = append(s, 8) // cap == 8
s = append(s, 9) // cap == 16

s = append(s,10,11) // 複数追加もできる
s = append(s, another_slice...) // スライスを追加するときは...で展開してから追加
```

#### copy

- スライスをコピーするときは`copy()`をつかう。
- `count`にはコピーした数が入る。

```go
src := []int{1, 2, 3, 4}
dst := []int{5, 6, 7}

count := copy(dst[1:], src)

fmt.Println(count, dst) // => 2   [5 1 2]
```

### Map

- key-value ペア。
- `make()`を使うことでマップを作成することができる。
- `map[T]T`で宣言する

#### 参照型

スライスと同じく、Map も参照型である。ただし、スライスでいうバックエンドの配列に相当するものは用意されておらず、それらに直接アクセスすることはできない。

#### `make()`でつくる

マップは宣言だけでは使えるようにはならない。必ず make で初期化をしてから使う必要がある。

```go
var my_map1 map[string]int
my_map1 = make(map[string]int)

my_map1["hello"] = 123
fmt.Println(my_map1["hello"]) // 123

my_map1["empty"] // => 0  未定義のキーを呼ぶと、ゼロ値が返る
```

#### 存在確認

キーが存在するか確認するときは`ok`を使う。

```go
val, ok := my_map1["new"]
// valがいらないときは
_, ok := my_map1["new"]
```

#### リテラルでつくる

リテラルを使うと、宣言、初期化、代入を一気に行うことができる。

```go
my_map2 := map[string]int{
  "john": 33,
  "jim":  25,
}
fmt.Println(my_map2["jim"])   // 25
```

#### struct を値にする

```go
cars := map[string]Car{
  "bmw": Car{
    "sedan", 2003,
  },
  "hino": Car{
    "truck", 1985,
  },
}

// 型名は省略もできる
cars := map[string]Car{
  "bmw": {
    "sedan", 2003,
  },
  "hino": {
    "truck", 1985,
  },
}
```

#### 要素の削除

```go
delete(my_map, key)
```

#### 要素の取り出し

- `ok`は、要素が存在すれば`true`、なければ`false`になる
- `elem`は、要素が存在すればその要素、なければ Zero Value が入る

```go
elem, ok := my_map[key]
```

### Function Values

関数は値でもある。変数に代入したり、引数や返値として使うこともできる。

```go
func compute(fn func(string)) {
  fn("hello")
}

func main() {
  callback := func(message string) {
    fmt.Println(message)
  }
  compute(callback)
}
```

### Function Closures

JavaScript のクロージャと同じようなことができる。

```go
func adder() func(int) int {
  sum := 0
  return func(x int) int {
    sum += x
    return sum
  }
}

func main() {
  pos, neg := adder(), adder()
  fmt.Println(pos(1), neg(-1)) // 1 -1
  fmt.Println(pos(1), neg(-1)) // 2 -2
  fmt.Println(pos(1), neg(-1)) // 3 -3
}
```

### 参照型

- 下記は参照型である。
  - スライス
  - マップ
  - チャネル
- 関数に受け渡したときにコピーされるコストが、極めて低い。
- 参照を持つため、関数で値を変更すると、呼び出し元の値も変更される。
- 参照型の作成には`make()`が使える

## Methods

- Go ではクラスがない代わりに、型に対してメソッドを定義することができる
- メソッドは、「レシーバ」を引数にとる関数を使って定義する
- レシーバは、`func`と関数名の間に記載する
- 型に紐づくメソッド群を、「メソッドセット」という

### Method Set

型は、型に紐付けられた「メソッドセット」をもつ。

| 変数の型               | メソッドセット                                                                     |
| ---------------------- | ---------------------------------------------------------------------------------- |
| インターフェースの場合 | インターフェースで宣言されているメソッド群                                         |
| 値（`T`）の場合        | Value Receivers(`T`)<br>(型`T`が addressable な場合は、Pointer Receivers(`*T`) も) |
| ポインタ（`*T`）の場合 | Value Receivers(`T`)<br>Pointer Receivers(`*T`)<br>                                |

- TODO: addressable というのがよく分からない。要調査
- [Stack Overflow](https://stackoverflow.com/questions/33587227/golang-method-sets-pointer-vs-value-receiver)
- [Method Sets](https://golang.org/ref/spec#Method_sets)
- [Method Values](https://golang.org/ref/spec#Method_values)

### struct をレシーバで受け取る

```go
type Car struct {
  Brand string
  Model string
}

// `(c Car)` がレシーバ
func (c Car) SayHello() string {
  return "My name is " + c.Brand + " " + c.Model
}

func main() {
  car := Car{"bmw", "3series"}
  fmt.Println(car.SayHello())
}
```

メソッドは単なる関数であることを忘れずに。上記コードは下記と等価である。

```go
func SayHello(c Car) string {
  return "My name is " + c.Brand + " " + c.Model
}

func main() {
  car := Car{"bmw", "3series"}
  fmt.Println(SayHello(car))
}
```

### struct 以外 をレシーバで受け取る

- struct 以外の型にもメソッドを追加できる。
- ただし、型が同一のパッケージ内で定義されている場合に限る
- built-in types(`int`など)に直接メソッドを追加することはできない。あくまでカスタムの型を定義し、その型にメソッドをアタッチすること。

```go
type MyInt int

func (f MyInt) Abs() int {
  if f < 0 {
    return int(-f)
  }
  return int(f)
}

func main() {
  f := MyInt(-123)
  fmt.Println(f.Abs()) // => 123
}
```

### Value Receiver と Pointer Receiver

前述のレシーバは Value Receiver と呼ばれ、値渡しである。メソッドを使って呼び出し元の変数等の値を変更したい場合は、Pointer Receiver を使う。

ポインタレシーバを使う理由は以下の 2 つ

- 呼び出し元の変数の値を変更したいとき
- 呼び出しのたびに変数がコピーされることによるオーバーヘッドを減らしたい時

一般的に、メソッドはレシーバの値を変更するために作られる場合が多いので、Pointer Receiver は Value Receiver よりも、よく使われる。

### レシーバによる自動変換

レシーバでは、呼び出し側が「値」であるか「ポインタ」であるかに関わらず、必ず適切な変数（値かポインタか）を受け取れる。

```go
type MyInt int

// 3. 値から呼び出したにも関わらず、ポインタで受け取れる
//    (なお、valueである`MyInt`からpointer receiverを呼べるのは、
//     MyIntがaddressableであることにより、勝手に(&f).Abs()として扱われるから。)
func (f *MyInt) Abs() {
  if *f < 0 {
    *f = -(*f)
    return
  }
  return
}

func main() {
  f := MyInt(-123) // 1. 変数は値である
  f.Abs() // 2. 値から呼び出している
  fmt.Println(f) // 4. 結果として、この表示結果は`123`になる
}
```

```go
func (f MyInt) Abs() { // 3. ポインタから呼び出したにも関わらず、値で受け取れる
  return sqrt(f*f)
}

func main() {
  p := &MyInt(-123)　// 1. 変数はポインタである
  result := p.Abs() // 2. ポインタから呼び出している
  fmt.Println() // 4. 結果として、この表示結果は`123`になる
}
```

この自動変換があるため、同じ型において、Value Receiver と Pointer Receiver を両方定義すると、エラーになる。
どちらを呼べばいいかわからないから。

## Interfaces

- インターフェースは型の一種である。メソッドの組み合わせで定義される。

```go
var i interface {
  sayHello()
}
```

- 通常は、下記のように名前のついたインターフェース型として宣言してから使う。
- 下記の変数`counter`は、`PlusOne()`というメソッドを持つ変数であれば何でも代入できる。

```go
type Counter interface {
  PlusOne() int
}
var counter Counter
```

下記の`MyInt`型は、`Counter`型が持つべき`PlusOne()`というメソッドを持っている。
このため、`Counter`型の変数に代入できる

```go
type MyInt int

func (f MyInt) PlusOne() int {
  return int(f) + 1
}

func main() {
  var counter Counter
  counter = MyInt(1)
}
```

struct でも考え方は基本的に同じ。下記の`Point`型は、`Counter`型が持つべき`PlusOne()`というメソッドを持っている。このため、`Counter`型の変数に代入できる。

struct の場合、変数が値型かポインタ型かでメソッドの定義方法が異なるので注意する。

```go
type Point struct {
  X, Y int
}
```

```go
// Value Receiver
func (v Point) PlusOne() int {
  return v.X + 1 + v.Y + 1
}

func main() {
  var counter Counter
  // 値型の場合は、Value Receiverにメソッドが実装されていること
  counter = Point{12, 23}
}
```

```go
// Pointer Receiver
func (v *Point) PlusOne() int {
  return v.X + 1 + v.Y + 1
}

func main() {
  var a Counter
  // ポインタ型の場合は、Pointer Receiverにメソッドが実装されていること
  a = &Point{12, 23}
  fmt.Println(a.PlusOne())
}
```

### インターフェースは暗黙に実装される

インターフェースを実装している型を定義したいとき、明示的に何かを行う必要はない。

```go
type Counter interface {
  PlusOne() int
}

type MyInt int

// MyInt型はCounter型を実装していると言えるが、明示的に何も書く必要はない
func (v MyInt) PlusOne() int {
  return int(v) + 1
}

func main() {
  // 明示的に何も書かなくてもGoが自動で判別してくれる（代入が可能）
  var i Counter = MyInt(1)
}
```

### 命名規則

インターフェースが一つしか関数を持たない場合、インターフェース名は「関数名+'er'」とするのが慣習である。

```go
type Reader interface {
  Read()
}
```

### 埋め込み

構造体と同じく、インターフェースも埋め込みを行うことができる。擬似的な継承やミックスインを実現できる。

```go
type Buyer interface {
  Buy()
}
type Seller interface {
  Sell()
}
type Dealer interface {
  Buyer
  Seller
}
```

### インターフェースの持つ値

インターフェースの持つ値は、 **具体的な値と具体的な型** で構成されるタプルと考えられる。（「具体的」＝インターフェースを実装している実際の変数の、の意）

```go

type MyInterface interface {
  SayHello()
}

type MyType struct {
  Content string
}
func (t MyType) SayHello() {
  fmt.Println(t.Content)
}

type MyInt int
func (i MyInt) SayHello() {
  fmt.Println(i)
}

func main() {
  var i1, i2 MyInterface

  i1 = MyType{"hello"}
  i2 = MyInt(123)

  describe(i1) // {hello}, main.MyType
  describe(i2) // 123, main.MyInt

  i1.SayHello() // hello
  i2.SayHello() // 123
}

func describe(i MyInterface) {
  // インターフェースの持つ具体的な値と型を表示
  fmt.Printf("%v, %T\n", i, i)
}
```

### 具体的な値が nil だった場合

インターフェースの背後にある具体的な値が`nil`だった場合は、レシーバにも`nil`が渡される。

```go
type MyInterface interface {
  SayHello()
}

type MyType struct {
  Content string
}

func (t *MyType) SayHello() {
  if t == nil {
    fmt.Println("this is nil")
    return
  }
  fmt.Println(t.Content)
}

func main() {
  var i MyInterface

  // structのポインタはnilになる可能性がある。
  // 一方、structの値はnilになることはない（宣言時に各フィールドがzero valuesにセットされたstructが作成されるため）
  var myType *MyType
  i = myType
  describe(i)  // <nil>, *main.MyType
  i.SayHello() // this is nil
}

func describe(i MyInterface) {
  fmt.Printf("%v, %T\n", i, i)
}
```

### nil interface values

nil である interface は、具体的な値と型を持たないため、メソッドを呼んでもエラーになる。

```go
type I interface {
  M()
}

func main() {
  var i I // value=>nil, type=>nil
  i.M() // runtime error
}
```

### Empty interface

- ひとつもメソッドが定義されていないインターフェースを **empty interface** という。
- empty interface にはどのような値でも代入することができる。
- 型がわからない時に使う（例：`Printf`では値を empty interface で受け取っている）

```go
var i interface{}  // value=>nil, type=>nil
i = 42  // value=>42, type=>int
i = "hello"  // value=>"hello", type=>string

// empty interfaceで受け取るのでどんな値でも受け取れる
func anyExec(any interface{}) {}
```

### Type assertion

- 空インターフェースで受け取った値は元の型の情報が欠落している。このため、型を持つ値として扱うときには変換が必要となる。この変換作業が型アサーションである。下記のようにして使う。
- 変換に失敗した場合は`ok`に`false`が入る。`ok`を省略して変換に失敗した場合はパニックになる。

```go
value, ok := some_var.(some_type)
```

```go
var i interface{} = "hello" // iは型を持たない
s := i.(string) // string 型に変換する
```

具体的には、下記のように条件分岐して使うことが多い。

```go
func printIf(src interface{}) {
    if value, ok := src.(int); ok {
        fmt.Printf("parameter is integer. [value: %d]\n", value)
        return
    }

    if value, ok := src.(string); ok {
        fmt.Printf("parameter is string. [value: %s]\n", value)
        return
    }

    if value, ok := src.([]string); ok {
        fmt.Printf("parameter is slice string. [value: %s]\n", value)
        return
    }

    fmt.Printf("parameter is unknown type. [valueType: %T]\n", src)
}
```

### Type switch

- 手軽に型アサーションを行う方法として、Type Switch（型スイッチ）という文法も用意されている。
- 通常の switch 文と異なるのは、値ではなく **型でケースが分かれる** という点である。

```go
func printSwitch(src interface{}) {
    switch value := src.(type) {
    case int:
        fmt.Printf("parameter is integer. [value: %d]\n", value)
    case string:
        fmt.Printf("parameter is string. [value: %s]\n", value)
    case []string:
        fmt.Printf("parameter is slice string. [value: %s]\n", value)
    default:
        fmt.Printf("parameter is unknown type. [valueType: %T]\n", src)
    }
}
```

### 可変長パラメータにスライスを渡す

スライスの後に`...`をつけることで、値をばらしてから可変長パラメータに値を渡すことができる。

```go
func main() {
  s := []string{"a", "b", "c"}

  test("a", "b", "c")
  // 上記は下記と等価
  test(s...)
}

func test(s ...string) {}
```

### Stringers

- もっとも有名なインターフェースの一つに、`Stringer`がある。これは`fmt`パッケージで定義されている。

```go
type Stringer interface {
    String() string
}
```

- `Stringer`インターフェースは、自身をテキストにして出力する`String()`というメソッドが変数に実装されていることを保証する。つまり、`String()`というメソッドを実装すれば、`Stringer`型になる。
- `fmt`パッケージでは、プリントする際に、変数が`Stringer`型かチェックし、そうであれば`String()`メソッドを使用する。

```go
type Person struct {
    Name string
    Age  int
}

func (p Person) String() string {
    return fmt.Sprintf("%v (%v years)", p.Name, p.Age)
}

func main() {
    a := Person{"Arthur Dent", 42}
    z := Person{"Zaphod Beeblebrox", 9001}
    fmt.Println(a, z) // Arthur Dent (42 years) Zaphod Beeblebrox (9001 years)
}
```

### Errors

- エラーは`error`型で扱われる。これは、ビルトインのインターフェースであり、`Error()`というメソッドを実装していることを保証する。つまり、`Error()`というメソッドを実装すれば`error`型になる。
- なお、`Stringer`型と同じく、`fmt`パッケージは`error`型をプリントする際には`Error()`メソッドを使用する。

```go
type error interface {
    Error() string
}
```

#### 基本的な使い方

```go
i, err := strconv.Atoi("wrong int")
if err != nil {
    fmt.Printf("couldn't convert number: %v\n", err)
    return
}
```

#### error 型をカスタムする

カスタムの error 型を作るには、`Error()`メソッドを変数にバインドしてやればよい。

```go
type MyError struct{}

func (e MyError) Error() string {
  return "something bad happened"
}

// 常にerror型を返すファンクション
func run() error {
  return MyError{}
}

func main() {
  if err := run(); err != nil {
    fmt.Printf("%T", err)
  }
}
```

上記のコードでも問題なく動作するが、`run()`が return する時や、Error()が呼ばれる時に、`MyError`が都度コピーされるという点で効率が悪い。ポインタで受け渡ししてやると、効率が良い。

```go
type MyError struct{}

// 3. *MyErrorで受けたほうが効率が良い
func (e *MyError) Error() string {
  return "something bad happened"
}

func run() error {
  return &MyError{} // 1. ポインタで返してやると効率が良い
}

func main() {
  if err := run(); err != nil {
    // 2. print時には、型MyErrorか、型*MyErrorを受け取るレシーバがよばれる
    fmt.Println(err)
  }
}
```

### Readers

Go の標準ライブラリには、ファイル、ネットワーク、圧縮、暗号化などを扱うためのインターフェースが多く用意されている。

その一例が、`io`パッケージの`io.Reader`というインターフェースである。このインターフェースは、変数が`Read()`というメソッドを持つことを保証する。

```go
func (T) Read(b []byte) (n int, err error)
```

#### Reader の使い方

Read は、指定されたバイトスライスにデータを詰め込み、詰め込んだバイト数とエラー値を返す。ストリームの最後に達した場合は、`io.EOF`というエラーを返す。

```go
reader := strings.NewReader("Hello, Reader!")

myBytes := make([]byte, 8)

for {
  readCount, err := reader.Read(myBytes)
  fmt.Printf("%v  %v  %v %q\n", readCount, err, myBytes, myBytes)
  if err == io.EOF {
    break
  }
}
// 8  <nil>  [72 101 108 108 111 44 32 82] "Hello, R"
// 6  <nil>  [101 97 100 101 114 33 32 82] "eader! R"
// 0  EOF  [101 97 100 101 114 33 32 82] "eader! R"
```

#### `io.Reader` インターフェースの実装

```go
type MyReader struct{}

// 永遠に'A'を返し続けるリーダー
func (m MyReader) Read(b []byte) (i int, e error) {
  for x := range b {
    b[x] = 'A'
  }
  return len(b), nil
}

func main() {
  myReader := MyReader{}
  myBytes := make([]byte, 5)
  myReader.Read(myBytes)

  fmt.Printf("%q", myBytes) // => "AAAAA"
}
```

#### Reader のラッパー

Reader のよくある使い方として、別の io.Reader をラップする io.Reader を用意して、ストリームに手を加えるという方法が挙げられる。

下記の`rot13Reader`は、流れてきた文字列を 13 文字分シフトして下流に流す。

```go
type rot13Reader struct {
  previoursReader io.Reader
}

func (rot rot13Reader) Read(downStreamBytes []byte) (int, error) {
  count, err := rot.previoursReader.Read(downStreamBytes)
  for i := range downStreamBytes {
    downStreamBytes[i] += 13
  }
  return count, err
}

func main() {
  s := strings.NewReader("Lbh penpxrq gur pbqr!")
  r := rot13Reader{s}
  io.Copy(os.Stdout, &r)
}
```

## Panic

### パニックとは

通常、関数内でエラーが発生したときは、`error`インターフェース型の値を返す。しかし、下記の場合は`panic()`を使う。

- 致命的過ぎてリカバリが不要であるとき
- 特定のリカバリ処理を意図的に呼び出したいとき

```go
panic("パニック発生")
```

パニック時でも`defer`した関数は実行される。

### リカバリ

- リカバリは`defer`した関数の中でのみ行うことができる。
- `recover()`を使う。
- `recover()`の返値は:
  - panic が発生していれば`panic()`に渡した引数
  - panic が発生していなければ`nil`

```go
defer func() {
  if err := recover(); err != nil {
    fmt.Println("リカバリ処理")
    fmt.Println(err) // => "パニック発生"
  }
}()
panic("パニック発生")
```

## Concurrency

### Goroutines

- goroutines は、Go ランタイムによって管理される軽量スレッドである。
- `go`句で作成する
- goroutine は別スレッドで実行されるので、呼び出し元は goroutine が return するのを待たずに次行に進む
- 先に`main()`が終了すると、全ての goroutine もろとも終了するので注意

```go
func say(s string) {
  for i := 0; i < 5; i++ {
    time.Sleep(100 * time.Millisecond)
    fmt.Println(s)
  }
}

func main() {
  go say("world")
  say("hello")
}

// `go`ありだと↓
// world
// hello
// hello
// world
// world
// hello
// hello
// world
// hello

// `go`なしだと↓
// world
// world
// world
// world
// world
// hello
// hello
// hello
// hello
// hello
```

### Channels

チャンネルとは：

- 複数の goroutines の間でデータをやり取りするための、データの通り道である
- 型を持つ
- `<-`(チャンネルオペレータ)で値を送受信できる。

```go
ch <- someInput    // チャンネルchに値を送信する
someOutput := <-ch  // チャンネルchから値を受信する
```

#### チャンネルの初期化

マップやスライスと同じように、使う前に初期化が必要である。

```go
ch := make(chan int)

// 又は
var ch chan int // ch == nil
ch = make(chan int)
```

#### チャンネルの型

```go
var ch1 chan int  // 送受信可能の型
var ch2 chan<- int // 送信専用の型　主に引数の型に使う
var ch3 <-chan int // 受信専用の型　主に引数の型に使う
```

#### ブロック

デフォルトでは、データの送受信は、送信側と受信側の **双方が準備完了するまでブロック（その行で実行が一時停止）** される。これにより、明示的なロックや条件変数がなくても、同期的な実行が可能になる。

```go
func calc(c chan int) {
  c <- 12345 // チャンネルにデータを送信する
}

func main() {
  // int型のチャンネルを作る
  c := make(chan int)

  // goroutineを走らせる
  go calc(c)
  go calc(c)

  // チャンネルからデータを受信する
  answer1, answer2 := <-c, <-c
}
```

#### Buffered Channels

- チャンネルはバッファできる。
- バッファ付きのチャンネルを作成するには、`make`の第二引数にサイズを指定する。
- チャンネルをバッファすると：
  - バッファがフルのときのみ、送信がブロックされる。
  - バッファが空のときのみ、受信がブロックされる。

```go
func main() {
  ch := make(chan int, 2)

  // goroutine（別スレッド）ではないため、
  // 通常であれば次行でデッドロック状態になるが、
  // バッファがあるので問題なく処理を続行できる
  ch <- 1
  ch <- 2
  ch <- 3 // ここで、チャンネルがフルになるのでパニックになる
}
```

バッファリングされている要素数を取得したいときは`len(ch)`、キャパシティを取得したいときは`cap(ch)`を使う。

#### Semaphore

セマフォ＝並列処理におけるリソースへの同時アクセスを制御する仕組み

```go
// 同時実行数を管理するチャンネル（バッファ数＝同時実行可能数）
semaphore := make(chan string, 3)

// 結果を保持するチャンネル
results := make(chan int)

for i := 0; i < goroutine; i++ {
  go func() {
    // 実行開始時にセマフォにデータを入れる
    // 同時実行可能数を超えると、空きが出るまでここでブロックされる
    semaphore <- "i'm working"

    // 0-3秒まち
    time.Sleep(time.Duration(rand.Float64()*3) * time.Second)

    // 結果を送信
    results <- 12345

    // セマフォからデータを取り除いて空きを作る
    <-semaphore
  }()
}

for i := 0; i < goroutine; i++ {
  fmt.Println(<-results)
}
```

#### Range and Close

- 送信側からのみ、チャンネルを`close`できる。受信側で行うと panic になる。
- クローズされると`v, ok := <-ch`の`ok`に`false`が入る。
- `for v := range ch`で、チャンネルからの値がなくなるまで、連続して受け取ることができる。
- ファイルを扱うときと異なり、チャンネルはクローズしなくてもいい。クローズが必要なのは、値の終わりを受信側に伝える必要があるときだけ。（例えば受信側で`range`を使っている場合など）

```go
func stepIntegers(chBufferSize int, ch chan int) {
  for i := 0; i < chBufferSize; i++ {
    ch <- i
  }
  close(ch)
}

func main() {
  ch := make(chan int, 10)
  go stepIntegers(cap(ch), ch)
  for v := range ch {
    fmt.Println(v)
  }
  // => 0 1 2 3 4 5 6 7 8 9
}
```

#### Select

- どれかのチャンネルから値をゲットできるまで待つ
- 複数ゲットできた場合はランダムに選ぶ

```go
ch1 := make(chan int)
ch2 := make(chan int, 10)

go func() {
  for i := 0; i < 10; i++ {
    ch1 <- i
  }
  ch2 <- 999
}()

for {
  select {
  case v := <-ch1:
    fmt.Println(v)
  case v := <-ch2:
    fmt.Println(v)
    return
  }
}
```

- 上記の`ch1`はバッファがないため、受信側がデータを受信するまでは、実行が停止する。
- よって、結果は`0 1 2 3 4 5 6 7 8 9 999`になる。

```go
ch1 := make(chan int, 10)
```

- もし ch1 を上記のようにバッファにすると、（スレッドの実行状況にもよるものの、基本的には）受信側の出現を待たずに goroutine の処理が完了する。
- よって、結果は`0 1 2 999`のようになる。（これは、`select`の実行時にはすでに`ch1`,`ch2`のどちらにもデータが有るため、`select`によりランダムに選ばれ、`ch2`を引いた瞬間に処理が終了するためである）

#### Default selection

`select`の中に`default`句を設置すると、他のケースに当てはまらなかったときに実行される。

```go
tick := time.Tick(100 * time.Millisecond)
boom := time.After(500 * time.Millisecond)
for {
  select {
  case <-tick:
    fmt.Println("tick.")
  case <-boom:
    fmt.Println("BOOM!")
    return
  default:
    fmt.Println("    .")
    time.Sleep(50 * time.Millisecond)
  }
}

//     .
//     .
// tick.
//     .
//     .
// tick.
//     .
//     .
// tick.
//     .
//     .
// tick.
//     .
//     .
// tick.
// BOOM!
```

### Mutex

単に goroutine が同時に同じ値にアクセスしない（mutual exclution）ようにしたい場合は、`sync.Mutex`を使うと良い。

```go
// 複数のgoroutineで共有する構造体
type SafeCounter struct {
  v   int
  mux sync.Mutex
}

func (c *SafeCounter) Inc() {
  // すでにロックされていればここでコードがブロックされる
  c.mux.Lock()
  // ロック中なので、一度に一つのgoroutineしかアクセスできない
  c.v++
  // アンロックする
  c.mux.Unlock()
}

func (c *SafeCounter) Value() int {
  // すでにロックされていればここでコードがブロックされる
  c.mux.Lock()

  // return後にアンロックする
  defer c.mux.Unlock()

  // ロック中なので、一度に一つのgoroutineしかアクセスできない
  return c.v
}

func main() {
  c := SafeCounter{}
  for i := 0; i < 1000; i++ {
    go c.Inc()
  }

  time.Sleep(time.Second)
  fmt.Println(c.Value()) // => 1000
}
```
