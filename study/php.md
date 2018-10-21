# PHP

[[toc]]

## 基本事項

コマンドラインで php ファイルを実行

```bash
php test.php
```

デバッグ用出力

```php
print_r(); // 簡易
var_dump(); // 詳細
```

## Basic Syntax

- `<?php`ではじめて、`?>`で終わる。終わりのタグは、可能であれば省略する。
- 命令文の最後には`;`が必ず必要。ただし終了タグの直前においては省略も可能。

```php
// echoのショートハンド
<?php echo 'hello world' ?>.
<?= 'hello world' ?>

// 条件分岐
<?php if ($expression == true): ?>
  This will show if the expression is true.
<?php else: ?>
  Otherwise this will show.
<?php endif; ?>

// comment1
# comment2
/*
* comment3
*/
```

## Types

### 概要

- scalar(数学) types
  - boolean
  - integer
  - float(=double)
  - string
- compound types
  - array
  - object
  - callable
  - iterable
- special types
  - resources
  - NULL
- pseudo types
  - mixed
  - number
  - callback
  - array|object
  - void

#### Type の確認方法

- `var_dump(123)` タイプと値をコンソール出力する
- `gettype(123)`　タイプを文字列として取得する（デバッグ用）
- `is_type(123)`　その型かどうかを**判定**したいときにつかう

```php
var_dump(123); // => int(123)
echo gettype(1); // => integer

if (is_int(1)) {};
if (is_string('a')) {};
```

### boolean

真偽値。case-insensitive である。

```php
if ($action == "show_version") {}

$is_valid = true;
if ($is_valid) {}
```

#### echo

boolean を echo すると、true は 1 を出力し、false は何も出力しない。

#### キャスト

キャストしたいときは`(bool)`を使う。他のタイプでも同じだが、殆どの場合で自動キャストされるので、使うことはほぼない。

```php
var_dump((bool) '1');
```

#### FALSE として判定されるもの

- FALSE
- 0(integer)
- 0.0(float)
- 空文字列及び"0"(string)
- 長さのない array
- NULL

#### TRUE として判定されるもの

- 上記以外のすべて（resource と NAN を含む）

### Integer

整数。

```php
$a = 1234; // 10進数　正の整数
$a = -123; // 10進数　負の整数
$a = 0123; // 8進数
$a = 0x1A; // 16進数
$a = 0b11111111; // 2進数
```

#### float への変換

計算結果が integer の範囲を超える場合は自動的に float が返される。

```php
$large_number = 2147483647;
var_dump($large_number); // int(2147483647)

$large_number = 2147483648;
var_dump($large_number); // float(2147483648)

$million = 1000000;
$large_number = 50000 * $million;
var_dump($large_number); // float(50000000000)
```

計算結果が小数になる場合も float が返される。なお、`round()`は四捨五入、`(int)`は 0 に近い方に切り捨てる。

```php
var_dump(25/7);         // float(3.5714285714286)
var_dump((int) (25/7)); // int(3)
var_dump(round(25/7));  // float(4)
```

#### int への cast

- boolean
  - true は 1
  - false は 0
- float
  - 0 に近い方にまるめられる
- string

  ```php
  echo (int) "10.5"; // 10
  echo (int) "-1.3e3"; // -1300
  echo (int) "bob-1.3e3"; // 0
  echo (int) "bob3"; // 0
  echo (int) "10 Small Pigs"; // 10
  echo (int) "10.2 Little Piggies"; // 10
  echo (int) "10.0 pigs "; // 10
  echo (int) "10.0 pigs "; // 10
  ```

### Float

float = double = real numbers

```php
$a = 1.234;
$b = 1.2e3;
$c = 7E-10;
```

#### float へのキャスト

- string

  ```php
  echo (float) "10.5"; // 10.5
  echo (float) "-1.3e3"; // -1300
  echo (float) "bob-1.3e3"; // 0
  echo (float) "bob3"; // 0
  echo (float) "10 Small Pigs"; // 10
  echo (float) "10.2 Little Piggies"; // 10.2
  echo (float) "10.0 pigs "; // 10(float)
  echo (float) "10.0 pigs "; // 10(float)
  ```

