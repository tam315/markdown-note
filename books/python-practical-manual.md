# Python 実践入門

要所のみ抜粋

[[toc]]

## はじめに

### PEP

- PEP --- Python Enhancement Proposal
- PEP8 --- スタイルガイド
- PEP20 --- 設計ガイドライン
- PEP257 --- ドキュメントの書き方

### 対話モードでよく使う関数

- `type()` --- 型を調べる
- `dir()` --- 属性を調べる
- `help()` --- ヘルプページを表示する

## 制御フロー

- JavaScript と異なり、空のコンテナオブジェクトは偽となる
- `==`,`!=`は等価性の評価、`is`と`is not`は同一性の評価
- `for`文で使った変数は外に漏れ出すので注意
- `for`や`while`でも`else`が使えるが利用頻度は低いかも
- セイウチ演算子は記述が簡単になる場合にのみ使うこと
- `try-except-else-finally`文
  - `try`ブロックはなるべく短く保つ
  - `except`
    - 補足したい例外のみを明示的に指定すること
    - このブロックで引数なしで`raise`すると、受け取った例外をそのまま再送出する
  - `else`
    - 例外が発生しなかったときのみ実行される
    - `except`があるときのみ使える
- 独自の例外を作るには、モジュールごとに 1 つの基底クラスを作成し、それを継承して各例外を作るとよい。

## データ構造

- None はシングルトンである
- 数値
  - `int`,`float`,`complex`がある
  - `_`は単に無視される
  - 整数の制度に制限はない
  - 無限大は`float('inf')`又は`float('-inf')`
  - 数値として扱えないものは`float('nan')`
  - float 型で比較するときは適宜`round()`や`math.isclose()`や`Decimal`を使う
- 文字列
  - `('abc' 'def')`で文字列を連結できる。改行も挟める。`+`等は不要。
  - 文字列はイテラブルである
  - `f'{title=}'`のようにすることでデバック用のプリントができる
- 辞書
  - キーに使えるのは不変オブジェクトのみ(文字列、数値、タプルなど)
- 集合
  - frozenset --- 不変な集合
  - 和集合 `set_a | set_b`
  - 差集合 `set_a - set_b`
  - 積集合 `set_a & set_b`
  - 対称差 `set_a ^ set_b` (重複しない部分)
- 内包表記
  - 変数のスコープを閉じられるメリットがある
  - 可読性が落ちるのでネストして使わない

## 関数

- 引数
  - parameter --- 仮引数
  - argument --- 実引数
  - 引数のデフォルト値に可変オブジェクトを使うとバグのもとになる
    - 理由は、デフォルト値は関数定義時の一度しか評価されないため
    - 代わりに None を使いブロック内部で値をセットすること
  - 可変長引数は乱用するな、読みにくくなる
  - 位置のみ引数 `/`
  - キーワードのみ引数 `*`
- lambda の使用は簡潔に書ける場合にとどめる
- 型情報の付与 `var_a: int`

## クラスとインスタンス

- `__new__`がコンストラクタ
  - どうしても必要なとき以外は利用するな
- `__init__`はイニシャライザ
- プライベート API
  - 1 つや 2 つのアンダースコアから始まる属性は、いずれもアクセスしようと思えばできる
  - これらの属性にはアクセスしないのが利用者としてのよい心がけである
- クラス変数は「インスタンス変数の初期値」とも言える
- クラスメソッドはインスタンスからも呼び出せる
- スタティックメソッド
  - クラスに含める必要性はあまりないかも
  - モジュール内で定義された関数であれば、`os.open()`のようにわかりやすい名前が利用できる
  - なので、関数ですむなら関数にしておいたほうがシンプルで可読性が高い
- 多重継承の呼び出し順は`__mro__`で確認できる
  - そもそも多重継承するな

## モジュール

- python ファイル = スクリプト = モジュール
  - python コマンドで直接実行する場合はスクリプトと呼ぶ
  - import して使う場合はモジュールと呼ぶ
  - これらの言葉にたいした違いはない
- モジュールとは
  - `module`クラスインスタンスである
  - モジュールのトップレベルでアクセス可能なオブジェクトを属性として持っている
- `__name__`の値
  - python コマンドにより直接実行された場合 => `__main__`
  - import された場合 => モジュール名

## パッケージ

- 複数のモジュールをまとめる機能
- `__init__.py`
  - パッケージの目印(マーカーファイル)となる
  - パッケージの初期化を行う(インポート時に実行される)
  - `__init__.py`のトップレベルにある属性は、`パッケージ名.属性名`で参照できる
- 相対インポートを使って上位階層の変更に強くなれ
- ワイルドカードインポート
  - 一般的には可読性が下がるのでなるべく使わない。
  - ただしライブラリを作成する場合はどは別で、下記のように使うと便利
    - サブモジュールで`__all__`を定義して対象を定義する
    - `__init__.py`でワイルドカードインポートを使う
    - これによりサブモジュール更新時に`__init__.py`の更新が不要となる
