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

### 慣習

- 文字列はシングルクオートで囲む（`'`のエスケープが必要なときはダブルでも OK）

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
# リストと結合
''.join(['a','b','c'])
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
my_tuple = ('single',)

# ビルトインファンクションで作る
my_tuple = tuple('aeiou')
```

### その他

複雑なオブジェクトをきれいにコンソールに出力するには、`pprint()`を使う。

```python
import pprint
pprint.pprint(some_ugly_dictionary)
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