### String

文字列には４種類の記法がある。

- single quoted
- double quoted
- heredoc syntax
- nowdoc syntax

#### single quoted

- 複数行に渡って書ける
- `'`を出力する時のみエスケープが必要
- 制御文字は使えない
- 変数は展開されない
- 基本的にそのまま文字列として出力される

```php
// 複数行書ける
echo 'You can also have embedded newlines in
strings this way as it is
okay to do';

// 'を出力するには\でエスケープ
echo 'Arnold once said: "I\'ll be back"';

// 下記はただの文字列として出力される
echo '$some_val with \r newline';
```

#### double quoted

- 複数行に渡って書ける
- `\`を使って制御文字を出力できる
- 変数は展開される

```php
echo "$some_val with \r newline
and multiline
is ok";
```

#### Nowdoc

- single quote の別の書き方。
- 中身は評価されない
- `'EOT'`の部分をシングルクオートで囲むこと。名前は任意に書き換えて OK。

```php
echo <<<'EOT'
My name is "$name". I am printing some $foo->foo.
Now, I am printing some {$foo->bar[1]}.
This should not print a capital 'A': \x41
EOT;
```

#### Heredoc

- double quote の別の書き方。
- 中身が評価される
- `EOT`の部分をダブルクオートで囲むか、もしくは囲まないこと。名前は任意に書き換えて OK。

```php
$a = 'John';
$str = <<<EOT
my name is $a \r Doe
EOT;
```

#### 変数のパース - simple syntax

double quoted 等の中において変数をパースする方法は、simple と complex の 2 種類がある。

```php
echo "my name is $myname. nice to meet you";
echo "my name is ${myname}. nice to meet you";
echo "$people->john drank some $juices[0] juice.".PHP_EOL;
```

#### 変数のパース - complex syntax

TODO: 要調査

```php
echo "This is {$great}";
echo "This square is {$square->width}00;
```

#### ブラケットによるアクセス

文字列の特定の場所にアクセスしたいときはブラケット`[]`もしくは braces`{}`を使う。2 文字以上を操作したいときは、`substr()`or`substr_replace()`を使う。UTF に対応していないので実際は使い物にならない。

```php
'string'[0]; // => 's'
'string'[-2]; // => 'n'
```

#### 結合

文字列は`.`で結合できる。

```php
echo "my name "."is"." android";
```

#### String への Cast

`(string)`or`strval()`で文字列にキャストできる。`echo`や`print`function では自動的にキャストが行われる。

array, object, resources はそのままキャストしても意味がないので、`print_r()`や`var_dump()`を使うこと。

- boolean
  - true は"1"に、false は""になる
- integer, float
  - そのまま文字列になる
- array
  - "Array"という文字列になる
  - echo などしたいときは`[]`で中の要素を取り出して表示すること
- object
  - `__toString`に実装されている値になる
- resouces
  - "Resource id #1"のような文字列になる。数字の部分は一意のリソースナンバーを指す。
- NULL
  - ""になる

php で使うほとんどの値は`serialize()`を使うことで string に変換できる。

### Arrays

PHP の Array は、実際は Ordered Map(key-value ペア) である。下記のような用途に使うことができる。

- array
- list(vector)
- hash table
- dictionary
- collection
- stack
- queue

#### `array()`による作成

- キーには integer 又は string を使うことができる
- value にはあらゆる値を格納できる

```php
print_r(array(123, 456));
// => Array ( [0] => 123 [1] => 456 )

