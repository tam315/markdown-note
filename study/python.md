---
category: python
---

# Python

[[toc]]

## 基本

### インストール

[こちらを参照](https://qiita.com/segur/items/23f276320216c3aa7cf7)

### ドキュメント

- [https://docs.python.org/3/](https://docs.python.org/3/)
- [udemy](http://nbviewer.jupyter.org/github/Pierian-Data/Complete-Python-3-Bootcamp/tree/master/)

### 用語

- `Python` プログラミング言語
- `Pythonインタプリタ` Python コードを逐次実行するプログラム(python に main 関数などは無い）
- `IDLE` REPL 環境(shell)とエディタを備えた、Python 付属の IDE
- `PyPI` Python Package Index。サードパーティライブラリの集中型リポジトリ
- `pip` PyPI 上に公開されているパッケージのインストールユーティリティ

### クオート

- 文字列は`'`で囲む（`'`のエスケープが必要なときはダブルでも OK）
- docstring(heredoc) は`"""`で囲む。複数行に渡って書ける。

### ライブラリ

- モジュール(`os`, `datetime`など)-> 関数の集まり
- ライブラリ -> モジュールの集まり。特に、デフォルトで用意されているライブラリを標準ライブラリと呼ぶ。

```python
import os
import sys
import datetime

sys.platform
sys.version
os.getcwd()
os.environ
os.getenv("home")
datetime.date.today()

# モジュールに定義されている関数の一覧を表示
dir(os)

# 関数の使い方を調べる
help(os.environ)
```

#### import

- `import`でモジュール全体を読み込む
- `from - import`で関数だけを読み込む
- インポートはファイルのトップレベルでのみ行う。関数内で行うと、呼び出すたびに実行され、問題が発生する。

```python
import time
time.sleep()

from time import sleep
sleep()
```

### インデント

- Python では`{}`を廃止し、インデントでコードブロック（suite）を区別する
- コードブロックの前には`:`が必ず入る

```python
if a == 1:
  do_something()
else:
  do_something()
```

### 文字列

```python
# リストを特定の文字列を区切りとして結合する
'|'.join(['a','b','c']) # => 'a|b|c'

# 文字列を特定の文字で分割する
'a|b|c'.split('|') # => ['a', 'b', 'c']
```

#### format by placeholder

- `%s` `str()`で出力。特殊文字はそのまま出力される。
- `%r` `repr()`で出力。特殊文字はただの文字列にエスケープされる。
- `%d` 整数で出力
- `%1.0f` float で出力

```py
print("I'm going to inject %s text here, and %s text here." % (x, y))
```

#### format by `format()`

```py
print('The {2} {1} {0}'.format('fox', 'brown', 'quick'))
print('First Object: {a}, Second Object: {b}, Third Object: {c}'.format(
    a=1, b='Two', c=12.3))
```

#### format by f-string

```py
a = 1
b = 'wow'
print(f'{a} and {b}') # => '1 and wow'
```

### Docstring

- `"""`を使うと docstring(heredoc)を書ける
- 複数行に渡って書くことができる。

### コレクション

| type       | description                  |
| ---------- | ---------------------------- |
| List       | 可変配列（JS の Array 相当） |
| Tuple      | 不変配列                     |
| Dictionary | key-value ペア               |
| Set        | ユニーク値の集合             |

### Boolean

`True`か`False`。パスカルケースのみ。

False と判定されるものは下記のとおり。これ以外はすべて`True`である。

- `0`
- `0.0`
- `''`
- `[]`
- `{}`
- `None`

#### Falsy な値に関する注意

下記の 2 つは、異なるものである。

- `if cond is not None:` => `None`であった場合のみ何もしない
- `if cond:` => `None`,`0`,`''`,`[]`,`{}`であった場合に何もしない

例えば、`if somedict['some_key']:`だと、値が None だった場合だけでなく、値が 0 や空文字列の場合にも実行されない。

コンディションを書くときは **「None 以外の falsy な値(0 や空文字列)であった時に、何かする必要があるか」** を考え、falsy な値を拾う必要があれば、`is not None`を使うこと。

None で無いことを調べた後に、追加の対応が必要な場合もある。例えば文字列なら空文字列でないか、配列なら要素が 0 ではないか、など。例えば、「None ではなく、空文字列でもない、文字列」を保障するには下記のようになる。

```py
if cond is not None and \
   type(cond) == str and \
   cond != '':
```

### 制御

#### for

python の文字列は**シーケンス**なので反復処理できる

```python
for i in [1,2,3]:
  print(i)
for l in "hello":
  print(l)
```

インデックスを取得する方法

```py
for index, word in enumerate(['hello','my','friend']):
    print(index, word)

# 0 hello
# 1 my
# 2 friend
```

### Built-in Functions

[公式ドキュメント](https://docs.python.org/3/library/functions.html)

#### print()

コンソール等に文字を出力する

```python
print('some string')
print('some string', file=file_object) # ファイルに出力
print('some string', end='') # 行末を何にするか（デフォルトは改行）
print('a', 'b', 'c', sep=',') # => 'a,b,c'
```

#### pprint()

オブジェクトをきれいにコンソールに出力する

```python
import pprint
pprint.pprint(some_ugly_dictionary)
```

#### range()

- `range(終了値)`
- `range(開始値, 終了値, 刻み)`
- 終了値は結果に含まない

```python
range(5) # [0, 1, 2, 3, 4]
range(10, 0, -2) # [10, 8, 6, 4, 2]
```

#### sorted()

`sorted()`は、dict の key や、Set を、ソートされたリストにして返す。

```python
dict = {'e': 0, 'd': 0, 'c': 0, 'b': 0, 'a': 0}
sorted(dict) # => [a,b,c,d,e]

for key in sorted(dict):
  do_something(dict[key])

my_set = {'b','c','a'}
sorted(my_set) # => ['a','b','c']
```

#### list(), set()

list や set を作る。

```python
list('john')
set('hello')
```

#### type()

タイプを判定する

#### id()

変数のメモリアドレス表現する一意の数値を取得する

#### str()

オブジェクトを文字列にして返す

### dunder name dunder main

`__name__`オブジェクトには、下記の値が入る

- そのコードが、Python で直接実行されたとき=>`__main__`
- そのコードが、モジュールとしてインポートされたとき=>モジュール名

下記のコードは'dunder name dunder main'と呼ばれる。コードが直接実行されているか、又はインポートされているかを調べる。

```py
if __name__ == '__main__':
  do_something()
```

## コレクション

### List

- 順序は保証される

```python
# リテラルで作成
numbers = [1, 2, 3, 4, 5]

# ビルトイン関数で作成
list('john') # => ['j','o','h','n']

# 長さを調べる
len(numbers)

# 参照渡し
new_numbers1 = numbers

# 値渡し
new_numbers2 = numbers.copy()

# 最初の要素と最後の要素
numbers[0]
numbers[-1]
```

#### リストメソッド

```python
# listに関するメソッドを表示
help(list)

# 追加する
numbers.append(6)

# 配列で追加する
numbers.extend([7, 8, 9])

# 指定した場所に追加する
numbers.insert(0, "first-element")

# 削除する(インデックス値ではなく、削除したい値自体を渡す。最初に見つかった値が削除される)
numbers.remove(2)

# 末尾や特定位置の要素を削除する
numbers.pop()
numbers.pop(2)
```

#### スライス表記

- `[開始値, 終了値, 刻み]`の表記をスライス表記という。いずれも省略可。
- 非破壊的にリストの要素を抽出できる
- リスト以外も含むあらゆるシーケンスからスライスできる

```python
numbers[0:5:2]
numbers[::1]
numbers[1::2]
```

#### for とリスト

for はリストやスライスを理解できるので、そのまま渡してやることができる。

### Dictionary

- 構造を持つデータには Dictionary(key-value ペア)を使う。
- C++, Java ではマップと呼ばれ、Ruby ではハッシュと呼ばれるものに相当。
- 順序は保証されない

```python
# 作成
person = {
    'name': 'John',
    'mail': 'john@john.com',
}

# キーの追加
person['age'] = 33

# for(キーの順は非保証)
for key in some_dictionary:
  print(some_dictionary[key])
```

#### メソッド

`items()` key-value ペアのリストを返す

```python
some_dict = {'e': 0, 'd': 0, 'c': 0, 'b': 0, 'a': 0}
some_dict.items()
# => [('e', 0), ('d', 0), ('c', 0), ('b', 0), ('a', 0)]
# => 上記はdict_itemsという特殊な型

for key, value in some_dict.items():
# or
for key, value in sorted(some_dict.items()):
```

`setdefault()` キーが未初期化だった場合に初期化を行う

```python
some_dict.setdefault('somekey', 'somevalue')

# これは下記と等価
if 'somekey' not in some_dict:
  some_dict['somekey'] = 'somevalue'
```

`pop('キー名')` キー名の要素を抜き出して返す。辞書からは削除する。

#### 値へのアクセス

- キーの存在が確実である場合（なければならない場合）
  - `dict['somekey']`
- キーの存在が不確実である場合
  - `dict.get('somekey')` => キーが存在しなければ None を返す
  - `dict.get('somekey', 'default value')` => キーが存在しなければ`default value`を返す

#### キーの存在確認と None 確認は両方必要

「意味のある値がセットされている場合に限って何かをしたい」ときは、キーの存在確認と、値が None であるかの確認は両方必要となる。

あたりまえだけど、Key は存在するものの、値が None ということはありえる。

```py
my_dict = {'i_am_none': None}

# キーの存在確認
bool('i_am_none' in my_dict)

# 値のnullチェック
bool(my_dict['i_am_none'] is not None)

# （必要に応じて）空文字などのチェック
bool(my_dict['i_am_none'] != '')

# 又は、キーの存在チェックを省く方法
my_dict.get('i_am_none') is not None and \
my_dict.get('i_am_none') != ''
```

### Set

- Set(集合)とは、ユニークな値のあつまりのこと
- 差集合、積集合、和集合などの操作を行うことができる
- 順序は保証されない

```python
# リテラルで作成
vowels1 = {'a', 'e', 'e', 'i', 'o', 'u', 'u'}

# ビルトイン関数で作成
vowels2 = set('aeeiouu') # => {'u', 'e', 'i', 'o', 'a'}
```

#### 結合 union

オリジナルと比較対象を足したもの

```python
original = {'a', 'e',  'i', 'o', 'u'}
u = sorted(original.union(set('hello')))
print(u)  # ['a', 'e', 'h', 'i', 'l', 'o', 'u']
```

#### 差分 difference

オリジナルにあって、比較対象にないもの

```python
original = {'a', 'e',  'i', 'o', 'u'}
u = sorted(original.difference(set('hello')))
print(u)  # ['a', 'i', 'u']
```

#### 共通 intersection

オリジナルにも、比較対象にもあるもの

```python
original = {'a', 'e',  'i', 'o', 'u'}
u = sorted(original.intersection(set('hello')))
print(u)  # ['e', 'o']
```

### Tuple

- 変更できないリストのこと
- 変更できないかわりに、低いオーバーヘッドを得られる
- 順序は保証される

```python
# リテラルで作る
my_tuple = ('a', 'e', 'i', 'o', 'u')

# 要素が1つの場合は`,`をつけないと文字列として判定されるので注意
my_tuple = ('single',) # => ('single',)
my_tuple = ('single') # => 'single'

# ビルトインファンクションで作る
my_tuple = tuple('aeiou') # => ('a', 'e', 'i', 'o', 'u')
```

### 内包表記

- メリット
  - 書きやすい
  - 文ではなく式として使うことができる（そのまま代入できる）
  - 通常の for 文と比較し、処理が最適化されて高速になる
- リスト内包表記（listcomp）、辞書内包表記（dictcomp）、集合内包表記（setcomp）がある。タプル内包表記は存在しない。

#### リスト内包表記

```py
numbers = [1, 2, 3, 4, 5]

big_numbers1 = []
for n in numbers:
    big_numbers1.append(n*10)

# 上記は下記の1行と等価

big_numbers2 = [n * 10 for n in numbers]

print(big_numbers1)  # [10, 20, 30, 40, 50]
print(big_numbers2)  # [10, 20, 30, 40, 50]

# 特定の条件に当てはまるものだけを抜き出す場合はifを使う
big_numbers2 = [n * 10 for n in numbers if n == 1]
```

`[]`を`()`に置き換えると、ジェネレータになる。リスト内包表記は全ての処理が終わるまで次に進まないが、ジェネレータであれば 1 つの処理が終わるごとに逐次実行される。

```py
import requests

urls = [
    'https://www.google.co.jp',
    'https://www.yahoo.co.jp',
    'https://www.microsoft.com',
]

for res in [requests.get(u) for u in urls]:
    # 結果がいっぺんに表示される
    print(res.status_code)

for res in (requests.get(u) for u in urls):
    # 結果が時間差で表示される
    print(res.status_code)
```

#### 辞書内包表記

```py
old_dict = {
    'key1': 'val1',
    'key2': 'val2',
}

new_dict = {f'new_{k}': f'new_{v}' for k, v in old_dict.items()}

print(new_dict)  # => {'new_key1': 'new_val1', 'new_key2': 'new_val2'}

# 特定の条件に当てはまるものだけを抜き出す場合はifを使う
new_dict = {f'new_{k}': f'new_{v}' for k, v in old_dict.items() if v == 'something'}
```

#### 集合内包表記

辞書内包表記に見えるけど`:`がない、ならばそれは集合内包表記である

```py
vowels = {'a', 'e', 'i', 'o', 'u'}
phrase = 'hello'

found = {v for v in vowels if v in phrase}

print(found) # => {'e','o'}
```

### その他

#### unpacking

リストや配列の要素を分解して抽出できる。

```py
a, b, c = [1, 2, 3]
```

#### 空のデータ構造

空の set は空の dict と区別がつかないので、`set()`として出力される。

```python
l = list()
d = dict()
s = set()
t = tuple()
print(l, d, s, t) # => [] {} set() ()
```

## 関数

### 関数の基本

- Python のコード再利用は、関数に始まり関数に終わる
- 関数＝コードに名前をつけたもの
- モジュール＝関数をパッケージ化したもの

```python
def some_function(some_argument):
    """関数の説明をここに書く"""
    # コードがここにくる
    return some_value
```

### アノテーション

アノテーションは、人間が楽にコードを読めるようにするためのもの。
Python はアノテーションを完全に無視する。
書いたからといって型チェック等が行われるわけではない。

```python
def search_for_vowels(word: str) -> set:
```

### シグネチャ

引数の数と型のこと？

### 引数のデフォルト値

```python
def search_for_vowels(word: str = "aeiou") -> set:
```

### キーワード引数を渡す

キーワードで引数を渡すと、順番を気にせずに引数を渡すことができる。

```python
def search_for_vowels(word, letter) -> set:
  do_something()

search_for_vowels(letter='letter', word='word')
```

### 辞書でキーワード引数を渡す

`**`を使うと、dictionary を展開して、キーワード引数として渡す事ができる。

```py
def test(name, age):
    print(name)
    print(age)

person = {
    'name': 'John',
    'age': 28,
}

test(**person)
# 上記は下記と等価
test(name=person['name'], age=person['age'])
```

### 辞書でキーワード引数を受け取る

`**`を使うと、複数のキーワード引数を dictionary として受け取ることができる。

引数名には`kwargs`を使うのが慣例。

```py
def test(**kwargs):
    print(kwargs['name'])
    print(kwargs['age'])

test(name='John', age=28)
```

### リストで引数を渡す

引数を渡す際に`*`を使うことで、配列の各要素を引数として渡すことができる。JS の`...`に相当する。

```python
def some_func(a, b, c):
    print(a, b, c)

values = [1, 2, 3]
some_func(*values) # => 1,2,3
```

### リストで引数を受け取る

引数を受け取る際に`*`を使うことで、複数の引数をリスト（正確にはタプル）として一括で受け取ることができる。JS の`...`に相当する。

引数名には`args`を使うのが慣例。

```python
def some_func(*args):
  pass

some_func() # arg => ()
some_func(1) # arg => (1,)
some_func(1,2) # arg=> (1,2)
```

### ジェネリクス型関数

任意の数のあらゆる型の引数を受け取ることのできる関数のこと。

```py
def god(*args, **kwargs):
    pass

# 以下のいずれの呼び出しもValidである
god()
god(1, 2, 3)
god(a=10, b=20, c=30)
god(1, 2, 3, a=10, b=20, c=30)
```

### モジュールの作成

python がモジュールを探す場所は下記の 3 つのみ。
自作のモジュールを配置するのであれば、`site-packages`が唯一の選択肢となる。

- カレントディレクトリ
- `site-packages`フォルダ
- 標準ライブラリ

#### 必要なファイル

- `vsearch.py` など（モジュール本体）
- `README.txt` とりあえず空でも OK
- `setup.py` パッケージを作成するためのセットアップファイル

```py
# vsearch.py
def say_hello():
    print('hello')

# setup.py
import setuptools

setuptools.setup(
    name='vsearch',  # 配布ファイルと同じ名前にするのが慣習
    version=1.0,
    description='my private tool',
    author="John Doe",
    url='something.com',
    py_modules=['vsearch']  # パッケージに含める.pyのリスト
)
```

#### パッケージを作成する

```bash
python setup.py　sdist # dist/MODULE_NAME.tar.gzとして作成される
```

#### パッケージをインストールする

```bash
pip install dist/MODULE_NAME.tar.gz
```

### スコープ

関数内から外部の変数にアクセスできる。この際、LEGB Rule (local, enclosing functions, global,
built-in)の順にアクセスする。

```py
global_val = 0

def lv1():
    lv1_val = 1

    def lv2():
        lv2_val = 2

        print(lv2_val) # local
        print(lv1_val) # enclosing funcitons
        print(global_val) # global
        print(len([1, 2, 3])) # build-in
```

関数はスコープを形成するので、外部から関数内の変数にはアクセスできない。

```py
original = 1

def test(a):
    b = a
    c = 1

test(original)
print(a) # error
print(b) # error
print(c) # error
```

### 共有渡し

Python の引数渡しの方法は、共有渡し(call by sharing)と呼ぶのが最も妥当らしい。つまりは関数（メソッド）の呼び出し元と呼び出し先で同じオブジェクトを「共有」する方法である。

Python では全てがオブジェクトであり、変数へ代入したり関数の引数へ渡すたびに内容をコピーしていたのではナンセンスである。このため、変数は全て「オブジェクトの実体への参照（メモリアドレス）」を格納している。関数を呼び出すときも、このメモリアドレスが引数として渡されるため、オブジェクトは「共有」されることになる。

ただし、引数への再代入を行った瞬間にそのルールは崩れる。再代入では、右辺の計算結果が**新たに用意された左辺の変数**に代入されるため、もはや呼び出し元と呼び出し先で同じオブジェクトを共有しなくなる。これにより、表面上は値渡しをしているように見える場合がある。

```py
def update(arg):
    # 再代入しなければ、呼び出し元の変数を操作できる
    arg.append('new data')

original = [0, 1, 2]
update(original)
print(original)  # => [0, 1, 2, 'new data']
```

```py
def update(arg):
    # 再代入すると、呼び出し元の変数はもはや操作できなくなる
    arg = ['new data']

original = [0, 1, 2]
update(original)
print(original)  # => [0, 1, 2] まるで値渡しをしているように見えるが、実際は異なる
```

### ジェネレータ関数

- 何回もリターンできる関数
- `for`文などで配列の替わりに指定することでループ処理できる

```py
def some_func():
    sleep(1)
    yield 1
    sleep(1)
    yield 2
    sleep(1)
    yield 3

for i in some_func():
    print(i) # 1 2 3 が1秒毎に表示される
```

### lambda 式

Expression として関数を書く方法。

```py
lambda num: num ** 2
```

上記は JavaScript でいう下記と一緒

```js
num => num ** 2;
```

## Flask

### 基本

```bash
pip install Flask
```

```py
from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello()->str:
    return 'hello from flask!'

app.run()
```

### フォルダ構成

- `templates` テンプレートファイルを配置する
- `static` 静的ファイルを配置する。`/static/**`でアクセスする。

### 設定情報

コンフィグ設定は`app.config`という辞書に保持するとよい。

```py
# 設定時
app.config['dbconfig'] = {　}

# 利用時
if(app.config['dbconfig'] == 'something'):
```

### テンプレート

Flask には jinja2 というテンプレートエンジンが備わっている。ベーステンプレートと、継承テンプレートを使う。

`base.html`

```html
<html>
  <head>
    <title>{{ the_title }}</title>
  </head>
  <body>
    {% block body %}{% endblock %}
  </body>
</html>
```

`child.html`

<!-- prettier-ignore -->
```html
{% extends 'base.html' %}

{% block body %}
  <h2>{{ the_title }}</h2>

  <!-- forも使える -->
  {% for item in the_data %}
    <p>{{ item }}</p>
  {% endfor %}

  <p>some content</p>
{% endblock %}
```

コントローラ

```py
from flask import Flask, render_template, request
@app.route('/child')
def child()->str:
    return render_template(
      'child.html',
      the_title="タイトルです",
      the_data=['1','2','3'],
    )
```

### デバッグモード

デバッグモードでは、コードに変更があればサーバを自動で再起動する。

```py
app.run(debug=True)
```

### ルーティング

メソッドにより処理を分ける方法

```py
# methodsに何も書かなければGETになる
@app.route('/')
# some function goes here

@app.route('/user', methods=['GET'])
# some function goes here

@app.route('/user', methods=['POST', 'DELETE'])
# some function goes here

# 複数のルートを一つのコントローラに紐付けることもできる
@app.route('/')
@app.route('/alias1')
@app.route('/alias2')
# some function goes here
```

### セッション

`session['キー名']`でセッション値を設定・取得できる。

```py
from flask import Flask, session

app = Flask(__name__)

# Flaskにシークレットキーを設定する
app.secret_key = 'my_secret'

@app.route('/setuser/<user>')
def setuser(user: str) -> str:
    session['user'] = user
    return 'User値を設定: '+session['user']

@app.route('/getuser')
def getuser()->str:
    return 'User値の現在値: '+session['user']
```

### フォームデータ

フォームデータにアクセスするには、`request` オブジェクトを使う。

```html
<input name="letters" />
```

```py
from flask import Flask, request

@app.route('/search', methods=['POST'])
def search()->str:
    request.form['letters']
```

### リダイレクト

`redirect()`関数を使う

```py
from flask import Flask, redirect

@app.route('/')
def top_page():
    return redirect('/entry')
```

### escape()

```py
from flask import excape

escape('<script>danger code</script>')
```

## ファイル IO

### open() / close()を使う

#### 書き込み

```py
todos = open('todo.txt', 'a')
print('line1', file=todos) # ファイルに出力する
print('line2', file=todos)
todos.close()
```

#### 読み込み

```py
todos = open('todo.txt') # デフォルトはrモード
for line in todos:
  print(line, end='') # 重複して改行を出力しない
todos.close()
```

#### モード

- `r` 読み込み
- `w` 書き込み　すでに存在するなら空にする
- `a` 追加書き込み
- `x` 新しいファイルに書き込み　すでに存在するなら失敗

`+`をつけると読み書きモードになる(`x+`など)

### open() / with()を使う

`with`を使うと、`close`の処理が自動で行われるので便利。`with` はコンテキストをマネジメントするためのもの。詳細は後述。

```py
with open('todos.txt') as tasks:
  for line in tasks:
    do_something()
  # or
  content = tasks.read() # 全体を文字列として一気に読み込む
  content = tasks.readline() # 1行だけ読み込む
  content = tasks.readlines() # 全体を1行1要素のリストとして一気に読み込む
```

## データベース

- `DB-API` は Python でリレーショナルデータベースを扱うモジュールに求められる仕様のことである。
- この仕様に沿って、各ドライバは作成されている。

```txt
Python Code <-> DB-API（に準拠したドライバ）<-> DB
```

### 手順

#### ドライバのインストール

DB に適応するドライバを pip でインストールする。例えば[MySQL の公式ドライバ](https://pypi.org/project/mysql-connector-python/)など。

```bash
pip install mysql-connector-python
```

#### DB に接続する

```py
import mysql.connector

# 設定をdictとして作る（任意）
dbconfig = {
    'host': '127.0.0.1',
    'user': 'root',
    'password': '123456',
    'database': 'vsearchlogDB'
}

# 接続する
conn = mysql.connector.connect(**dbconfig)

# カーソルを取得しておく
cursor = conn.cursor()
```

#### データを取得する

```py
# SQLを作成（慣習として_SQLという変数と、heredocが使われる）
_SQL = """describe log"""

cursor.execute(_SQL)

res = cursor.fetchone() # 1行だけ取得（Tupleが返る）
res = cursor.fetchmany(5) # 指定した行数を取得（Tupleのリストが返る）
res = cursor.fetchall() # 全ての行を取得（Tupleのリストが返る）
```

#### データを挿入する

```py
_SQL = """
insert into log
(phrase, letters, ip, browser_string, results)
values
(%s, %s, %s, %s, %s)
"""

# 第二引数にTupleを渡す
cursor.execute(_SQL, ('hitch-hiker', 'xyz', '127.0.0.1', 'Safari', 'set()'))

# 強制的に書き込みを確定する
conn.commit()
```

#### DB との接続を閉じる

```py
cursor.close()
conn.close()
```

## クラス

- Python ではクラスの作成は必須ではない
- ただし、`with`を使ってコンテキストマネジメント（前処理、本処理、後処理）を行うには、クラスが必須となる

### クラスの定義とインスタンス化

- 空のクラスの定義と、インスタンス化を行う方法は下記の通り
- `pass`は構文的に正しく有効だが、何もしないステートメントである

```py
# 空のクラス
class CountFromBy:
    pass

a = CountFromBy()
b = CountFromBy()
```

### メソッド呼び出しの動き

クラスインスタンスからメソッドを呼び出したとき、下記のような変換が行われる。メソッドの定義が、`def some_func(self)`のように self を取るのはこのためである。

```py
a = CountFromBy()

a.increase()
# これは下記に変換して呼び出される
CountFromBy.increase(a)
```

### 継承

```py
class ChildClass(ParentClass):
  pass
```

### 特殊メソッド

- 全てのクラスは、object クラスを継承している
- object クラスはいくつかの特殊メソッド(dunder)を持っている。これらをオーバーライドすることでクラスの振る舞いを変えることができる。

#### \_\_init\_\_

インスタンス生成時に呼び出される。属性（プロパティ）の初期設定に使われる。

```py
class CountFromBy:
    def __init__(self, value, increment):
        self.val = value
        self.incr = increment

    def increase(self):
        self.val += self.incr

a = CountFromBy(100, 10)
print(a.val) # 100

a.increase()
a.increase()
a.increase()
print(a.val) # 130
```

#### \_\_repr\_\_

オブジェクトを`print`したときなどに使われる。オブジェクトを表現する文字列を返すこと。

## コンテキストマネジメントプロトコル

前処理-本処理-後処理というパターンを上手く扱うためのプロトコルである。このプロトコルを実装したクラスであれば、`with`とともに使うことができる。

### メソッド

#### \_\_init\_\_(オプション)

enter よりも前に行う必要のある初期化作業を行う。

#### \_\_enter\_\_

前処理を行う。`with`に値を返すことができる。

#### \_\_exit\_\_

後処理を行う。`__init__`や`__enter__`が失敗した場合には実行されない。

### データベース操作の例

#### プロトコルを実装したクラス

```py
import mysql.connector

class UseDatabase:
    def __init__(self, config: dict) -> None:
        self.config = config

    def __enter__(self) -> 'cursor':
        self.conn = mysql.connector.connect(**self.config)
        self.cursor = self.conn.cursor()

        return self.cursor

    def __exit__(self, exc_type, exc_value, exc_trace) -> None:
        self.conn.commit()
        self.cursor.close()
        self.conn.close()

        # with内で例外が起こった場合の処理
        # (特定のエラーを捕捉)
        if exc_type is RuntimeError:
            raise RuntimeError
        # (その他全てのエラーを捕捉)
        elif exc_type:
            raise exc_type(exc_value)
```

#### クラスを with で使う

```py
dbconfig = {
    'host': '127.0.0.1',
    'user': 'root',
    'password': '123456',
    'database': 'vsearchlogDB'
}

with UseDatabase(dbconfig) as cursor:
    _SQL = """show tables"""
    cursor.execute(_SQL)
    data = cursor.fetchall()
    print(data)
```

### 例外処理

- `__init__`や`__enter__`の中で起こったエラーは、通常通り未補足のままで raise される。
- `__init__`や`__enter__`が成功した後において、`with`の中で起こったエラーは、一旦`__exit__`で補足される。第二引数以降にエラーのデータが入る。

## 関数デコレータ

- 既存の関数のコードを全く変更せずに、関数の振る舞いを変更するためのもの。
- コピペを減らし、コードの見通しを良くする効果がある。
- React の HOC と同じ動き

### デコレータのテンプレート

```py
from flask import session
from functools import wraps

def check_logged_in(func):
    # このデコレータは、様々な問題を自動で解決してくれる、おまじないと思え
    @wraps(func)
    def wrapper(*args, **kwargs):
        # 前処理

        # デコレートされる関数を呼び出す場合の処理をここに書く
        # 必要なら値を返す
        if true:
          func()
          return 'some thing'

        # デコレートされる関数を呼び出さない場合の処理をここに書く
        # 必要なら値を返す
        return 'another thing'

    return wrapper
```

```py
@check_logged_in
def some_func():
  pass
```

### デコレータ作成時の注意

- デコレータはデコレートされる関数と同じシグネチャを持たなければならない。よって、ジェネリクス型関数にする。
- `wrapper`という名前は慣習なので変えるな。

## 例外処理

- Python は、実行時に問題が発生すると Exception（例外）を投げる。
- 例外は階層化されている
- 全ての例外は`Exception`クラスを継承している

[Built-in Exeptions の一覧](https://docs.python.org/3/library/exceptions.html)

### try-except

- 例外が発生する可能性のあるコードは`try`で囲み、`except`でエラーを補足する。
- 全補足を行うときは、単に`except:`とせず、Exception クラスと`as err`を使ってエラーを正しく報告すること

```py
try:
    with open('dummy.txt') as file:
        print(file.read())
except FileNotFoundError:
    print('ファイルが見つかりません')
except PermissionError:
    print('権限がありません')
# 全補足する場合は、Exceptionで拾って適切に処理すること
except Exception as err:
    print('未知のエラー: ', err)
```

### カスタム例外

- カスタム例外は、`Exception`クラスを継承することで簡単に作成できる。
- 文脈に応じてより具体的な例外を定義したり、特定の事柄に寄り過ぎた例外を抽象化する場合などに使う。

```py
class MyCustomError(Exceptin):
  pass

try:
  raise MyCustomError('カスタムエラーです')
except MyCustomError as err:
  print(err) # => 'カスタムエラーです'
```

## スレッド

- ある重たい処理を行う際、本スレッドの処理を止まらせることなく、別スレッドで実行する方法。
- 乱用すると誰もデバッグできないコードになるので注意する。

```py
from threading import Thread

t = Thread(target=some_func, args=(arg1, arg2))
t.start()

print('tがどんなに重たい処理でもここは即時に実行される')
```
