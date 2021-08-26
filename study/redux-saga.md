# redux-saga

## 参考資料

- https://redux-saga.js.org/docs/introduction/BeginnerTutorial
- https://qiita.com/macotok/items/ec5460ac17f5a20c4735
- https://fintan.jp/?p=3064
- https://tech.stmn.co.jp/entry/2020/05/14/143012

## 特徴

- 非同期処理をシンプルにする
  - 読みやすく、書きやすく、テストしやすい
  - generator のおかげ
- Composition の思想を持つ？
  - 複数のタスクを、並行実行したり、レース実行したり、キャンセルしたりできる。

## メリット

- 複雑化しにくい(ほんとか)
  - redux-thunk は Action Creater に処理を記述する一方で、
  - redux-saga は saga コンポーネントに記述できるから
- テストが書きやすい
- Async/Await などの非同期処理のネストが深くならずに済む

## Effect

用語

- Effect
  - プレーンなオブジェクト
  - generator で作成される
  - middleware で解釈される
- Effect creators
  - Effect を生成する役割を持つ関数
  - generator の中で使用する

Effect creators の一覧

- take, takeEvery, takeLatest
  - 処理をスタートするための action を拾うために使う
  - `watchDeleteUserRequest`的な generator の中に記載する
  - 引数に実際に実行したい generator を渡す
  - ３つの違い
    - take --- 同じアクションが複数回来たときは**逐次**処理する？自信なし
    - takeEvery --- 同じアクションが複数回来たときは**並行**処理する。迷ったらこれか？
    - takeLatest --- 同じアクションが複数回来たときは**古い処理をキャンセル**して最新のもののみ処理する。
- call
  - Promise 等を引数に取る
  - Promise 等の完了を待つ
  - 引数には API リクエストを行う関数+引数を与える。
  - 同期的
  - 非同期的に使いたい場合は fork を使え
- put
  - redux の dispatch と同じ
- select
  - store の値をとってこれる（用法・用量を守らないと大変なことになりそうな予感）

## 基本的なコード

以下の例では、Wather saga は、`INCREMENT_ASYNC`を受け取るごとに、`incrementAsync`タスクを spawn (並行実行)する。

```ts
// Worker sagaという
export function* incrementAsync() {
  yield somePromiseToDelay(1000);
  yield put({ type: 'INCREMENT' });
}

// Watcher sagaという。最終的にこれをmiddlewareに渡す。
export function* watchIncrementAsync() {
  yield takeEvery('INCREMENT_ASYNC', incrementAsync);
}
```

## 並行実行

並行で複数の非同期処理を走らせるには all を使う。以下の場合に処理が次に進む。

- すべて resolve される
- いずれかが reject される

```ts
yield all([call(fetchData1, text1), call(fetchData2, text2)]);
```

## Promise を yield する

- Promise が yield された場合、saga(middleware) はその処理の終了を待つ
- Promise が完了すると、saga は次の処理を開始する
- yield 文に直接 Promise を渡すと、yield された瞬間にその Promise は実行開始される。
  - これは特にテスト時などに都合が悪いので、call でラップして使うとよい。

```ts
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export function* someFunc() {
  yield delay(1000);
  // or
  yield call(delay, 1000);

  // これは1秒後に実行される
  yield someOtherFunc();
}
```

## テスト

- 前提知識
  - `put`や`call`(Effect creator)はプレーンなオブジェクト(Effect)を返す。
  - これらで関数をラップすると、テストが楽になる
    - put を使えば dispatch をモックする必要がなくなるし、
    - call を使えば関数をモックする必要がなくなる

```ts
put({ type: 'INCREMENT' }); // => { PUT: {type: 'INCREMENT'} }
call(delay, 1000); // => { CALL: {fn: delay, args: [1000]}}
```

Effect creator でラップすることで、以下のようなテストを書くことが可能になる

```ts
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

function* incrementAsync() {
  // テストできるようにするため、delayを直接呼ばずに、callでラップして使う
  yield call(delay, 1000);
  yield put({ type: 'INCREMENT' });
}

test('incrementAsync Saga test', (assert) => {
  const gen = incrementAsync();

  assert.deepEqual(
    gen.next().value,
    call(delay, 1000), // テストの理想形をこう書ける。なぜならcallの返り値はプレーンなオブジェクトだから。
    'incrementAsync Saga must call delay(1000)',
  );

  assert.deepEqual(
    gen.next().value,
    put({ type: 'INCREMENT' }), // 同上
    'incrementAsync Saga must dispatch an INCREMENT action',
  );

  assert.deepEqual(
    gen.next(),
    { done: true, value: undefined },
    'incrementAsync Saga must be done',
  );

  assert.end();
});
```

API のモックが必要になときは、愚直にモックするのではなく、`generator.next(期待される結果)`を使うと簡単。

```ts
function* fetchProducts() {
  const products = yield call(Api.fetch, '/products');
  yield put({ type: 'PRODUCTS_RECEIVED', products });
}

const iterator = fetchProducts();

// APIがコールされていることをテスト
assert.deepEqual(
  iterator.next().value,
  call(Api.fetch, '/products'),
  "fetchProducts should yield an Effect call(Api.fetch, './products')",
);

const fakeProducts = {};

// アクションがdispatchされていることをテスト
assert.deepEqual(
  // nextに引数を与えると、前回のyieldの結果を上書きできる。まじか。
  iterator.next(fakeProducts).value,
  put({ type: 'PRODUCTS_RECEIVED', fakeProducts }),
  "fetchProducts should yield an Effect put({ type: 'PRODUCTS_RECEIVED', products })",
);
```

## エラーハンドリング

普通に try-catch で OK

```ts
function* fetchProducts() {
  try {
    const products = yield call(Api.fetch, '/products');
    yield put({ type: 'PRODUCTS_RECEIVED', products });
  } catch (error) {
    yield put({ type: 'PRODUCTS_REQUEST_FAILED', error });
  }
}
```

エラー系のテストをしたい場合、以下のように`throw()`を使う

```ts
assert.deepEqual(
  iterator.next().value,
  call(Api.fetch, '/products'),
  "fetchProducts should yield an Effect call(Api.fetch, './products')",
);

const fakeError = {};

assert.deepEqual(
  iterator.throw(fakeError).value,
  put({ type: 'PRODUCTS_REQUEST_FAILED', fakeError }),
  "fetchProducts should yield an Effect put({ type: 'PRODUCTS_REQUEST_FAILED', error })",
);
```

[グローバルなエラーハンドラ](https://redux-saga.js.org/docs/api/#middleware-api)を設定することも可能ではあるものの、最終的な保険としてのみ利用するのが良い、とのこと。