print_r(array(
    "foo" => "bar",
    "bar" => "foo", // trailing commaが使える
));
print_r([ // PHP 5.4以降では[]も使える
    "foo" => "bar",
    "bar" => "foo",
]);
// => Array ( [foo] => bar [bar] => foo )
```

- キー名は、次のルールによりキャストされる
  - Valid な 10 進数を含む String は integer に
  - float は trunc された integer に
  - boolean は integer に
  - null は""(empty string)に
- なお、array と object は key として使用することはできない
- キーを省略すると、Auto Increment な integer が順に振られる。この際、その配列において過去に一度でも使われた数字は、すでに配列から消去されている場合でも、再利用はされない。

```php
$array = array(
         "a",
         "b",
    6 => "c",
         "d",
);
/*
array(4) {
  [0]=>
  string(1) "a"
  [1]=>
  string(1) "b"
  [6]=>
  string(1) "c"
  [7]=>
  string(1) "d"
}
*/
```

- 要素へのアクセスは`[]`or`{}`をつかう。なお、この 2 つの記法は全く等価である。

```php
var_dump($array["foo"]);
var_dump($array[42]);
var_dump($array["multi"]["dimensional"]["array"]);
```

#### `[]`による作成・変更

- `[]`で特定の要素を作成、取得、変更できる
- もし`$arr`が存在しなかった場合は作成される（Array 作成の方法としては非推奨）
- Key を省略した場合は、Auto Increment な数値が自動で振られる。

```php
$arr[] = 56;
$arr["x"] = 42;
// Array([0] => 56, [x] => 42)
```

#### Array に関連した便利なファンクション

[Array Function の一覧](http://php.net/manual/en/ref.array.php)

- `unset($arr)`, `unset($arr[key])` 要素又は配列を削除する。reindex は行わない。

  ```php
  $arr = array(5 => 1, 12 => 2);

  $arr[] = 56;    // $arr[13] = 56;
  $arr["x"] = 42;
  unset($arr[5]); // This removes the element from the array
  unset($arr);    // This deletes the whole array
  ```

- `array_values($arr)` reindex した配列を返す
- `foreach ($array as $value) {}`
- `foreach ($array as $key => $value) {}`
- `count($arr)`
- `sort($arr)`

#### String へのキャスト時の注意

key のタイプによってキャスト時の作法が変わる

```php
// Keyが変数のとき
echo "$array[$i]"; // ""で囲む

// KeyがStringのとき
echo "{$array['test']}"; // complex-syntaxを使う
echo $array['test'];　// 又は""の外に出して、`.`でconcatして対応する
```

#### Array へのキャスト

- `(array) someval`で Array にキャストできる。
- int, fload, string, boolean, resource の場合、`array(someVal)`したのと同じことになる。つまり、長さ 1 の配列に、someVal が格納される。

  ```php
  print_r((array) 123); // => Array([0]=>123)
  ```

- NULL の場合、長さが 0 の配列になる。
- object の場合は要調査　 TODO

#### 配列の比較

`array_diff($arr1, $arr2)`により、$arr1 に存在し、$arr2 に存在しない要素を抽出できる。

```php
$array1 = array("a" => "green", "red", "blue", "red");
$array2 = array("b" => "green", "yellow", "red");
$result = array_diff($array1, $array2);
// => Array([1] => blue)
```

#### ループ処理で内容を書き換え

- forEach において参照渡し(`&`)を使うことで、元の値を書き換えることができる。
- JS と異なり、下記で言う`$color`は forEach の外側でも生きている（マジか）。

```php
$colors = array('red', 'blue', 'green', 'yellow');
foreach ($colors as &$color) {
    $color = strtoupper($color); // 大文字に変換
}
unset($color); // ここでもまだ$colorは生きているのでクリアしておく
```

#### 参照渡しと値渡し

Array の場合、デフォルトは値渡しになる。参照渡しにしたい場合は`&`を付与する。

```php
$arr1 = array(2, 3);
$arr2 = $arr1;
$arr2[] = 4; // arr1は変更されていない
$arr3 = &$arr1;
$arr3[] = 4; // arr1は変更されている
```

### Iterables

PHP 7.1 以降で使える疑似タイプ。下記を受け付ける。foraech することができる。

- array
- Traversable interface を備えた Object

```php
function arr(): iterable
{
    return [1, 2, 3];
}
function gen(): iterable
{
    yield 1;
    yield 2;
    yield 3;
}

