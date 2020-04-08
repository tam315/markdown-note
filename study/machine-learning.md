# Machine Learning

Pandas, NumPy, scikit-learn など

[[toc]]

## 機械学習

### 目的

- 分類分けされた答えを探すことを Classification という。
- 特に、A か B かという 2 パターンに分ける場合を Binary classification という。

### Tips

- 説明変数と目的変数に相関があるか確認し、あれば学習データに含める

## Pandas

- `pd.read_csv` --- CSV のインポート

```py
# 自動生成される数値連番を行ラベルとして設定したい場合
df = pd.read_csv('../train.csv')

# 1列目の値を行ラベルとしてCSVファイルを読み込みたい場合
df = pd.read_csv('../train.csv', index_col=0)

# インデックス列についた列ラベルを削除する
df.index.name = None

# エンコーディングの指定(UTF-8, Latin-1, Windows-1252など、読めるまで試す)
df = pd.read_csv('../train.csv', encoding='UTF-8')
```

- `pd.DataFrame()` --- DataFrame を作る

```py
pd.DataFrame({
  'SomeId': some_array_or_series,
  'SomeSolumn': some_array_or_series,
})
```

- `pd.concat()` --- 複数の Dataframe をマージする

```py
pd.concat([df1, df2], axis=1)
```

- `pd.cut()` --- 数値データを categorical に変換する

```py
cut_points = [0, 18, 60, 100]
label_names = ['Teenager', 'Adult', 'Senior']
df['Age_categories'] = pd.cut(
    df['Age'],
    cut_points,
    labels=label_names
)
```

### Dataframe

