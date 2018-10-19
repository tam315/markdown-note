# PHP

[[toc]]

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

PHP の Array は、実際は Ordered Map である。下記のような用途に使うことができる。

- array
- list(vector)
- hash table
- dictionary
- collection
- stack
- queue