foreach (arr() as $value) {}
foreach (gen() as $value) {}
```

### Objects

object = クラスインスタンスのこと。

```php
class Dog
{
    public function bark()
    {
        echo "bow!";
    }
}

$dog = new Dog;
$dog->bark();
```

#### object へのキャスト

- object へキャストした場合は、`stdClass`というビルトインクラスを基にしたインスタンスが作成される。
- NULL はプロパティを持たないインスタンスに変換される

  ```php
  var_dump((object) null);
  /*
  object(stdClass)#1 (0) {}
  */
  ```

- Array は、key-value がそのまま property-value に変換される。

  ```php
  $arr = [
      "name" => "john",
      "age" => 33,
  ];
  var_dump((object) $arr);
  /*
  object(stdClass)#1 (2) {
    ["name"]=> string(4) "john"
    ["age"]=> int(33)
  }
  */
  ```

- int や string など、scalar な値は、`scalar`というプロパティに格納される。

  ```php
  var_dump((object) 123);
  /*
  object(stdClass)#1 (1) {
    ["scalar"]=> int(123)
  }
  */
  ```

### Resources

- 外部への参照を持つ、特別な値。
- 作成や使用の際は、[特別なファンクション](http://php.net/manual/en/resource.php)を使う。
- メモリの開放は自動で行われる。ただし、データベースへのコネクションだけは[別である](http://php.net/manual/en/features.persistent-connections.php)。

### null

変数が値を持っていないことを示す。

- null を明示的にセットした変数
- まだ一度も値がセットされていない変数
- unset()された Key 又は Array

#### null へのキャスト

昔は`(unset)`が使えたが、今は強く非推奨。

### Callbacks / Callables

`call_user_func()` or `usort()`など、いくつかのファンクションは、コールバックを受け取ることができる。

#### シンプルな関数をコールバックに指定

```php
function myCallbackFunction($text = "")
{
    echo 'hello world!'.$text;
}
call_user_func('myCallbackFunction');
call_user_func('myCallbackFunction','hello2');
```

#### クラスメソッド、インスタンスメソッドをコールバックに指定

注意：JS と異なり、PHP ではクラスメソッドをインスタンスからも呼ぶことができる。

```php
// An example callback method
class MyClass
{
    public static function myCallbackMethod()
    {
        echo 'Hello World!';
    }
}

// Static class method call
call_user_func('MyClass::myCallbackMethod');
call_user_func(array('MyClass', 'myCallbackMethod')); // old fasion

// Object(instance) method call
$obj = new MyClass();
call_user_func(array($obj, 'myCallbackMethod'));
```

#### 親クラスのメソッドをコールバックに指定

```php
class MyChildClass extends MyClass
{
    public static function myCallbackMethod()
    {
        echo "some message";
    }
}

call_user_func(array('MyChildClass', 'parent::myCallbackMethod')); // => Hello World!
```

#### `__invoke`を実装しているクラスのインスタンスをコールバックに指定

```php
class MyInvokableClass
{
    public function __invoke($name)
    {
        echo 'Hello ', $name, "\n";
    }
}

