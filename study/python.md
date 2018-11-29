# Python

[[toc]]

## 基本

### インストール

[こちらを参照](https://qiita.com/segur/items/23f276320216c3aa7cf7)

### ドキュメント

[https://docs.python.org/3/](https://docs.python.org/3/)

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

- ライブラリ -> モジュール(`os`, `datetime`など)の集まり。既定で用意されているものを標準ライブラリと呼ぶ。
- モジュール -> 関数の集まり

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

### 制御

#### for

python の文字列は**シーケンス**なので反復処理できる

```python
for i in [1,2,3]:
  print(i)
for l in "hello":
  print(l)
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

複雑なオブジェクトをきれいにコンソールに出力するには、`pprint()`を使う。

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

#### str()

オブジェクトを文字列にして返す

### dunder name dunder main

`__name__`オブジェクトには、下記の値が入る

- そのコードが、Python で直接実行されたとき=>`__main__`
- そのコードが、モジュールとしてインポートされたとき=>モジュール名

下記のコードは'dunder name dunder main'と呼ばれる

```py
if __name__ == '__main__':
  do_something()
```

## リストデータ

- 順序は保証される

```python
# リテラルで作成
numbers = [1, 2, 3, 4, 5]

# ビルトイン関数で作成
list('john')

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

### リストメソッド

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

# 末尾の要素を削除する
numbers.pop()
```

### スライス表記

- `[開始値, 終了値, 刻み]`の表記をスライス表記という。いずれも省略可。
- 非破壊的にリストの要素を抽出できる
- リスト以外も含むあらゆるシーケンスからスライスできる

```python
numbers[0:5:2]
numbers[::1]
numbers[1::2]
```

### for とリスト

for はリストやスライスを理解できるので、そのまま渡してやることができる。

## 構造化データ

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
dict = {'e': 0, 'd': 0, 'c': 0, 'b': 0, 'a': 0}
dict.items() # => [('e', 0), ('d', 0), ('c', 0), ('b', 0), ('a', 0)]

for key, value in some_dict.items():
# or
for key, value in sorted(some_dict.items()):
```

`setdefault()` キーが未初期化だった場合に初期化を行う

```python
dict.setdefault('somekey', 'somevalue')

# これは下記と等価
if 'somekey' not in dict:
  dict['somekey'] = 'somevalue'
```

### Set

- Set(集合)とは、ユニークな値のあつまりのこと
- 差集合、積集合、和集合などの操作を行うことができる
- 順序は保証されない

```python
# リテラルで作成
vowels1 = {'a', 'e', 'e', 'i', 'o', 'u', 'u'}

# ビルトイン関数で作成
vowels2 = set('aeeiouu')
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

### その他

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

### Docstring

- `"""`を使って docstring(heredoc)を書く。
- 複数行に渡って書くことができる。

### Annotation

アノテーションは、人間が楽にコードを読めるようにするためのもの。
Python はアノテーションを完全に無視する。
書いたからといって型チェック等が行われるわけではない。

```python
def search_for_vowels(word: str) -> set:
```

### 引数のデフォルト値

```python
def search_for_vowels(word: str = "aeiou") -> set:
```

### キーワードでの引数の受け渡し

キーワードでの引数の受け渡しを使うと、順番を気にせずに引数を渡すことができる。

```python
def search_for_vowels(word, letter) -> set:
  do_something()

search_for_vowels(letter='letter', word='word')
```

#### dictionary を展開して引数を渡す

`**some_dict`を使うと、辞書の中身を分解して、キーワードとして引数を渡せる

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

### 参照渡し・値渡し

- Python の変数は全て「オブジェクト参照（メモリアドレス）」である
- つまり、変数に格納されるのは、メモリアドレス
- つまり、関数に渡されるのは、メモリアドレス

関数では、アドレスの参照先の型によって下記の処理を行う

- 可変値（List, Dictionary, Set）なら参照渡し
- 不変値（String, Integer, Tuple）なら値渡し

ただし、関数内で**代入文**を使う場合は注意が必要である。代入文では、右辺の値が、**新たな変数**として左辺に代入されるので、意図しない結果になる場合がある。

```py
def update(arg):
    arg = ['new data']

mutable = [0, 1, 2]
update(mutable)
print(mutable)  # => [0, 1, 2] wtf?
```

```py
def update(arg):
    arg.append('new data')

mutable = [0, 1, 2]
update(mutable)
print(mutable)  # => [0, 1, 2, 'new data']
```

### スコープ

関数はスコープを形成するので、外部から関数内の変数にはアクセスできない。ただし、関数内内から外部の変数にはアクセスできる。

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

### デコレータ

既存の関数のコードを変更することなく、機能を追加する構文。

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

### フォームデータへのアクセス

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
  content = tasks.readlines() # 文字列のリストとして一気に読み込む
```

## データベース

- `DB-API` は Python でリレーショナルデータベースを扱うモジュールに求められる仕様のことである。
- この仕様に沿って、各ドライバは作成されている。

```txt
Python Code <-> DB-API（に準拠したドライバ） <-> Database Specific Logic <-> DB
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

### メソッド呼び出しのし動き

- クラスインスタンスからメソッドを呼び出したとき、下記のような変換が行われる。
- メソッドの定義が、`def some_func(self)`のように self を取る様になっているのはこのためである。

```py
a = CountFromBy()

a.increase()
# これは下記と等価
CountFromBy.increase(a)
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
