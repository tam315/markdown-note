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
- `series.describe()` --- 統計情報を取得する
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

- `df.describe()`で統計情報を俯瞰したうえで下記を抽出する
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
# 列ごとの欠損値数を把握する
df.isnull().sum()

# 特定の列における欠損値の出現数を確認する
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

### 基本

グラフの描写には`matprotlib.pyplot`を使う。

- データを使って plot を作成する
- plot の見た目を調整する
- plot を表示する
- 満足するまで繰り返す

```py
import matprotlib.pyplot as plt

# データをセット(折れ線グラフの場合)
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

### Line Charts(折れ線グラフ)

- 「連続値(日時等) × 数値」のデータに最適
- 変化を見る

```py
# (x_values, y_values)
plt.plot(df['DATE'], df['VALUE'])
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
  - `axes.plot(x_values, y_values)`でデータをプロットする(`plt.plot()`の実体である)

#### 手動でグラフを作る

- `plt.plot()`を使った場合は自動的に figure と axes が作成されているが、カスタマイズ等する場合はこれらを手動で作る必要がある
- axes を手動で生成したとき、デフォルトでは
  - x 軸 y 軸ともに値のレンジが 0 から 1 になる
  - グリッドラインは表示されない
  - データは表示されない

```py
fig = plt.figure()
ax1 = fig.add_subplot(2,1,1)
ax2 = fig.add_subplot(2,1,2)

# figureとaxesを同時に作る方法もある
# fig, ax = plt.subplots()
# fig, axs = plt.subplots(2, 2)

ax1.plot(x_values1, y_values1)
ax2.plot(x_values2, y_values2)

ax1.set_xlabel('...') # .xlabel()ではない点に注意
ax1.set_ylabel('...') # .ylabel()ではない点に注意
ax1.set_title('...') # .title()ではない点に注意

plt.show()
```

#### 複数のデータを同じ axes に描写する

- `plt.figure()`
  - 複数回呼んでも figure は一つしか作られない
- `plt.plot()`
  - 初回 --- axes を作成したうえでラインを追加する
  - 2 回目以降 --- 初回に作成した axes にラインを追加する

上記を踏まえると、下記のようにグラフを描写できる。

```py
plt.figure(figsize=(5,3)) # サイズ指定などのカスタマイズはここで行える
plt.plot(...)
plt.plot(...)
plt.plot(...)
plt.show()

# だけど、こっちのほうが明示的で読みやすいかも？
fig = plt.figure(figsize=(5,3))
axes = fig.add_subplot(1,1,1)
axes.plot(...)
axes.plot(...)
plt.show()
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

### Bar Plots(棒グラフ)

- 「クラス(離散値) × 数値」のデータに最適
- クラスをまたいで最大値、最小値などを比較するために使う
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

# X軸ラベルの位置を数値の配列で指定
axes.set_xticks([1,2,3,4,5])

# X軸ラベルに表示する値を指定
axes.set_xticklabels(['a','b','c','d','e'], rotation=90)

# バーを表示する
axes.bar(bar_positions, bar_height, bar_width)
```

### Scatter Plots(散布図)

- 「数値 × 数値」のデータに最適
- 相関を調べるのに使う

```py
axes.scatter(x_values, y_values)

# X軸とY軸の下限、上限をセットする
axes.set_xlim(0, 5)
axes.set_ylim(0, 5)
```

### Histograms(ヒストグラム)

- ヒストグラム --- 値の区切り(bin)を作って、そこに含まれるデータの数を観察する

|                    | ヒストグラム     | 棒グラフ       |
| ------------------ | ---------------- | -------------- |
| 目的               | 連続値の視覚化   | 離散値の視覚化 |
| X 軸上のバーの位置 | 重要な意味を持つ | 意味を持たない |

```py
axes.hist(
  values,
  bins=20, # 区切りの数
  range=(0,5), # 横軸(値)の表示範囲
)
axes.set_ylim(0, 100) # 縦軸（出現数）の表示範囲
```

### Box Plots(ボックスプロット)