- [API](https://pandas.pydata.org/pandas-docs/stable/reference/frame.html)
- 表、行、列の操作は Numpy の ndarray とほぼ同じ。下記のように対応していると思ってよい。

| Pandas    | Numpy      |
| --------- | ---------- |
| DataFrame | 2d-ndarray |
| Series    | 1d-ndarray |

- Numpy の ndarray と比べたっときの dataframe の特徴
  - 軸ラベルに文字列を使える
  - 同じ列内に複数のデータ型を保持できる
- 列の選択

| やりたいこと                       | Explicit Syntax         | Common Shorthand                     |
| ---------------------------------- | ----------------------- | ------------------------------------ |
| Series を取得                      | `df.loc[:,列名]`        | `df[列名]`                           |
| Dataframe を取得（配列を使う）     | `df.loc[:,列名のArray]` | `df[列名のArray]`                    |
| Dataframe を取得（スライスを使う） | `df.loc[:,列名:列名]`   | <small> (省略形は存在しない)</small> |

- 行の選択

行を選択したときの Series は基本的に混合型なので、dtype は`object`になることが多い。

| やりたいこと                             | Explicit Syntax       | Common Shorthand                                                                                   |
| ---------------------------------------- | --------------------- | -------------------------------------------------------------------------------------------------- |
| Series を取得                            | `df.loc[キー]`        | <small> (省略形は存在しない)</small>                                                               |
| Dataframe を取得（配列を使う）           | `df.loc[キーのArray]` | <small> (省略形は存在しない)</small>                                                               |
| Dataframe を取得（スライスを使う）       | `df.loc[キー:キー]`   | `df[キー:キー]`<br/><small>（ただし、インデックスが INT 型だと iloc の動作になるので注意）</small> |
| Dataframe を取得（スライスを使う）       | `df.iloc[数値:数値]`  | `df[数値:数値]`                                                                                    |
| Dataframe を取得（Boolean Masks を使う） | `df.loc[bool_masks]`  | `df[bool_masks]`                                                                                   |

- 特定のセルの選択
  - `df.at['index', 'column']`
- Boolean Masks (Boolean Arrays)
  - `df[列名] == 'some_value'`
  - 各行が条件に合致するかを表す Boolean で構成された Series のこと

```py
male = df['Sex'] == 'male'
survived = df['Survived'] == 1

# Boolean masksはフィルタ条件として使用できる
df[male]

# Boolean masks同士で演算ができる
df[male & survived]
df[male | survived]
df[male & ~survived] # ~は否定

# 中間変数を使わない場合はカッコを忘れずに
df[(df['Sex'] == 'male') & (df['Survived'] == 1)]
```

- 値の代入 --- 基本的に numpy と同じ

```py
# ある列の値が〇〇である場合に何かをする、というパターン。よく使う。
df.loc[df['age'] == 0, 'age'] = 10

# NaN を意図的に代入するときは`np.nan`を使う。
df.loc[df['age'] == 0, 'age'] = np.nan

# 存在しない列名を指定すると、新しい列が作られる
df['new_column'] = 'new value'
```

- `df.sort_values(カラム名)` --- 指定したカラムで並べ替える
- `df.pivot_table()` --- ピボットテーブルを Dataframe として取得する

```py
df.pivot_table(index="Sex", values=["Survived"])
```

- `df.to_csv('filename.csv', index=False)` --- CSV を作成する。index が数値型の自動連番の場合は`index=False`を忘れずに。

```py
df.to_csv('./result.csv', index=False)
```

- `df.columns` 列情報(numpy の index オブジェクト)を取得する。代入することで書き換えも可能。

```py
columns = laptops.columns
# Index(['Manufacturer', 'Model Name', 'Category', 'Screen Size', 'Screen',
#        'CPU', 'RAM', ' Storage', 'GPU', 'Operating System',
#        'Operating System Version', 'Weight', 'Price (Euros)'],
#       dtype='object')

new_columns = []

for column in :
    new_columns.append(column.strip())

laptops.columns = new_columns
```

- `df.rename()` --- 列名を変更する

```py
# asix --- 軸の検索方向を指定する
# inplace --- Trueだとdfを書き換える。Falseだと手動での代入が必要。
df.rename({"screen_size": "screen_size_inches"}, axis=1, inplace=True)
```

- `df.dropna(axis=0)` --- 欠損値のある行(axis=0)又は列(axis=1)を削除する

#### NaN について

pandas の（正確には numpy の）int 型は NaN をサポートしていない。
一方 float 型は NaN をサポートしている。
このため、NaN が含まれる値は float 型として扱われる。

### Series

Series は key-value ペアから成る配列であり、one-directional なデータでる。Dataframe は Series の集合体といえる。

- [API](https://pandas.pydata.org/pandas-docs/stable/reference/series.html)
- 選択

| やりたいこと                    | Explicit Syntax       | Shorthand Convention                                                                              |
| ------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------- |
| 値を取得(インデックスで)        | `s.loc[キー]`         | `s[キー]`                                                                                         |
| 値を取得(場所で)                | `s.iloc[数値]`        | <small>（省略形は存在しない）</small>                                                             |
| Series を取得（配列を使う）     | `s.loc[[キー, キー]]` | `s[[キー, キー]]`                                                                                 |
| Series を取得（スライスを使う） | `s.loc[キー:キー]`    | `s[キー:キー]`<br/><small>（ただし、インデックスが INT 型だと iloc の動作になるので注意）</small> |
| Series を取得（スライスを使う） | `s.iloc[数値:数値]`   | `s[数値:数値]`                                                                                    |

- Vectorized Operations(ベクター計算) --- 使い方は Numpy と同じ
- `s.fillna(1234)` --- 値がないセルを埋める
- `s.value_counts()` --- 値の出現数を **Series として**取得する。デフォルトでは NaN は無視される。
- `s.unique()` --- ユニークな値を配列(ndarray)として取得する
- `s.get_dummies()` --- シリーズを複数の列に分解して Dataframe として取得する

```py
pd.get_dummies(train['Pclass'], prefix='Pclass')
```

- series を df に結合する
  - `df['age'] = series`
  - 行ラベルをもとに結合される。Excel の vlookup のようなもの。
  - 該当する値がない行には `NaN` が設定される。
- `s.str.***()` --- vectorized string methods を使う。Series が返る。

```py
# `(`を削除する
s.str.replace('(', '')

# `-`でsplitし、1番目の要素を取得する
s.str.split('-').str[0]
```

- `s.astype(int)` --- 指定した型に変換する
- `s.map(mapping_dict)` --- 指定したマッピングに基づいて値を修正する

```py
# ここに列挙しなかったものはすべてNaNになってしまうので注意する
mapping_dict = {
    'Android': 'Android',
    'Chrome OS': 'Chrome OS',
    'Linux': 'Linux',
}
s['os'] = s['os'].map(mapping_dict)
```

### Dataframe, Series 共通

本項の`df`(Dataframe)は、一部を除き`s`(Series)に置き換えても動作する。

#### 情報表示

- `df.head()` --- 先頭数行を表示する
- `df.tail()` --- 末尾数行を表示する
- `df.describe()` --- 統計情報を表示する
  - (df のみ) デフォルトでは数値型の列のみが集計対象になる。オブジェクト型の列情報を表示するには`include='all'`等が必要
- `df.shape` --- データ数(と列数)を Tuple で取得する
- `df.dtypes` --- 型を表示する
  - `object`型 --- 他のどの型にも当てはまらない場合。殆どの場合は文字列を表す。
- `df.info()` --- データ数と型を表示する。`shape`+`dtypes`。

#### 選択

- `loc`は**軸ラベル**で選択したいとき、`iloc`は**位置**で選択したいときに使う
  - `df.loc[1]` **行ラベル**が`1`のデータ
  - `df.iloc[1]` **行の位置**が 2 番目であるデータ
  - `df.loc[0:5]`は最後を含む
  - `df.iloc[0:5]`は最後を含まない
- `df.select_dtypes(include=['int64'])` --- 型が位置する列を DF として取得する

#### Boolean Mask の作成

- `df.isnull()`|`s.notnull()` --- Null であるか
- `df.isin(['a','b','c'])` --- 与えた配列に含まれるか

#### 変換、ループ

- `*series`, `*df`で keyword args に変換できる
- `**series`, `**df`で dict に変換できる
- `.keys()|.values()|.items()`などを使ってループ処理を行える

#### Aggregation

- **`df.agg(['max','min'])`**
- `df.max()`
- `df.min()`
- `df.mean()`
- `df.median()`
- `df.mode()`
- `df.sum()`
- 縦方向に集計(列ごとの結果を求める) `axis=0`|`axis='index'`
- 横方向に集計(行ごとの結果を求める) `axis=1`|`axis='column'`
- 適宜`numeric_only`引数を指定する
- `df.all()` 全ての値が True である。`axis=0|1|None`を設定できる。`any(df)`ではないので注意。
- `df.any()` いずれかの値が True であるか。`axis=0|1|None`を設定できる。`all(df)`ではないので注意。

#### Groupby

- `df.groupby('city').groups` -> dict
- `df.groupby('city').get_group('osaka')` -> dataframe
- `df.groupby('city').size()` -> series
- タイプが categorical な列を groupby するときは、`observed=True`のオプションをつけること。そうしないと、該当するデータがないグループも出力されてしまう。

```py
df = pd.DataFrame({
    'brand': ['bmw','bmw','benz'],
    'price': [100, 200, -50]
}) \
.astype({'brand': 'category'}, inplace=True)

df[df['price'] > 0].groupby('brand').size()
# brand
# benz    0
# bmw     2
# dtype: int64

df[df['price'] > 0].groupby('brand', observed=True).size()
# brand
# bmw    2
# dtype: int64
```

### データクリーニング

手順

- カラム名
  - 不要な記号や先頭・末尾のスペースを削除
  - スペースをアンダーバーに置き換え
  - 大文字を小文字にする
- 数値列
  - 列ごとに`s.unique()`,`s.dtype`を見ながらパターンと例外を探す
  - 不要な文字列を`s.str.***()`などで取り除く
  - `s.astype(int)`などを使って型を変換する
  - `df.rename()`でカラム名を変更する（`GB`など、削除した単位情報を付与するなど）
- 文字列列
  - `df.str.split().str[0]`などで必要な情報を新しい列に抽出する
  - `s.value_counts()`等を見ながら誤りを探し、`s.map()`で修正する
- 数値列・文字列列共通
  - `df.describe(include='all')`して、freq が count に限りなく近い場合は無意味なデータではないか確認する。
  - `df.isnull()`で欠損値を探して下記の対応を行う
    - `df.dropna()`で行又は列を削除する
    - 値を埋めるか、そのままにする（詳細後述）

値を埋めるか、そのままにする、とは

```py
# 欠損値のある列を探す
df.isnull()

# 欠損値の出現数を確認する
df['os_version'].value_counts(dropna=False)

# 欠損値のある行に関連する他の列の値を見る。
# その結果に応じて、欠損値の値を埋めたり、そのままにするかを決める。
df.loc[df["os_version"].isnull(), "os"].value_counts()
```

### グラフ等

- `Dataframe.plot.*()` => `plt.show()` でグラフを作成する

```py
import matplotlib.pyplot as plt
df.plot.bar()
plt.show()
```

- 複数の Dataframe を重ねてグラフにする

```py
# フィルタ済みのDataframeを取得する
survived = train[train['Survived'] == 1]
died = train[train['Survived'] == 0]

# ヒストグラムを描写
survived['Age'].plot.hist(alpha=0.5, color='red', bins=50)
died['Age'].plot.hist(alpha=0.5, color='blue', bins=50)

# 凡例の表示
plt.legend(['Survived', 'Died'])

plt.show()
```

### nullable なデータタイプ

以前の pandas では、文字列タイプや値が欠損している数値タイプの扱いに難があった。

- 文字列は`object`タイプになる
- bool タイプの中に欠損値が混ざると`bool`から`object`タイプになる
- int タイプの中に欠損値が混ざると`int`から`float`タイプになる　などなど

Pandas version 1.0.0 以降では、欠損値を許容するデータタイプが追加された（現在は実験的扱い）。

- StringDtype
- BooleanDtype(bool でなく boolean)
- Int64Dtype(I が大文字)
- Int32Dtype(I が大文字)

上記タイプの欠損値には、新たに追加された欠損値スカラである`pd.NA`が使用される。
逆に`numpy.nan`や`None`がデータに入り込むと`object`型になってしまうので注意。

上記タイプは今のところデフォルトでは使用されないものの、`df.convert_dtypes()`とすることで、データタイプを一括して欠損値を許容するタイプに適切に変換できる。

```txt
 #   Column   Non-Null Count  Dtype
---  ------   --------------  -----
 0   id       5 non-null      int64
 1   name     5 non-null      object
 2   work     5 non-null      object
 3   email    5 non-null      object
 4   dob      5 non-null      int64
 5   address  5 non-null      object
 6   city     5 non-null      object
 7   optedin  5 non-null      bool
```

を`df.convert_dtypes()`すると

```txt
 #   Column   Non-Null Count  Dtype
---  ------   --------------  -----
 0   id       5 non-null      Int64
 1   name     5 non-null      string
 2   work     5 non-null      string
 3   email    5 non-null      string
 4   dob      5 non-null      Int64
 5   address  5 non-null      string
 6   city     5 non-null      string
 7   optedin  5 non-null      boolean
```

になる。

## NumPy

数値型の dataframe では numpy が使われている。

- `np.array(n次元配列)` --- ndarray を作成する
- `np.genfromtxt()` --- ndarray を作成する

```py
ndarray = np.genfromtxt('some.csv', delimiter=',', skip_header=1)
```

- `ndarray.shape` --- 軸(次元)ごとのデータ数を Tuple で取得する
- `ndarray.dtype` --- 型を表示する(`dtypes`ではないので注意)
- ndarray の選択

```py
ndarray[1,3] # valueで
ndarray[1:5, 2:4] # Sliceで
ndarray[[1,2,3], [2,3,5]] # Arrayで
ndarray[someBoolArray, someBoolArray] # Boolで
```

- Vectorized Operations(ベクター計算)

```py
ndarray + ndarray
ndarray - ndarray
ndarray * ndarray
ndarray / ndarray
```

- 1d-ndarray の統計情報

```py
ndarray.min()
ndarray.max()
ndarray.mean()
ndarray.sum()
```

- 2d-ndarray の統計情報

```py
ndarray.max()
ndarray.max(axis=0) # 列方向のまとまりで計算して1d-ndarrayを返す
ndarray.max(axis=1) # 行方向のまとまりで計算して1d-ndarrayを返す
```

- boolean indexing

```py
# 1d-ndararyに比較演算子を使うと、Booleanの1d-arrayが返ってくる
less_than_five = ndarray[:, 3] < 5

# Booleanの1d-arrayでフィルタする
ndarray[less_than_five]

# フィルタしたうえで特定の列を取得する
ndarray[less_than_five, 1:4]
```

- 値の代入

```py
ndarray[3, 5] = 1 # 特定セル
ndarray[3] = 1 # 特定の行すべて
ndarray[:, 5] = 1 # 特定の列すべて
ndarray[2:4, 5] = 1 # 一部行の特定の列すべて

# ある列の値が〇〇なら、フラグ列に値を代入する、というパターン
ndarray[ndarray[:, 4] < 50, 5] = 1
```

## scikit-learn

- estimator(モデルのインスタンス）を作る

```py
from sklearn.linear_model import LogisticRegression
estimator = LogisticRegression(solver='lbfgs')
```

- `estimator.fit()` --- モデルに学習させる

```py
# estimator.fit(X, y) で学習させる
# 第一引数(X) --- 学習させたいデータからなる、2次元配列(=Dataframe)
# 第二引数(y) --- 予測したい結果からなる、1次元配列(=Series)
all_X = train[columns]
all_y = train['Survived']

estimator.fit(all_X, all_y)
```

- `train_test_split()` --- データを訓練用とテスト用に分割する

```py
from sklearn.model_selection import train_test_split

train_X, test_X, train_y, test_y = \
  train_test_split(all_X, all_y, test_size=0.2, random_state=0)
```

- `estimator.predict()` --- 学習済みモデルを使って予測を行う

```py
estimator.predict(test_X) # 結果は配列として返ってくる
```

- `accuracy_score()` --- 正答率を算出する

```py
from sklearn.metrics import accuracy_score

# accuracy_scoreには1次元の配列（SeriesやArrayなど）を渡す
# 第一引数 --- 正しいデータ
# 第二引数 --- 予測したデータ
accuracy = accuracy_score(test_y, predictions)
accuracy
```

- `cross_val_score()` --- k-fold cross validation を行う

<Img src="//s3.amazonaws.com/dq-content/185/kaggle_cross_validation.svg" maxWidth="500px" />

```py
from sklearn.model_selection import cross_val_score
# cvは折りたたみの回数
# 結果は配列で返ってくる
scores = cross_val_score(estimator, X, y, cv=5)
```
