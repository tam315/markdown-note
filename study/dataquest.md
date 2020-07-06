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
