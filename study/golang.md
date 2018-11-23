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

```go
var a int     // => 0
var b float64 // => 0
var c bool    // => false
var d string  // => ""
```
