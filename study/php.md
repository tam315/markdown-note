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

boolean を echo (文字列に Cast)すると、true は 1 を出力し、false は何も出力しない。

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

double quoted 等の中において変数をパースする方法は、simple と complex の 2 種類がある。simple-syntax では、`$`を使う。変数名の区切りをはっきりさせる必要があるときは変数名を`{}`で囲む。

```php
echo "my name is $myname. nice to meet you";
echo "my name is ${myname}. nice to meet you";
echo "$people->john drank some $juices[0] juice.".PHP_EOL;
```

#### 変数のパース - complex syntax

複雑な Expression を書ける方法、という意味で Complex と呼ばれている。`{}`を使う。下記のような場合に使用する。

- シングルクオートを使いたい
- 動的に変数名を設定したい
- Object のプロパティ名の区切りを明示したい

```php
echo "This is {$arr['foo']}";
echo "This is ${$great}";
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

array, object, resources はそのままキャストしても意味がない（"Array"などになってしまう）ので、`print_r()`や`var_dump()`を使うこと。

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

なお、php で使うほとんどの値は`serialize()`を使うことで string の表現に変換できる。シリアライズ化した値は、`unserialize()`でもとに戻すことができる。

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
- キーを省略すると、Auto Increment な integer が順に振られる。この際、その配列において過去に一度でも使われた数字は、すでに配列から消去されている場合でも、再利用はされない。再利用したい場合は`array_values()`を使って reindex する作業が必要。

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
var_dump($array{42});
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
- `array_diff($arr1, $arr2)`

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
- object の場合

  - プロパティがキー名になる
  - private の場合は`\0クラス名\0プロパティ名`になる
  - protected の場合は`\0*\0プロパティ名`になる
  - `\0`は null を表す。なぜこれが必要なのかはよくわからない。

  ```php
  class MyClass
  {
    public $myPublic;
    private $myPrivate;
    protected $myProtected;
  }
  /*
    array(3) {
      ["myPublic"]=>  NULL
      ["\0MyClass\0myPrivate"]=>  NULL
      ["\0*\0myProtected"]=>  NULL
    }
  */
  ```

#### 配列の比較

`array_diff($arr1, $arr2)`により、$arr1 に存在し、$arr2 に存在しない要素を抽出できる。

```php
$array1 = array("a" => "green", "red", "blue", "red");
$array2 = array("b" => "green", "yellow", "red");
$result = array_diff($array1, $array2);
// => Array([1] => blue)
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
コールバックの渡し方は下記の 4 つがある。

- 文字列で渡す方法
- array で渡す方法
- object を渡す方法
- Anonymous Function を渡す方法

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

注意：JS と異なり、PHP ではクラスメソッドをインスタンスを起点にして呼ぶことができる。

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

Closure = Anonymous function のこと。

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

