# Dataquest

[[toc]]

## 2-1 Pandas and NumPy Fundamentals

### Introduction to NumPy

NumPy はデータを ndarray(n-dimensional array)で持っている

```py
data_ndarray = np.array([10, 20, 30])
```

- なぜ ndarray が分析を楽にするのか
  - CPU の SIMD(Single Instruction Multiple Data)を使って高速に計算できるから
  - このように複数のデータを一度に操作することを Vectorization(ベクトル化)という

### Exploring Data with pandas: Fundamentals

- ベクトル計算のメリット
  - パフォーマンスに優れる
  - 計算処理の記述が簡素になる (`series_a - series_b`など)
- 統計関数を使うと便利
  - `(dataframe|series).max()`
  - `(dataframe|series).min()`
  - `(dataframe|series).mean()`
  - `(dataframe|series).median()`
  - `(dataframe|series).mode()`
  - `(dataframe|series).sum()`
- `series.value_counts()` --- ユニークな値とその出現数を取得する
- `series.describe()` --- 下記を取得する
  - null でない値の個数
  - 平均、最大値、出現頻度など

### Exploring Data with pandas: Intermediate

- 明示的に NaN をセットしたいときは`np.nan`を使う
- インデックス列を列番号で指定する方法
  - `pd.read_csv('some.csv', index_col=0)`
  - 指定しなければ連番がセットされる
- インデックス「名」を削除する
  - `df.index.name = None`
- インデックス|カラムによる選択を行う
  - `df.loc[]`
- 位置による選択を行う
  - `df.iloc[]`
- null であるものを抽出する
  - `df.isnull()`
  - `df.notnull()`
  - `series.isnull()`
  - `series.notnull()`
- boolean index を組み合わせて使う
  ```py
  is_john = df['name'] == 'john'
  adult = df['age'] > 18
  df[is_john & adult] # and
  df[is_john & ~adult] # not
  df[is_john | adult] # or
  ```
- 並べ替える
  - `df.sort_index(ascending=False)`
  - `df.sort_values('age', ascending=False)`
- ユニークな値を配列として取得する
  - `df['firstname'].unique()`

### Data Cleaning Basics

#### データを俯瞰する

まず`df.info()`により、カラム名、格納されているデータの数と種類などを俯瞰する

#### カラム名を整理する

カラム名の変更は`df.columns`を置き換えることにより行う

- 記号を削除するか置き換える --- `str.replace()`
- 先頭・末尾のスペースを削除する --- `str.strip()`
- スペースをアンダーバーで置き換える --- `str.replace()`
- 大文字を小文字にする --- `str.lower()`
- 長い名前を短い名前にする --- `str.replace()`

#### データの俯瞰

- `df.describe()`でデータを俯瞰したうえで下記を抽出する
  - 数値がテキストとして格納されていないか --- あれば修正する(後述)
  - 値が 1 種類しかない無用な列はないか --- あれば削除を検討する `df.drop(['colname'], axis=1)`
  - より詳しい調査が必要な列はどれか --- あれば調査する

#### 必要に応じて文字列列を数値列にする

- 列ごとに値のパターンと例外を調べる
  - `Series.dtype`
  - `Series.unique()`
