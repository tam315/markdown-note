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

- `df[列名のArray]` --- 列を限定した Dataframe を取得する
- `df[列名]` --- 列を Series として取得する(Series ≒ key-value ペア)
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

- `series.fillna()` --- 値がないセルを埋める
- `series.value_counts()` --- 値の出現数を Series として取得する
- `series.get_dummies()` --- シリーズを複数の列に分解して Dataframe として取得する

```py
pd.get_dummies(train['Pclass'], prefix='Pclass')
```

### Dataframe, Series 共通

- `df.shape` --- データの個数（と列数）を Tuple で取得する
- `df.describe()` --- データの概要を表示する

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

- `np.mean(数値の配列)` --- 平均を取得する

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