- 値がどのように分布しているかを把握するために使う
- box-and-whisker(箱とひげ)を用いて四分位でデータ表現する([参考図](https://www.simplypsychology.org/boxplots.html))
- box で表現される真ん中の二分位を interquartile range または **IQR** という
- ボックスの長さ(IQR)と髭の長さを比べることで、分布の様子がわかる
- ひげの書き方には[変種がある](https://ja.wikipedia.org/wiki/%E7%AE%B1%E3%81%B2%E3%81%92%E5%9B%B3)。デフォルトでは後者で描写される。
  - 方法 1：最小値と最大値をひげの端にする
  - 方法 2：第 1or 第 3 四分位点から 1.5IQR 以上離れた値を外れ値(**outlier**, extreme values)とし、残った値の端をひげの端とする

```py
values = [2,3,4,5,2,2,3,5]
axes.boxplot(values)
axes.set_ylim(0, 5)
axes.set_xticklabels(['some label'])

# 一つのaxis内に複数のbox plotを並べたいときは、
# DataFrame.values を使ってarray of arrayにして値を渡す
target_columns = ['RT_user_norm', 'Metacritic_user_nom', 'IMDB_norm', 'Fandango_Ratingvalue']
values = df[target_columns].values # => [[1,2,3,4], [2,1,3,4],,,,]
axes.boxplot(values)
axes.set_xticklabels(target_columns)
```

### Guided Project: Visualizing Earnings Based On College Majors

#### DataFrame から直接グラフを作る方法

- DataFrame や Series を基にしてグラフを描写できる
- matplotlib を直接使うときと異なり、多くの設定を省略できる
- カスタマイズが必要な場合は axes をいじることで行う

```py
# セットアップ
%matplotlib inline

# 散布図
axes = df.plot(
  x='column1',
  y='column2',
  kind='scatter',
  title='Employed vs. Unemployed',
  figsize=(5,10),
)

# 棒グラフ
axes = df['column1'].plot(kind='bar')
axes = df.plot.bar(x='column1', y='column2')

# ヒストグラム
axes = df['column1'].hist()
```

#### Scatter matrix

- 複数の列に関して、ヒストグラムと散布図を[ひと目で俯瞰できる図](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.plotting.scatter_matrix.html)

```py
from pandas.plotting import scatter_matrix
scatter_matrix(df[['Age','Weight','Sex']], figsize=(10,10))
```

## 2-3 Storytelling Through Data Visualization

### Improving Plot Aesthetics

見やすいグラフに必要なこと

- **良いグラフは、説明するのではなく比較を促す**
- 注目したいデータと対になるデータを追加する
  - 政党支持率だけでなく不支持率も合わせて表記するなど
- 不要な要素(chartjunk)を[取り除く](https://www.darkhorseanalytics.com/blog/data-looks-better-naked)
- [data-ink ratio](https://infovis-wiki.net/wiki/Data-Ink_Ratio) を高める
  - data-ink とは、折れ線グラフなら線、散布図なら点の部分。それ以外の要素をなるべく減らせ。
- non data-ink の部分に一貫性を持たせ、比較を容易にすること
  - 例えば上限値・下限値を揃えるなど

#### tick mark(棘)を消す

```py
axes.tick_params(
    bottom='off',
    top='off',
    left='off',
    right='off',
    # ラベルを消したい時は`label`をつける
    labelbottom='off'
)
```

#### spine(軸線)を消す

spines は dict で管理されている。それぞれで`set_visible()`を実行する。

```py
print(axes.spines)
# {'bottom': <matplotlib.spines.Spine object at 0x7fcaa3476ac8>,
# 'top': <matplotlib.spines.Spine object at 0x7fcaa2f534e0>,
# 'right': <matplotlib.spines.Spine object at 0x7fcaa34762b0>,
# 'left': <matplotlib.spines.Spine object at 0x7fcaa3476390>}
for spine in axes.spines.values():
    spine.set_visible(False)
```

### Color, Layout, and Annotations

- **Color Blind 10** など[色盲に配慮した配色](http://tableaufriction.blogspot.com/2012/11/finally-you-can-use-tableau-data-colors.html)にする
- 線は適度に太くする

```py
ax.plot(
  # 色
  c=(255/255, 128/255, 14/255),
  # 先の太さ
  linewidth=3
)
```

- 凡例は実データのすぐそばに書く(x, y はデータの値で指定する)

```py
ax.text(x, y, "Starting Point")
```

- 補助線を入れる

```py
ax.axhline(
  50, # y軸上の位置
  c=(171/255, 171/255, 171/255),
  alpha=0.3)
```

### Guided Project: Visualizing The Gender Gap In College Degrees

画像ファイルとして出力する

```py
plt.savefig('biology_degrees.png')
```

### Conditional Plots

- seaborn とは matplotlib のラッパー
- matplotlib を直接使う場合と比べて、楽にきれいなグラフを作ることができる。
- seaborn では null の値はエラーになるので取り除いておくこと

#### Histogram & kernel density plot

```py
import seaborn as sns
import matplotlib.pyplot as plt

# Histogram & kernel density plot
sns.distplot(df["MyColumn"])

# kernel density plotのみ
sns.kdeplot(
  titanic["Age"],
  shade=True, # 塗りつぶしたい場合
)

plt.show()
```

- [スタイル](http://keisanbutsuriya.hateblo.jp/entry/2016/06/01/021943)を設定できる
- data-ink ratio を上げるためのおすすめ設定は以下の通り

```py
# 白背景にする
sns.set_style("white")
# 全てのspineを消す(デフォルトでは左と下は残る)
sns.despine(left=True, bottom=True)
```

#### FacetGrid

- クラス分けにより分割した複数のデータサブセットを元に複数のグラフを作るには`FacetGrid`を使う
  - はじめから data-ink ratio の高いグラフが生成される
  - 目盛りがあらかじめ統一されている
- `FacetGrid`
  - 第一引数: DataFrame
  - `col`: クラス分けに使用する列名(この列のユニークな値の数だけグラフが作られる)
  - `size`: グラフの高さ
- `FacetGrid.map()`
  - 第一引数: matplotlib or seaborn の関数(`sns.kdeplot`,`plt.hist`など)
  - 第二引数: 列名

```py
# 1 つのクラス分けを使ってグラフを作る場合(横一列に並ぶ)
g = sns.FacetGrid(
  titanic,
  col="Survived",
  size=6)
# 2 つのクラス分けを使ってグラフを作る場合(縦横に並ぶ)
g = sns.FacetGrid(
  titanic,
  col="Survived",
  row="Pclass",
  size=12)
# 3 つのクラス分けを使ってグラフを作る場合(縦横に並んだうえで2つのグラフが重ねて表示される)
g = sns.FacetGrid(
  titanic,
  col="Survived",
  row="Pclass",
  hue="Sex",
  size=12).add_legend()

g.map(sns.kdeplot, "Age", shade=True)
```

### Visualizing Geographic Data

- 緯度経度の情報を二次元にマップするには`basemap toolkit`を使う
- これは Matplotlib の拡張で、緯度経度(球面座標)を平面座標(デカルト座標)にマップするためのもの

#### 散布図の描写

```py
basemap = Basemap(
  projection='merc', # メルカトル図法
  llcrnrlon=-180, # 左下の経度
  llcrnrlat=-80, # 左下の緯度
  urcrnrlon=180, # 右上の経度
  urcrnrlat=80, # 右上の緯度
)

# BasemapインスタンスはListしか受け付けないのであらかじめ変換しておく
longitudes = df["longitude"].tolist()
latitudes = df["latitude"].tolist()

# 平面座標に変換する
x_positions, y_positions = basemap(longitudes, latitudes)

# basemapはmatplotlibを使っているので
# カスタマイズはmaptplotlibと同じ方法で行える
plt.figure(figsize=(15,20))
plt.title("Scaled Up Earth With Coastlines")

# 海岸線を描写する
basemap.drawcoastlines()

# データを散布図として描写する
basemap.scatter(
  x_positions,
  y_positions,
  s=1, # マーカーのサイズ
)

plt.show()
```

#### 効率的な軌跡(great circle)の描写

マップの端をまたぐ軌跡や、差が 180 度を超える軌跡は描写できないので注意

```py
basemap.drawgreatcircle(
  start_lon,
  start_lat,
  end_lon,
  end_lat,
)
```

## 2-4 Data Cleaning and Analysis

### Data Aggregation

- Aggregation
  - グループ分けしたデータ群に対して統計処理を行うこと
  - 次元(列)が一つ減る
  - 列のユニークな値が行ラベルとなる
  - 行ごとの計算結果は単一となる
- Split - Apply - Combine

#### GroupBy オブジェクト

- DataFrame を抽象的にグループ分けしたもの
- 「抽象的」とは、GroupBy オブジェクトのメソッドが実行されるまで実際には何もしない、の意

```py
# GroupByオブジェクトの作成
grouped = df.groupby('Region')
# GroupByオブジェクトの作成(対象列を事前に絞り込む場合)
grouped = df.groupby('Region')['column1']
grouped = df.groupby('Region')[['column1', 'column2']]

# サブセットの取得　その1 (get_groupを使う方法)
df_asia = grouped.get_group('Asia')

# {グループした値: 「DataFrame上の行位置」の配列} の形式のdictを取得する
grouped.groups

# サブセットの取得　その2 (groupsを使う方法)
indexes = grouped.groups['North America']
df_asia = df.iloc[indexes]
```

#### 統計処理

- グループごとに統計処理を行いたい場合は以下の関数を使う
- 結果は以下のような Series か Dataframe になる
  - index --- 個々のグループ名　例：）「県」列でグルーピングしたなら「北海道、青森、秋田、、、、」
  - values --- 計算結果

```py
grouped.mean()
grouped.sum()
grouped.size() # 総数
grouped.count() # 列ごとの総数
grouped.min()
grouped.max()

# 複数の計算を同時に行いたい時はagg()を使う
grouped.agg(np.mean) # 結果はSeries
grouped.agg([np.mean, np.max]) # 結果はDataFrame
grouped.agg(my_custom_method) # カスタムの集計関数

def my_custom_method(group) -> pd.Series:
    return (group.max() - group.mean())
```

#### Pivot table

```py
pv = df.pivot_table(
    values='Weight', # 計算に使う列
    values=['Happiness Score', 'Family'], # 計算に使う列(複数の場合)
    index='Sex', # グルーピングに使う列
    aggfunc=np.mean, # 計算方法
    aggfunc=[np.mean, np.min , np.max], # 計算方法(複数の場合)
    margins=True, # 結果に「All」が追加される
)

# Pivot tableは単なるDataFrameなのでそのままグラフにできる
pv.plot(
    kind='barh',
    xlim=(0,10),
    title='Mean Happiness Scores by Region',
    legend=False,
)
```

### Combining Data With Pandas

#### concat

- DataFrame を水平・垂直方向に結合する方法 --- `pd.concat()`
- 3 つ以上の DataFrame を同時に結合できる
- 列名を頼りに垂直方向に結合する場合
  - inner join --- 共通する列だけが保持される
  - outer join --- すべての列が保持される(**デフォルト**)
- インデックスを頼りに水平方向に結合する場合
  - inner join --- インデックスが一致するものだけが保持される
  - outer join --- 全てのインデックスが保持される
- 欠損値は NaN になる
- `df.append()`は`pd.concat()`のショートカット

```py
# 縦方向に結合(デフォルト)
pd.contat([df1, df2, df3])

# 横方向に結合
pd.contat([df1, df2, df3], axis=1)
```

縦方向に結合するとインデックスが重複して無意味になる場合が多いので、リセットしておくと良い。

```py
pd.contat([df1, df2], ignore_index=True)
```

#### merge

- 下記の場合に最適な結合方法 --- `pd.merge()`
  - 巨大な DataFrame を**水平方向**に結合する
  - 高速に結合する
  - 柔軟に結合する
- 一度に処理できる DataFrame は 2 つまで
- `df.join()`は`pd.merge()`のショートカット

```py
pd.merge(
  left=df1,
  right=df2,

  on='my_id', # 特定のカラムを結合キーとして使う場合
  # or
  left_index = True, # インデックスを結合キーとして使う場合
  right_index = True, # インデックスを結合キーとして使う場合

  how='left', # 結合方法(inner, outer, left, right)
  suffixes=('_1', '_2') # 列名が重複したときに末尾に追加したい文字列
)
```

### Transforming Data With Pandas

#### element-wise(要素ごと)

- `Series.map()` --- 関数に引数を与える必要がない時
- `Series.apply()` --- 関数に引数を与える必要がある時
- `DataFrame.applymap()` --- DataFrame の複数列に一括して`map`を使いたいとき

```py
def label(age):
    if age > 18:
        return 'Adult'
    else:
        return 'Child'

age_series.map(label) # -> 結果はSeriesで返ってくる

# DataFrameの複数列に一括して`map`したいとき
df['column1','column2'].applymap(label) # -> 結果はDataFrameで返ってくる
```

```py
def label(age, boundary):
    if age > boundary:
        return 'High'
    else:
        return 'Low'

age_series.apply(label, boundary=80) # applyでは引数を与えられる
```

#### row|column-wise(行ごと or 軸ごと)

- `DataFrame.apply`を使う
- データフレームの軸方向に順に処理を行う
- column-wise で使うことが多い
- デフォルトでは列方向に順に処理を行い、結果を DataFrame で返す
- 与える関数は「Series に対して動作する関数」である必要がある
  - 「element-wise（個々の要素に対して）に動作する関数」を与えると当然エラーになる

```py
df.apply(pd.value_counts)
```

#### pd.melt

- パフォーマンス的な面から、`df.apply`よりも Vectorized Method を優先して使用する
- pd.melt をうまく使うことでベクトル計算が可能になる場合がある

|     | Country     | Happiness Score | Economy | Family  | Health  |
| --- | ----------- | --------------- | ------- | ------- | ------- |
| 0   | Switzerland | 7.587           | 1.39651 | 1.34951 | 0.94143 |
| 1   | Iceland     | 7.561           | 1.30232 | 1.40223 | 0.94784 |

```py
pd.melt(
  df,
  # 列として残したい列
  id_vars=['Country'],
  # 行に変換したい列
  value_vars=['Economy', 'Family', 'Health'],
)
```

こうすることで`value_vars`に指定した列が、`variable`及び`value`という 2 つの行に統合される。

|     | Country     | variable | value   |
| --- | ----------- | -------- | ------- |
| 0   | Switzerland | Economy  | 1.39651 |
| 1   | Iceland     | Economy  | 1.30232 |
| 2   | Switzerland | Family   | 1.34951 |
| 3   | Iceland     | Family   | 1.40223 |
| 4   | Switzerland | Health   | 0.94143 |
| 5   | Iceland     | Health   | 0.94784 |

- このように変換されたデータを tidy なデータという
  - value の値に一括してベクトル計算を行うことが可能になる
  - Aggregation もやりやすい
  - un-melt なデータに戻すには`df.pivot()`を使う。詳細略。

### Working With Strings In Pandas

- 文字列に関する[全ベクトル化メソッド](https://pandas.pydata.org/pandas-docs/stable/user_guide/text.html#method-summary)
- ベクトル化メソッドのメリット
  - より良いパフォーマンス
  - 書きやすい、読みやすいコード
  - 自動的に欠損値を無視してくれる

#### regex に関するベクトル化メソッド

含まれるかどうかを Series で取得

```py
pattern = r"[Nn]ational accounts"

series.str.contains(
  pattern,
  na=False, # 欠損値をNaNではなくFalseとしたい場合(boolean indexing時に最適)
)
```

含まれる最初の値を Series で取得

```py
# '2019'のような値を抽出したい時
pattern = r"([1-2][0-9]{3})" # capturing groupであるもののみ抽出される

series.str.extract(
  pattern,
  expand=True, # 結果をSeriesではなくDataFrameで取得したいときに指定する
)
```

含まれる全ての値を DataFrame で取得

```py
# '2019'のような値を抽出したい時
pattern = r"(?P<Years>[1-2][0-9]{3})" # Named capturing group
# 前述の条件に加え'2019/2020'のような値も想定されるとき
pattern = r"(?P<First_Year>[1-2][0-9]{3})/?(?P<Second_Year>[1-2][0-9]{3})?"

series.str.extractall(pattern)
```

### Working With Missing And Duplicate Data

#### 欠損値の判断

- その列が分析を完了するために必要か
- 削除したらどのような影響があるか
  - 欠損値のある行は、全体の何％か
  - 欠損値のある行の他の列に、価値のある情報があるか
  - 欠損値の出現パターンが特定できるか

#### 欠損値の処理手順

- cleaning/transformation 処理をする前に、欠損値を確認しておく
- cleaning/transformation 処理を行い、エラーが出てないか確認する
- 他の情報源(他年度の似た情報など)を使って、欠損値を埋める
  - `pd.merge()`と key-value 的な Series を組み合わせて行うとよい
- 行・列を破棄する
  - `pd.drop([列名,,,], axis=1)`
  - `pd.drop(threth=123, axis=1)` non-null が指定した件数以下の列を削除する
- 他のデータを使って計算した値で、欠損値を埋める(**imputation**)
  - non-numeric の場合--- 定数(`unknown`など)
  - numeric の場合 --- 中央値、平均値、最頻値
  - その値で埋めることが適切か考えること

#### 重複値

```py
# 国と年度が一致するデータをboolean indexで取得する
df.duplicated(['COUNTRY','YEAR'])

# 国と年度が一致するデータを削除してDFを返す(デフォルトでは最初のデータが保持される)
df.drop_duplicates(['COUNTRY','YEAR'])
```
