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
pd.read_csv('../train.csv')
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

- 表、行、列の操作は Numpy の ndarray とほぼ同じ。下記のように対応していると思ってよい。

| Pandas    | Numpy      |
| --------- | ---------- |
| DataFrame | 2d-ndarray |
| Series    | 1d-ndarray |

- Numpy の ndarray と比べたっときの dataframe の特徴
  - 軸のラベルに文字列を使える
  - 同じ列内に複数のデータ型を保持できる
- 列の選択

| やりたいこと                       | Explicit Syntax         | Common Shorthand     |
| ---------------------------------- | ----------------------- | -------------------- |
| Series を取得                      | `df.loc[:,列名]`        | `df[列名]`           |
| Dataframe を取得（配列を使う）     | `df.loc[:,列名のArray]` | `df[列名のArray]`    |
| Dataframe を取得（スライスを使う） | `df.loc[:,列名:列名]`   | (省略形は存在しない) |

- 行の選択

行を選択したときの Series は基本的に混合型なので、dtype は`object`になることが多い。

| やりたいこと                       | Explicit Syntax       | Common Shorthand     |
| ---------------------------------- | --------------------- | -------------------- |
| Series を取得                      | `df.loc[キー]`        | (省略形は存在しない) |
| Dataframe を取得（配列を使う）     | `df.loc[キーのArray]` | (省略形は存在しない) |
| Dataframe を取得（スライスを使う） | `df.loc[キー:キー]`   | `df[キー:キー]`      |

- `df[列名] == 'some_value'` --- 各行が条件に合致するかを、Boolean タイプの Series として取得する

```py
df['Sex'] == 'male'

# BooleanタイプのSeriesはフィルタ条件として使用できる
df[df['Sex'] == 'male']
df[(df['Sex'] == 'male') | (df['Survived'] == 1)]
df[(df['Sex'] == 'male') & (df['Survived'] == 1)]
```

- `df.pivot_table()` --- ピボットテーブルを Dataframe として取得する

```py
df.pivot_table(index="Sex", values=["Survived"])
```

- `pd.to_csv` --- CSV を作成する

```py
df.to_csv('./result.csv', index=False)
```

### Series

Series は key-value ペアから成る配列であり、one-directional なデータでる。Dataframe は Series の集合体といえる。

- 選択

| やりたいこと                    | Explicit Syntax       | Shorthand Convention |
| ------------------------------- | --------------------- | -------------------- |
| 値を取得                        | `s.loc[キー]`         | `s[キー]`            |
| Series を取得（配列を使う）     | `s.loc[[キー, キー]]` | `s[[キー, キー]]`    |
| Series を取得（スライスを使う） | `s.loc[キー: キー]`   | `s[キー: キー]`      |

- `series.fillna()` --- 値がないセルを埋める
- `series.value_counts()` --- 値の出現数を Series として取得する
- `series.get_dummies()` --- シリーズを複数の列に分解して Dataframe として取得する

```py
pd.get_dummies(train['Pclass'], prefix='Pclass')
```

### Dataframe, Series 共通

下記の`df`(Dataframe)は`s`(Series)に置き換えても動作する。

- `df.head()` --- 先頭数行を表示する
- `df.tail()` --- 末尾数行を表示する
- `df.describe()` --- 統計情報を表示する
- `df.shape` --- データ数(と列数)を Tuple で取得する
- `df.dtypes` --- 型を表示する
  - `object`型 --- 他のどの型にも当てはまらない場合。殆どの場合は文字列を表す。
- `df.info()` --- データ数と型を表示する。`shape`+`dtypes`。

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

- ベクター計算

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
