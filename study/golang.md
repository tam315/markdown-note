# Golang

[[toc]]

## Packages, Valiables and Functions

### Packages

- Go のプログラムはパッケージで成り立っている
- `main`パッケージからプログラムが始まる
- パッケージ名はインポートパスの最後の要素と同じ名前である(`math/rand`なら`rand`)

### Imports

```go
// bad
import "fmt"
import "math"

// good (factored import)
import (
  "fmt"
  "math"
)
```

### Exported names

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

### Multiple results

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

### Named return values

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

### Initializers

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

### Short variable declarations

- **ファンクションの中であれば**、`:=`を使うことで`var`を省略できる。
- ファンクションの外では、すべての Statement は`var`,`func`,`import`などのキーワードから始まる必要があるため、省略形は使えない。

```go
func someFunc() {
  a, b, c := 1, true, "no!"
  fmt.Println(a, b, c) // => 1 true "no!"
}
```

### Basic types

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

### Zero values

明示的に初期値を設定しない限り、変数には「Zero Values」がセットされる

- 数値なら `0`
- boolean なら `false`
- 文字列なら`""`(空文字列)
- ポインタなら`nil`
- スライスなら`nil`

```go
var a int     // => 0
var b float64 // => 0
var c bool    // => false
var d string  // => ""
```

### Type conversions

`Type(value)`の形で型変換を行える。

```go
var i float64 = float64(123)
j := uint(456)
```

### Type inference

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
const Pi = 3.14
const (
  A = 123
  B = "hello"
)
```

### Numeric Constants

- 数値定数は untyped（型を持たない）にできる
- untyped な数値定数は高精度である
- untyped な数値定数は、実行時の文脈で型が決まる

```go
const Big = 1 << 100

func needFloat(x float64) float64 { return x * 0.1 }

func main() {
  fmt.Println(needFloat(Big)) // ここで初めて型が決まる(float64)
}
```

## Flow control statements

### for

- 3 つの要素
  - init statement：初回のみ実行
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

### if

- `()`は不要
- statement を記載することができる。ここで定義した変数は if の中でのみ有効。

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

- statement を記載することができる。ここで定義した変数は switch の中でのみ有効。
- 上から順に評価され、最初に当てはまった１つのケースだけ実行される。`break`は不要。

```go
switch a := 1; a {
case 1:
  fmt.Println("number is one")
case 2:
  fmt.Println("number is two")
}
```

条件式を省略することで、`if-elseif-else`を簡略に書くことができる

```go
switch a := 1; {
case a == 1:
  fmt.Println("number is one")
case a == 2:
  fmt.Println("number is two")
default:
  fmt.Println("number is unknown")
}

b := 1
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

ポインタ＝「変数のメモリアドレス」を保持する変数

`*タイプ`でポインタを宣言できる

```go
var pointer *int
```

`&変数名`で「変数のメモリアドレス」を取得できる

```go
i := 123
pointer = &i
```

`*ポインタ名`で「変数のメモリアドレス」の中身を参照できる。これを、dereferencing(値参照) や indirecting(遠回し？)という。

```go
fmt.Println(*pointer) // => 123
*pointer = 456
fmt.Println(*pointer) // => 456
```

### Structs

`struct`は、複数フィールドから作成される型である。

```go
type Vertex struct {
  X int
  Y int
}

func main() {
  fmt.Println(Vertex{1, 2})
} // => {1 2}
```

struct の値にはドットでアクセスできる。

```go
type Vertex struct {
  X int
  Y int
}

func main() {
  v := Vertex{1, 2}
  v.X = 4
  fmt.Println(v) // => {4 2}
}
```

#### Pointers to structs

struct のポインタは、`*(pointer).X`としなくても、`pointer.X`で値を参照できる。

```go
type Vertex struct {
  X int
  Y int
}

func main() {
  var v Vertex
  var pointer *Vertex

  v = Vertex{1, 2}
  pointer = &v
  pointer.X = 123
  fmt.Println(v) // => {123 2}
}
```

#### Struct Literals

全てのフィールド値を順番に記述する方法

```go
v = Vertex{1, 2}
```

`name: value`構文を使って、一部の値だけを記述する方法（指定しなかったフィールドには zero values が設定される）

```go
v := Vertex{X: 1}  // Y:0 is implicitly
v := Vertex{}      // X:0 and Y:0 implicitly
```

`&`を頭につけると、作成された struct へのポインタを取得できる。

```go
p := &Vertex{1, 2} // has type *Vertex
```

### Arrays

`[n]T`で、長さ n で型が T の配列を作成できる。配列の長さは**型の一部**であり、変更できない。

```go
var a [3]int
a[0] = 100
a[1] = 200
a[2] = 300

b := [6]int{2, 3, 5, 7, 11, 13}
```

Array の変数は配列全体を指す。C 言語のように配列の先頭を指すポインタではない。このため、代入を行うと配列全体がコピーされる。

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
- `[]T`で型が T のスライスを宣言できる
- `someArray[1:4]`で、要素 1 から要素 3 までを含むスライスを作成できる

```go
array := [6]int{1, 2, 3, 4, 5, 6}
slice := array[1:4]

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
// 長さが11のArrayがあったとすると、下記はどれも等価
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
- スライスの背後にある配列の大きさが足りなくなったとき
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
```
