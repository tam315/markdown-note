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

- まず`df.info()`でデータを俯瞰する
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
- インデックス名を削除する
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
  - `df.sort_values('age', ascending=False)`
- ユニークな値を配列として取得する
  - `df['firstname'].unique()`

## 2-2 Exploratory Data Visualization

### Line Charts

- 日付データを扱う時の下準備
- `df['mydate'] = pd.to_dataframe(df['mydate'])`
- グラフの描写には`matprotlib`を使う。
- 流れ
  - データを使って plot を作成する
  - plot の見た目を調整する
  - plot を表示する
  - 満足するまで繰り返す

```py
# データをセット(x,y)
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
