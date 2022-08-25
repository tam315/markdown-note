# Redux - Deriving Data with Selectors

[[toc]]

## 派生データ

- state は小さく保つ。必要なら派生データを作る。
  - e.g.
    - 全 todo 群=>state
    - 全 todo 群から完了した todo だけをフィルタしたもの=>派生データ
- メリット
  - state が読みやすくなる
  - 派生データを作るロジックを減らせる、また同期が容易になる
  - 元の状態が残っており変更されない

## セレクタで派生データを計算

### セレクタの基本

- selector とは、state を受け取って、それを基に何らかの値を返す関数
- selector は`select***`の形で命名すると良い
- selector が書かれる典型的な場所
  - slice(reducer の近く)
  - コンポーネント内(または`useSelector`の中にインラインで)
- selector は、state にアクセスできるあらゆる場所で使える
  - useSelector, mapState, connect, thunk, saga など
  - ただし reducer 内では基本的に使わない
    - 一部の state にしかアクセスできないため

### セレクタで state の情報を隠す

```ts
const data = useSelector((state) => state.some.deeply.nested.field);
```

- 理想は reducer と selector だけが state の詳細を知っている、コンポーネントは知らない状態
- そうすれば state の場所を変更する作業などが容易になる
- だから selector を書くのはコンポーネントではなく slice に書くのが良い
- selector をクエリのようなものとしてとらえよ

### メモ化による selector の最適化

- 以下の場合には、メモ化を行うと良い
  - 高価な計算をする場合
    - ✅ 無駄な計算を最小限に抑えるため
  - 値の参照が変わる場合（≒ 新しいオブジェクトや配列を返す場合。`map()`や`filter()`を使う際に特によく起こる）
    - ✅ 実際には変更されていないのに変更されたと認識されて再レンダリングされるのを防げるため

## Reselect を使ってメモ化されたセレクタを作る

### `createSelector`とは

- input selector と output selector を受け取り、新たなセレクタを返す
  - input selector は値を取り出すだけの役割
  - output selecor は値を変換する役割
- 全ての input selector を実行して`===`で比較し、差があれば再実行し、差がなければメモ化された結果を返す
- トップレベルの値をピュアなセレクタで取り出し、配下の値は`createSelector`で取り出すのはよくあるパターン

```ts
const state = {
  a: {
    first: 5,
  },
  b: 10,
};

const selectA = (state) => state.a;
const selectB = (state) => state.b;
const selectA1 = createSelector([selectA], (a) => a.first);
```

### `createSelector`の詳細

#### ネスト

- メモ化されたセレクタをネストさせることは可能

#### メモ化の回数

- メモ化されるのは直近の 1 回分だけ

#### 引数

- 引数を与えることができる
  - 出力セレクタに追加のパラメータを渡したい場合は、元のセレクタの引数からそれらの値を抽出する入力セレクタを定義しなければならない
  - この際「入力セレクタ」はすべて同じ種類のパラメータを受け取るようにする。そうしないとセレクタは壊れる。

```ts
const selectItems = (state) => state.items;
const selectItemId = (state, itemId) => itemId;

const selectItemById = createSelector(
  [selectItems, selectItemId],
  (items, itemId) => items[itemId],
);

const item = selectItemById(state, 42);

/*
Internally, Reselect does something like this:

const firstArg = selectItems(state, 42);
const secondArg = selectItemId(state, 42);

const result = outputSelector(firstArg, secondArg);
return result;
*/

// セレクタで使うときの例（１箇所でのみ使う場合の書き方。複数箇所で使う場合はファクトリが必要）
useSelector((state) => selectItemById(state, 42));
```

#### Selector Factories

- createSelector のキャッシュサイズはインスタンスごとに 1 つである
- このため、引数を与えられるセレクタを複数の箇所で使いたい場合には、うまく動作しない
- そういう時はファクトリを作って対応する
- 似たような複数の UI コンポーネントで、ID 違いのデータを表示する場合などに特に有効

```ts
const makeSelectItemsByCategory = () => {
  const selectItemsByCategory = createSelector(
    [(state) => state.items, (state, category) => category],
    (items, category) => items.filter((item) => item.category === category),
  );
  return selectItemsByCategory;
};
```