$c = new MyInvokableClass();
call_user_func($c, 'PHP!');
```

#### Closure

こういうのをクロージャーというらしい。

```php
// closure
$double = function ($a) {
    return $a * 2;
};
$new_numbers = array_map($double, [1,2,3,4,5]);
// => 2,4,6,8,10
```

### Pseudo-types

PHP のドキュメントにおいて、説明の便宜上、定義しているタイプのこと。引数のタイプや値を正しく説明するための架空のものであり、実際の PHP のプリミティブタイプとして存在するわけではない。

#### mixed

いくつかのタイプを受け取る事ができるタイプ。例）`gettype()`

#### number

integer + float

#### callback

callable のこと。callable が登場する以前は callback が擬似タイプとして存在していた。

#### array|object

array もしくは object

#### void

何もリターンしない、何も引数として受け付けない、というタイプ。PHP7.1 以降ではリターンタイプとして使える。

### 型の相互変換

#### 自動変換

PHP の方は、文脈によって自動的に決定される。例えば乗算演算子では、下記のように型が自動変換される。

| オペランドのいずれかが | オペランドの評価 | 結果    |
| ---------------------- | ---------------- | ------- |
| float を含む           | すべて float     | float   |
| float を含まない       | すべて integer   | integer |

#### キャストの種類

- (int), (integer) - 整数へのキャスト
- (bool), (boolean) - 論理値へのキャスト
- (float), (double), (real) - float へのキャスト
- (string) - 文字列へのキャスト
- (array) - 配列へのキャスト
- (object) - オブジェクトへのキャスト
- (binary) - バイナリへのキャスト
- (unset) - NULL へのキャスト (強く非推奨)

## Variables

### Basics

- 命名規則 →`\$[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*`
- 値の代入

  - デフォルトは値渡し
  - 参照渡ししたい場合は、代入する値に`&`を使う。この場合、代入された側はただのエイリアスになる。
  - `&`をつけることができる対象は、名前付き変数のみ(`&(1+2)`などは無効)

  ```php
  $a = 1;
  $b = $a;
  $b = 2;
  var_dump($a); // => 2
  ```

### Predefined Variables

PHP には多くの[定義済み変数](http://php.net/manual/en/reserved.variables.php)がある。特に、Superglobals と呼ばれる下記のものは、プログラムのどこからでも、なんの手続きもせずに使用することができる。

- `$GLOBALS`
- `$_SERVER`
- `$_GET`
- `$_POST`
- `$_FILES`
- `$_COOKIE`
- `$_SESSION`
- `$_REQUEST`
- `$_ENV`

### Scope

変数のスコープは、定義されているファイル内にとどまる。

#### Include

ただし、下記のように他のファイルを Include した場合、Include した場所に、`other.php`を差し込んだようなイメージになる。

- `$a`は、`other.php`内で使用可能
- `other.php`内の変数・メソッドは、取り込み主で使用可能。スコープは、`include`文が存在している場所によって決まる。詳細は[こちら](http://php.net/manual/ja/function.include.php)。

```php
$a = 1;
include 'other.php';
```

#### グローバル変数とローカル変数

ファンクションの中からアクセスできるのはローカル変数のみ。グローバル変数にアクセスする方法は後述。

```php
$a = 1; // グローバル
function test()
{
    echo $a; // ローカル変数を参照しているので、グローバルにはアクセスできない。
}
```

#### `global` キーワードを使ってグローバルにアクセス

```php
$a = 1;

function Sum()
{
    global $a;
    echo $a; // グローバルにアクセスできる
}
```

#### `$GLOBALS` を使ってグローバルにアクセス

```php
$a = 1;

function Sum()
{
    echo $GLOBALS['a'];
}
```

#### static 変数

static 変数を使うと、ファンクションの終了後も値を保持しておくことができる。

```php
function test()
{
    static $a = 0;
    echo $a;
    $a++;
}
test(); // 0
test(); // 1
test(); // 2
```

static 変数を使って再帰処理を書くとこんな感じ。ちょっと筋が悪そう。

```php
function test()
{
    static $count = 0;

    $count++;
    echo $count;
    if ($count < 10) {
        test();
    }
}
```

#### References with global and static variables

TODO: 意味不明

### Variable Variables

動的に指定できる変数名のこと。

```php
$a = 'hello';
$$a = 'world';

echo "$a $hello"; // hello owrld
echo "$a ${$a}"; // hello world
```

配列で使う場合は、あいまいさを`{}`で解消する必要があるので注意。

```php
$$a[1] // invalid as it's ambiguous
${$a[1]} // ok
${$a}[1] // ok
```

クラスのプロパティに動的にアクセスしたいときは、変数や、`{}`を使うことができる。

```php
class foo
{
    public $bar = 'I am bar.';
    public $r = 'I am r.';
}
$foo = new foo();
$name = 'bar';
$names = array('foo', 'bar');

echo $foo->$name . "\n"; // I am bar.
echo $foo->{$names[1]} . "\n"; // I am bar.
echo $foo->{'b' . 'ar'} . "\n"; // I am bar.
echo $foo->{'arr'[1]} . "\n"; // I am r.
```

### Variables From External Sources

#### フォームで送られてきた値の取得

使うことはなさそう。必要になったら[学習](http://php.net/manual/en/language.variables.external.php)する。

```php
$_POST['username']; // POSTのbodyのみ取得
$_REQUEST['username']; // POSTのbodyと、Queryも取得
```

#### Cookies

- `setcookie()`で値をセット
- `$_COOKIE`で値を取得

```php
// 下記のように配列「風」にしておけば、取り出す際に自動で配列にしてくれる
setcookie('mycookie[0]', 'mydata-1');
setcookie('mycookie[1]', 'mydata-2');

var_dump($_COOKIE);
```

#### ドットの扱い

外部から取得したデータの変数名（Key など）にドットが含まれている場合、PHP では変数名にドットが使えないので、自動的に`_`に変換される。

## Constants

### Basics

- scalar と array を値に設定できる。resource は使うな。
- 変更できない
- case-sensitive
- 慣例として名前はすべて大文字にする。 命名規則 => `[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*`

### Syntax

#### 変数との違い

- `$`が頭につかない
- 変数のスコープとは関係ない。どこでも宣言でき、どこからでもアクセスできる。
- 値を変更できない

#### 宣言方法

- `const`を使う方法と`define()`を使う方法がある。
- `const`の場合はコンパイル時に定義されるため、トップレベルのスコープでのみ使用できる。
- ファンクションやループの中で動的に定義したい場合は`define()`を使うこと。
- `get_defined_constants()`で定義済み定数の一覧を Array で取得できる

```php
const CONSTANT = 'Hello World';
define("CONSTANT", "Hello world");

const ANIMALS = array('dog', 'cat', 'bird');
define('ANIMALS', array(
  'dog',
  'cat',
  'bird'
));
```

### Magic constants

定義済みの定数。コンパイル時に定義される。詳細は[こちら](http://php.net/manual/en/language.constants.predefined.php)。

- `__LINE__`
- `__FILE__`
- `__DIR__`
- `__FUNCTION__`
- `__CLASS__`
- `__TRAIT__`
- `__METHOD__`
- `__NAMESPACE__`
- `ClassName::class`

## Expressions

PHP では、すべてが Expressions であり、評価の対象である。

### Expressions とは？

プリミティブな値を表しているもののこと？

```php
$a = 5
// 5は、integerの5を表すExpressionである
// 代入後は、$aも、int(5)を表すExpressionになる
// さらに、代入後は、'$a = 5'自体も、int(5)を表すExpressionになる

// <= 下記も全部Expression
someFunc()
i++
1 > 5
a += 5
```

### Statement とは？

`何らかのexpression;`が Statement である。

```php
$b = $a = 5;
// '$b = $a = 5;'がStatement
/// $b, $a, 5, '$a=5' などはExpression
```

## Operators

### Precedence

- オペレータの優先順位によって、計算順が決まる
- 計算順が同じ場合は、Associativity(left or right)により、計算順が決まる。
- Associativity が non-associative なオペレータを 2 つ以上つなげることはできない

詳細は[こちら](http://php.net/manual/en/language.operators.precedence.php)

#### 落とし穴

`and/or` は `=` よりも優先度が低い。`||/&&`は`=`よりも優先度が高い。このため、下記のような事故がおこりがち。

```php
$bool = true && false;
var_dump($bool); // false, that's expected

$bool = true and false;
var_dump($bool); // true, ouch!
```