callable のこと。callable が登場する以前は、callback という擬似タイプが存在していた。

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

  - デフォルトは値渡し（Object だけは例外で、参照渡し）
  - 参照渡ししたい場合は、代入する値に`&`を使う。この場合、代入された側はただのエイリアスになる。
  - `&`をつけることができる対象は、名前付き変数のみ(`&(1+2)`などは無効)

  ```php
  $a = 1;
  $b = $a;
  $b = 2;
  var_dump($a); // => 1
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

スコープの種類は、グローバルか、ローカル（ファンクション内）の 2 つ。

#### Include

他のファイルを Include した場合、Include した場所にそのファイルを差し込んだようなイメージになる。

- `$a`は、`other.php`内で使用可能
- `other.php`内の変数・メソッドは、取り込み主で使用可能。スコープは、`include`文が存在している場所によって決まる。ただし、ファンクションとクラスはグローバルスコープになる。詳細は[こちら](http://php.net/manual/ja/function.include.php)。

```php
$a = 1;
include 'other.php';
```

#### グローバル変数とローカル変数

ファンクションの中からアクセスできるのはローカル変数のみ。

```php
$a = 1; // グローバル
function test()
{
    echo $a; // ローカル変数を参照する。グローバルにはアクセスできない。
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
- 変数のスコープとは異なり、どこでも宣言でき、どこからでもアクセスできる。
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

最終的に値になるものすべて。「式」と訳される。

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

`何らかのexpression;`が Statement である。「文」と訳される。

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

#### Operators の種類

気になったところだけ記載した。

- [Arithmetic Operators](http://php.net/manual/en/language.operators.arithmetic.php)
  - `+$a`, `-$a`
- [Assignment Operators](http://php.net/manual/en/language.operators.assignment.php)
  - `$a = 1`自体も Expression である
  - combined operators `+=`, `*=`など
  - 原則としてすべて値渡しである。object は参照渡しのように見えるが、実際は handle(object の実体への参照のようなもの)を値渡ししている。
  - `&new`はエラーになる
- [Bitwise Operators](http://php.net/manual/en/language.operators.bitwise.php)
  - 必要になったら調べる
- [Comparison Operators](http://php.net/manual/en/language.operators.comparison.php)

  - `==`,`!=`,`<>` タイプの自動変換後の比較
  - `===`,`!==` タイプの自動変換をせずに厳密比較
  - `<=>` 大きいか(1)、小さいか(-1)、イコールか(0)を返す

    ```php
    echo 1 <=> 1; // 0
    echo 1 <=> 2; // -1
    echo 2 <=> 1; // 1
    echo "b" <=> "a"; // 1
    ```

  - Ternary Operator

    ```php
    $action = (empty($_POST['action'])) ? 'default' : $_POST['action'];
    ```

  - Null Coalesing(合体) Operator
    - 左辺が null だったときのみ右辺を評価する
    ```php
    $a = null ?? 'true!';
    ```

### Error Control Operators

`@`のこと。Expression に前置すると、その Expression に関するエラーを無視する。
詳細は[こちら](http://php.net/manual/en/language.operators.errorcontrol.php)。

### Execution Operators

backtick で囲むことでシェルコマンドを実行できる。

```php
echo `ls -al`;
```

### Incrementing/Decrementing Operators

`++$a`, `$a++`, `--$a`, `$a--`

### Logical Operators

- `and` どちらも true
- `or` 少なくとも 1 つが true
- `xor` どちらか一方のみ true
- `!`
- `&&`
- `||`

`and/or` は `=` よりも優先度が低い。`||/&&`は`=`よりも優先度が高い。このため、下記のような事故がおこりがち。

```php
$bool = true && false;
var_dump($bool); // false, that's expected

$bool = true and false;
var_dump($bool); // true, ouch!
```

### String Operators

`.`で文字列を接続する。`.=`も使える。

### Array Operators

- `+` 配列を結合する。キー重複時は左辺が優先される。
- 緩い比較
  - `==` 同じ key-value ペアを持っているか
  - `!=`, `<>` 上記の否定形
- 厳密な比較
  - `===` 同じ key-value ペアを持っているかつ、同じ順番、同じタイプか
  - `!==` 上記の否定形

### Type Operators

- `instanceof` あるインスタンスがあるクラスから生成されたかどうかを返す。
- 継承、インターフェースの実装でも True を返す。
- 右辺は文字列でも OK

```php
class MyClass{}
class NotMyClass{}
$a = new MyClass;

var_dump($a instanceof MyClass); // true
var_dump($a instanceof NotMyClass); // false
```

## Control Structures

### JS とほぼ同じ書き方のもの

- `if/elseif/else`
- `while`
- `do-while`
- `for`
- `switch`

### `foreach`

配列や Object にループ処理を行う。

```php
foreach (array_expression as $value)
foreach (array_expression as $key => $value)
foreach (array_expression as $key => &$value) // 値を編集したいときは参照渡しにする
```

- JS と異なり、下記で言う`$color`は foreach の外側でも生きている（マジか）。`unset()`で削除しておくこと。

```php
$colors = array('red', 'blue', 'green', 'yellow');
foreach ($colors as &$color) {
    $color = strtoupper($color); // 大文字に変換
}
unset($color); // ここでもまだ$colorは生きているのでクリアしておく
```

#### list()

`list()`では、Array の中身を順番に取り出せる。

```php
list($a, $b, $c) = [1, 2, 3];
```

これを使うと、ネストした Array の情報をうまく引き出せる

```php
$array = [[1, 2], [3, 4]];
foreach ($array as list($a, $b)) { echo "$a $b" };
```

### `declare`

`ticks`, `encoding`, `strict_types`というものを扱う時に使えるらしい。必要になったら[ドキュメント](http://php.net/manual/en/control-structures.declare.php)を参照する。

### `include / require`

- 外部の PHP ファイルを読み込む
- 読み込みに失敗した時、include は警告するだけだが、require は致命的エラーを投げる
- `include`を記載した場所で利用可能な **Variable Scope** は、読み込まれた側のファイルですべて利用可能となる。逆に、読み込まれたファイル内の**変数**は、`include`の場所で宣言されたのと同じように振る舞う。
- ただし、**ファンクションとクラス**については、グローバルとして読み込まれる。

### `include_once / require_once`

すでに読み込まれていたら読み込まない。

### 別の書き方

- `if`,`while`,`for`,`foreach`,`switch`については、別の書き方ができる。
- `:`ではじめ、`endif`,`endwhile`,`endfor`,`endforeach`,`endswitch`で終わる。

```php
<?php if ($expression == true): ?>
  This will show if the expression is true.
<?php else: ?>
  Otherwise this will show.
<?php endif; ?>
```

## Functions

### User-defined functions

- すべてのファンクション・クラスはグローバルスコープを持つ。仮に、ファンクション内で宣言したとしても。
- ファンクションのオーバーロード、再定義はできない
- ファンクション名は case-insensitive である
- 宣言した場所よりも前の行でファンクションを呼ぶことができる（一部例外あり）

### Arguments

#### 引数の参照渡し

```php
function add_some_extra(&$string)
{
    $string .= 'and something extra.';
}
$str = 'This is a string, ';
```

#### Default Value

```php
function makecoffee($type = "cappuccino"){}
```

#### Type declarations (= 以前は Type hints と呼ばれていた)

```php
function myFunc(string $text) {};
```

strict モードにすると、自動変換を行わずにエラーを投げるようになる。

```php
declare (strict_types = 1);
function myFunc(string $text)
{
    echo $text;
};
myfunc(123); // => TypeError
```

TypeError のキャッチ方法

```php
try {
    /* do some error */
} catch (TypeError $e) {
    echo 'Error: '.$e->getMessage();
}
```

#### Variable-length argument list

`...`を使う。

呼び出される側で展開する

```php
function myFunc(...$args)
{
    var_dump($args);
    // [0]=>  string(5) "hello"
    // [1]=>  string(5) "world"
};
myfunc('hello', 'world');
```

呼び出し側で展開する

```php
function add($a, $b) {}
echo add(...[1, 2]);
```

### Returning values

return を省略すると Null が返る。

#### array で返す

```php
function small_numbers()
{
    return array (0, 1, 2);
}
list ($zero, $one, $two) = small_numbers();
```

#### 参照を返す

呼び出し側、呼び出され側の両方に`&`をつける。TODO:要調査

```php
function &returnsReference()
{
    return $someRef;
}
$newref = &returnsReference();
```

#### Return type declarations

PHP7 からは、返値のタイプを指定できる。strict mode も適用される。

```php
function sum($a, $b): float {}
```

### Variable functions

string に`()`をつけると、ファンクションとして実行される。

```php
function foo($text)
{
    echo $text;
}

'foo'('hello'); // hello

$foo = 'foo';
$foo('hello2'); // hello2
```

インスタンスメソッドにも使える

```php
class Foo
{
    public function Variable()
    {
        $name = 'Bar';
        $this->$name();
    }
    public function Bar()
    {
        echo "This is Bar";
    }
}

$foo = new Foo();
$funcname = "Variable";
$foo->$funcname(); // => This is Bar
```

### Internal (built-in) functions

使用できる Internal Function は環境により異なる。`phpinfo()`で読み込まれている Extension を一覧表示することができる。必要に応じて設定を行うこと。

### Anonymous functions

- Anonymous functions(=closures)
- コールバック関数として使うときに便利
- Closure クラスで実装されている
- 変数に代入できる

#### 親スコープの変数を使う方法

- `use`を使う。値渡しである。必要があれば`&message`に変えて、参照渡しにすること。
- `use`した値は、ファンクションの宣言時の値で固定される。**ファンクションを呼んだ時の値ではない**ので注意する。

```php
$message = 'hello';

$example = function () use ($message) {
    var_dump($message);
};
$example();
```

#### Automatic binding

クラス内の Anonymous Function にある`$this`は、自動的にクラスインスタンスにバインドされる。
この挙動がふさわしくない場合は Static anonymous functions を使うこと。

```php
class Test
{
    public function testing()
    {
        $func = function() {
            var_dump($this); // $this はインスタンス自体に自動でバインドされる
        };
        $func();
    }
}
```

#### Static anonymous functions

Static Closure ともいう。クラスインスタンスにバインドされない無名関数。

```php
class Test
{
    public function testing()
    {
        $func = static function () {
            var_dump($this);  // $this はインスタンスにバインドされていない（エラーになる）
        };
        $func();
    }
};
```

## Classes & Objects

### Basics

- クラスはプロパティ（Constants, Variables）とメソッド(functions)をもつ。

```php
class SimpleClass
{
    // property declaration
    const CONSTANT = 'some const';
    public $var = 'a default value';

    // method declaration
    public function displayVar() {
        echo $this->var; // $thisはインスタンスを指す
    }
}
```

#### $this

- $this が何を指すかは、PHP のバージョンや、呼び出し方（静的・非静的）によって異なる。
- PHP7 の使用は下記の通り。

```php
class A
{
    public function foo()
    {
        if (isset($this)) {
            echo 'defined';
        } else {
            echo "undefined";
        }
    }
}

class B
{
    public function bar()
    {
        A::foo();
    }
}

$a = new A();
$a->foo(); // 非静的　defined

A::foo(); // 静的　undefined

$b = new B();
$b->bar(); // 非静的　undefined

B::bar(); // 静的　undefined
```

#### new

クラスから新しいインスタンスを作成する。

```php
$instance = new SimpleClass();
```

クラス内では、`new self`,`new parent`とすることで自身を作成できる。

インスタンスを代入すると、インスタンスの**実体への参照（handle）がコピー**される。
これは、インスタンスを格納している変数への参照(エイリアス)ではないので注意する。
詳細は[こちらのコメント](http://php.net/manual/en/language.oop5.basic.php#79856)を参照する。

```php
$instance = new SimpleClass();

$assigned = $instance;
$reference = &$instance;

$instance->var = '$assigned will have this value';

$instance = null; // $instance and $reference become null

var_dump($instance); // null
var_dump($reference); // null
var_dump($assigned); // ["var"]=> string(30) "$assigned will have this value"
```

作成したインスタンスへすぐにアクセスする。

```php
echo (new DateTime())->format('Y');
```

#### プロパティとメソッド

プロパティとメソッドを同じ名前にできる。その場合、呼び出され方によって自動的に選択される。

#### extends

- 他のクラスを 1 つだけ継承できる。
- メソッドやプロパティは、親で`final`として定義されていない限りは、子側で上書きできる。
- `parent::`で親のメソッド、スタティックプロパティにアクセスできる。

#### ::class

`Classname::class`とすることで、ネームスペースも含めた Fully Qualified Name を取得できる。

```php
namespace NS {
    class ClassName {}

    echo ClassName::class; // => NS\ClassName
}
```

### Properties

- プロパティは`public`,`protected`,`private`のいずれかと、名前によって作成される。
- メソッド内から non-static なプロパティにアクセスするには`this->property`の記法を使う。
- メソッド内から static なプロパティにアクセスするには、`self::$property`の記法を使う
- `$this`はクラスインスタンス自体を指す。すべてのクラスメソッドから利用可能。ただし、メソッドが異なるコンテキストから呼ばれた場合は NULL になる。

### Class Constants

- クラスレベルの定数を設定できる。
- `public`,`private`の 2 つの Visibility がある。

```php
class MyClass
{
    private const PRIVATE_CONST = 'private'; // クラス外からアクセスできない
    public const CONSTANT = 'constant value';

    public function showConstant()
    {
        echo self::CONSTANT;
    }
}

echo MyClass::CONSTANT; // constant value
echo "MyClass"::CONSTANT; // constant value

$class = new MyClass();
$class->showConstant();// constant value

echo $class::CONSTANT; // constant value
```

### Autoloading Classes

`spl_autoload_register()`を使うことで、クラス名を元にして必要な外部ファイルを自動で読み込むことができる。

```php
spl_autoload_register(function ($class_name) {
    include $class_name . '.php';
    // => MyClass1.php, MyClass2.php, ITest.php
});

$obj  = new MyClass1();
$obj2 = new MyClass2();
class Foo implements ITest{}
```

### Constructors and Destructors

#### Constructor

- クラスにはコンストラクタ・デストラクタを設定できる。
- サブクラスでは親のコンストラクタ・デストラクタは呼ばれないので、必要なら`parent::__construct()`等で明示的に呼ぶこと
- 同名のメソッドがコンストラクタとして扱われた時代もあったが、昔のことなので忘れること。

```php
class MyClass
{
    function __construct(){}
    function __destruct(){}
}
```

### Visibility

- プロパティ、メソッド、コンスタントのスコープを決めるもの
  - `public` どこからでも
  - `protected` そのクラスと、親・子クラスからのみ
  - `private`　そのクラスからのみ

#### Property visibility

`var`で宣言した場合は public になる（非推奨）

#### Method Visibility

無印の場合は public になる。

#### Constant Visibility

無印の場合は public になる。

### Scope Resolution Operator

`::`のこと。下記の 3 つの用途で使う。

クラスの外側から、クラス内の定数にアクセスする

```php
echo MyClass::CONST_VALUE;
```

クラスメソッド内から、クラスのスタティックな値にアクセスする

```php
class OtherClass extends MyClass
{
    public static $my_static = 'static var';

    public static function sampleFunc() {
        echo self::$my_static;
    }
}
```

クラスメソッド内から、親クラスのプロパティ・メソッドにアクセスする

```php
class OtherClass extends MyClass
{
    public static function sampleFunc() {
        echo parent::CONST_VALUE;
        echo parent::sampleFunc();
        echo parent::$my_static;
    }
}
```

### Static Keyword

- static に宣言されたクラスのメソッドとプロパティは、クラスのインスタンスを作らなくても使用することができる。
- static なプロパティには、インスタンスから`$instance->$someStatic`にようにアクセスできない。`$instance::$someStatic`ならアクセスできる。
- スタティックメソッドの中では`$this`は使えない。インスタンス化していないので当然。

### Class Abstraction

- Abstract class はインスタンス化できない
- 部分的に完成されたクラスの雛形
- Abstract class で宣言されているメソッドは、extends 先でも同じもの（名前、引数のタイプ、等）を実装する必要がある。

```php
abstract class AbstractClass
{
    // force extending class to define these methods
    abstract protected function getValue();
    abstract protected function prefixValue($prefix);
    // common method
    public function printOut(){}
}

class ConcreteClass1 extends AbstractClass
{
    public function getValue(){/* some implementation */}
    public function prefixValue($prefix){/* some implementation */}
}
```

#### Abstract と Interface の違い

```php
// this is saying that "X" agrees to speak language "Y" with your code.
class X implements Y { }

 // this is saying that "X" is going to complete the partial class "Y".
class X extends Y { }
```

### Object Interfaces

- インターフェースのメソッドは外部からアクセスするための定義なので、当然すべて public である。
- `extends`を使えば、インターフェースがインターフェースを継承することもできる。
- ある Object が特定のメソッドを持つことを保証したい時に使う。もっと具体的には、差し替える可能性のあるクラスに、インターフェースを実装しておくことで、[後を楽にする](http://php.net/manual/en/language.oop5.interfaces.php#107364)ためのもの。

```php
interface ITemplate
{
    public function setVariable($name, $var);
    public function getHtml($template);
}

class Template implements ITemplate
{
    public function setVariable($name, $var){}
    public function getHtml($template){}
}
```

### Traits

- コードを再利用するための方法
- 好きな粒度でコードをグループ化できる
- abstract, static, property, method などを予め作成しておき、クラスにコピペできる。
- 詳細は[ドキュメントを参照](http://php.net/manual/en/language.oop5.traits.php)

```php
trait SayHello
{
    public function sayHello()
    {
        echo 'Hello ';
    }
}

trait SayWorld
{
    public function sayWorld()
    {
        echo 'World!';
    }
}

class MyHelloWorld
{
    use SayHello, SayWorld;
}

$o = new MyHelloWorld();
$o->sayHello();
$o->sayWorld();
```

### Anonymous classes

- サクッと一時的にクラスを作るための機能。PHP7 以降で使用できる。
- extends, implements, trait, constructor など、通常のクラスと同じことがすべてできる。
- [詳細](http://php.net/manual/en/language.oop5.anonymous.php)

```php
$util->setLogger(new class {
    public function log($msg)
    {
        echo $msg;
    }
});
```

### Overloading

- 動的にプロパティやメソッドを作るための方法。
- 非常に評判が悪そうなので、必要になったら[学習](http://php.net/manual/en/language.oop5.overloading.php)する。

#### Property overloading

`__set`,`__get`,`__isset`,`__unset`

### Method overloading

`__call()`,`__callStatic()`