- non-digit な部分を取り除く
  - [Vectorized string method](https://pandas.pydata.org/pandas-docs/stable/user_guide/text.html#method-summary)を用いて行う
  - `Series.str.replace('GB','')`など
- 型を変換する
  - `Series.astype(float)`
- 必要に応じてカラム名を変更する（各セルに含まれていた`GB`のような単位情報を付与するなど）
  - `df.rename({'ram':'ram_gb'}, axis='columns', inplace=True)`

#### 文字列列を整理する

- 必要があれば文字列の一部を使って新しい列を作成する
  ```py
  # `cpu`列に`Intel Core i5 2.3GHz`のような値が格納されている場合
  laptops["cpu_manufacturer"] = (
      laptops["cpu"].str.split().str[0]
  )
  ```
- 表記のゆらぎを修正する
  - `s.value_counts()`
  - `s.map({'wrong': 'correct'})` --- マップにはすべての値を含める必要があるので注意する
- 文字列の一部を抜き出す
  - `2016-03-26 17:47:46`という形式の列から日付を抜き出すには`autos['date_crawled'].str[:10]`

#### 日付列

- 日付データを扱う時の下準備
  - `df['mydate'] = pd.to_datetime(df['mydate'])`

#### 外れ値

- あまりにも大きい or 小さい値を除外する
- よく使うメソッド
  - 何種類の値があるか --- `Series.unique().shape`
  - 最大値、最小値、中央値、平均値はどうか --- `Series.describe()`
  - 出現頻度が高すぎる値はないか --- `Series.value_counts().head()`
  - 出現頻度が低すぎる値はないか --- `Series.value_counts().sort_values(ascending=False).head()`
  - 値の分布を％で見て不自然なところはないか --- `Series.value_counts(normalize=True, dropna=False)`
- 除外する際は`.between()`で boolean index を作ると、読みやすくて便利。
  - `df[df["col"].between(x,y)]`

#### 欠損値の処理

```py
# 欠損値の数を把握する
df.isnull().sum()

# 欠損値の出現数を確認する
df['os_version'].value_counts(dropna=False)

# 欠損値のある行に関連する他の列の値を見る。
# その結果に応じて、欠損値の値を埋めたり、そのままにするかを決める。
df.loc[df["os_version"].isnull(), "os"].value_counts()
```

- 対応方法 1: 欠損値を含む行や列を削除する
  - `df.dropna(axis=0)`
  - `df.dropna(axis=1)`
- 対応方法 2: 値を埋める
- 対応方法 3: 何もしない

#### 値の種類が多すぎる列の削除

`df.describe(include='all')`したときに、freq が count に限りなく近い場合、無意味なデータではないか確認する。

### Guided Project: Exploring Ebay Car Sales Data

#### 集計

例えばブランドごとの価格の中央値を算出したいとき

```py
top20_brands = autos['brand'].value_counts()[:20]
brand_mean_prices = {}
for brand in top20_brands.index:
    mean = autos.loc[autos['brand']==brand, 'price'].mean()
    brand_mean_prices[brand]=mean
```

このままでは扱いにくいのでシリーズにしてから使う

```py
pd.Series(
    brand_mean_prices,
    name="mean_price",
)
```

## 2-2 Exploratory Data Visualization

### Line Charts

グラフの描写には`matprotlib.pyplot`を使う。

- データを使って plot を作成する
- plot の見た目を調整する
- plot を表示する
- 満足するまで繰り返す

```py
# データをセット(x_values, y_values)
plt.plot(df['DATE'], df['VALUE'])

# ラベルの回転角度
plt.xticks(rotation=90)

# ラベル
plt.xlabel('Month')
plt.ylabel('Unemployment Rate')

# タイトル
plt.title('Monthly Unemployment Trends, 1948')

# グラフの描写
plt.show()
```

### Multiple plots

#### matplotlib のクラスを理解する

[参考](https://matplotlib.org/1.5.1/faq/usage_faq.html#parts-of-a-figure)

- Figure Object
  - `plt.figure()`で作成する
  - 一番親玉のコンテナであり、複数の Axes を内包する
  - 描写領域を確保する
  - dpi、背景色、線色などを管理する
- Axes Object
  - `figure.add_subplot(縦分割数, 横分割数, 分割した何番目に配置するか)`で作成する
  - 実際のデータを描写する
  - データ、軸、軸ラベルなどを持つ
  - `axes.plot(x_values, y_values)`でデータをプロットする

#### 手動でグラフを作る

- `plt.plot()`を使った場合は自動的に figure と axes が作成されているが、カスタマイズ等する場合はこれらを手動で作る必要がある
- `plt.plot()`の実体は`axes.plot()`である
- axes を手動で生成したとき、デフォルトでは
  - x 軸 y 軸ともに値のレンジが 0 から 1 になる
  - グリッドラインは表示されない
  - データは表示されない

```py
fig = plt.figure()
ax1 = fig.add_subplot(2,1,1)
ax2 = fig.add_subplot(2,1,2)

ax1.plot(unrate[0:12]['DATE'], unrate[0:12]['VALUE'])
ax2.plot(unrate[12:24]['DATE'], unrate[12:24]['VALUE'])

ax1.set_xlabel('...') # .xlabel()ではない点に注意
ax1.set_ylabel('...')

plt.show()
```

#### 複数のデータを同じ axes に描写する

- `plt.figure()`
  - 複数回呼んでも figure は一つしか作られない
- `plt.plot()`
  - 初回 --- axes を作成したうえでラインを追加する
  - 2 回目以降 --- 初回に作成した axes にラインを追加する

これらを踏まえると、下記の手順が一番効率的である。

```py
plt.figure(figsize=(5,3)) # サイズ指定などのカスタマイズはここで行える
plt.plot(...)
plt.plot(...)
plt.plot(...)
plt.show()

# 上記は下記と等価。こっちのほうが読みやすいかも？
fig = plt.figure(figsize=(5,3))
axes = fig.add_subplot(1,1,1)
axes.plot(...)
axes.plot(...)
plt.show()

# figureとaxesを同時に作る方法もある(subplots())
figure, axes = plt.subplots()
```

#### Figure のサイズ調整

```py
# インチで指定
plt.figure(figsize=(12, 5))
```

#### 色の指定

```py
plt.plot(c='red')
```

#### 凡例

```py
plt.plot(label='1948')
plt.legend(loc='upper left')
```

### Bar Plots And Scatter Plots

#### 棒グラフ

- 棒グラフに適するもの
  - クラス分け x 数値
  - クラスが多すぎると見にくくなるので注意
- 縦棒グラフなら`axes.bar()`、横棒グラフなら`axes.barh()`を使う
- 以下、縦棒グラフの場合で説明

```py
# バーの開始位置
# => [0.75, 1.75, 2.75, 3.75, 4.75]
from numpy import arange
bar_positions = arange(5) + 0.75

# 実際に表示するデータ群
bar_height = [2,5,3,5,7]

# バーの幅
bar_width = 0.5

# バーを表示する
axes.bar(bar_positions, bar_height, bar_width)
```

#### 軸ラベル

```py
# X軸ラベルの位置を数値の配列で指定
axes.set_xticks([1,2,3,4,5])

# X軸ラベルに表示する値を指定
axes.set_xticklabels(['a','b','c','d','e'], rotation=90)
```

#### 散布図

```py
axes.scatter(x_values, y_values)

# X軸とY軸の下限、上限をセットする
axes.set_xlim(0, 5)
axes.set_ylim(0, 5)
```
