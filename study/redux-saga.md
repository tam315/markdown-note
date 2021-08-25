# redux-saga

## 参考資料

- https://qiita.com/macotok/items/ec5460ac17f5a20c4735
- https://fintan.jp/?p=3064
- https://tech.stmn.co.jp/entry/2020/05/14/143012

## effect creators

これらは generator(`function*`)の中で使う

- take, takeEvery, takeLatest
  - 処理をスタートするための action を拾うために使う
  - `watchDeleteUserRequest`的な generator の中に記載する
  - 引数に実際に実行したい generator を渡す
  - ３つの違い
    - take --- 同じアクションが複数回来たときは**逐次**処理する？自信なし
    - takeEvery --- 同じアクションが複数回来たときは**並列**処理する。迷ったらこれ？
    - takeLatest --- 同じアクションが複数回来たときは**古い処理をキャンセル**して最新のもののみ処理する。
- call
  - Promise 等を引数に取る
  - Promise 等の完了を待つ
  - 引数には API リクエストを行う関数+引数を与える。
  - 同期的
  - 非同期的に使いたい場合は fork を使え
- put
  - dispatch と同じ
- select
  - store の値をとってこれる（用法・用量を守らないと大変なことになりそうな予感）

## 小技

- 並列で非同期処理を走らせるには all を使う。以下の場合に処理が次に進む。
  - すべて resolve される
  - いずれかが reject される

```ts
yield all([call(fetchData1, text1), call(fetchData2, text2)]);
```

## メリット

- 複雑化しにくい
  - redux-thunk は Action Creater に処理を記述する一方で、
  - redux-saga は saga コンポーネントに記述できるから
- テストが書きやすい
- Async/Await などの非同期処理のネストが深くならずに済む

## Todo

テストはどう書く？どの程度書くべき？