- ビルトインモジュールや標準ライブラリと同じ名前のモジュールは作るな、トラブルのもと

## 名前空間

- 名前空間が作成されるタイミングはいろいろ
  - Python 起動時 --- 組み込みオブジェクトの名前空間
  - モジュールの読み込み時 --- モジュールごとのグローバルな名前空間
  - 関数の呼び出し時 --- 関数のローカルな名前空間
  - クラス定義時 --- クラスの名前空間
- 名前空間をうまく使ってオブジェクトを集約・分離することで保守性の高いプログラムになる

## スコープ

- ローカルスコープ
  - 関数内と内包表記内
  - `locals()`で参照できる
  - ここでグローバル変数への代入を行うと新しいオブジェクトになる
- エンクロージングスコープ
  - 関数を囲んでいる関数内
- グローバルスコープ
  - モジュールのトップレベル
  - `globals()`で参照できる
- ビルトインスコープ

## 組み込み関数

- `isinstance()`
- `issubclass()`
- `hasattr()`
- `getattr()` --- 多用するな
- `setattr()` --- 多用するな
- `delattr()` --- 多用するな
- `zip()` --- 複数のイテラブルを受け取りタプルのイテラブルにして返す
- `sorted()` --- 並べ替えた新しいオブジェクトを返す
- `filter()`
- `map()`
- `all()`
- `any()`

## 特殊メソッド

- ダンダーメソッド
- `__str__()`
  - ユーザーフレンドリーな文字列として利用されることを想定
- `__repr__()`
  - デバッグなどに役立つ情報を提供する
  - オブジェクトを再現するために有効な式にするとよい
  - `__str__()`が実装されていない場合はこちらが優先されるので、こちらから実装するとよい
- `__call__()`
  - これを実装したクラスのインスタンスは関数のように呼び出せる

### 属性への動的なアクセス

- `__dict__` --- インスタンスの名前空間は実際にはこの辞書である
- `__setattr__()` --- 属性への代入で呼び出される
- `__delattr__()` --- 属性の削除で呼び出される
- `__getattr__()` --- 属性の取得で`__dict__`に存在しないときだけ呼び出される
- `__getattribute__()` --- 属性の取得で必ず呼び出される

### イテラブルなオブジェクトとして振る舞うには

1. `__iter__()` --- イテレータを返す
2. `__next__()` --- 次の要素を返す

イテラブルは 1 を備え、イテレータは 1 と 2 の両方を備える。
for 文などでは、まずイテラブルの`__iter__()`でイテレータを取得し、
イテレータの`__next()__`を何度も呼ぶことで次々と値を取得していく。

### コンテナオブジェクトとして振る舞うには

- `__getitem__()`, `__setitem__()`
  - インデックスやキーでのアクセス時に呼び出される
- `__contains__()`
  - オブジェクトの有無を判定する

## Python の様々な機能

### ジェネレータ

- リスト等と異なり、イテレーションごとに逐次データを生成するため効率的
- 値を無限に返したいときや大きなデータを扱いたいときに特に有効
- リストは積極的にジェネレータに書き換えるとよい
- 生成方法
  - ジェネレータ関数を使う方法 --- `yield`
    - サブジェネレータを使う方法 --- `yield from`
  - ジェネレータ式を使う方法 --- `[]`のかわりに`()`を使う
- 注意事項
  - 長さを求めたいときや複数回利用したいときは、一旦`list`にする
  - ただし巨大なジェネレータを`list`にするとハングする

### デコレータ

- 使用場面
  - 関数の引数チェック
  - 関数の呼び出し結果のキャッシュ
  - 関数の実行時間の計測
  - Web API でのハンドラの登録　など
- `functools.lru_cache()` --- キャッシュする
- `dataclasses.dataclass()` --- データを持つ典型的なクラスの処理を自動追加する
- 作り方
  - 自前で作らずに`functools.wraps()`を使ってつくるとよい

### コンテキストマネージャー

- ある処理の前処理、後処理をまとめて、再利用可能にするためのもの
- `__enter__()`と`__exit__()`をもつ
- `contextlib.contextmanager`を使うとエレガントに実装できる

### デスクリプタ

- 属性に関する処理を再利用可能にするもの
- 詳細はようわからん

## 並行処理

省略

## ユニットテスト

- `unittest.TestCase`を継承しておこなう
- `setUp()` 各テストケースの前に実行される
- `tearDown()` 各テストケースの後に実行される
- モックとパッチをうまく使う
- `unittest.skip|skipIf`デコレータでテストをスキップできる
- `subTest()` サブテストを実行する
- コンテキストマネージャをテストするには`MagicMock`を使うとよい