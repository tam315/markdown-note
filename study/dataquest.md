# Dataquest

[[toc]]

## Pandas と NumPy の基礎

### Numpy 入門

NumPy はデータを ndarray(n-dimensional array)で持っている

```py
data_ndarray = np.array([10, 20, 30])
```

- なぜ ndarray が分析を楽にするのか
  - CPU の SIMD(Single Instruction Multiple Data)を使って高速に計算できるから
  - このように複数のデータを一度に操作することを Vectorization(ベクトル化)という

## Exploring Data with pandas: Fundamentals

- まず`df.info()`でデータを俯瞰する
- ベクトル計算のメリット
  - パフォーマンスに優れる
  - 計算処理の記述が簡素になる (`series_a - series_b`など)
- 統計関数を使うと便利
  - Series.max()
  - Series.min()
  - Series.mean()
  - Series.median()
  - Series.mode()
  - Series.sum()
