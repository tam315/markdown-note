# Redux Toolkit

[[toc]]

## QuickStart

### 目的

Redux Toolkit は、redux に関する下記の問題を解決するためのツール

- 初期セットアップが複雑すぎる
- 便利に使うには多くのパッケージをインストールする必要がある
- ボイラープレートが多すぎる

下記のライブラリを組み合わせを使うことで、多くのケースでコードを簡略化できる。

- create-react-app
- apollo-boost
- redux-toolkit

### 含まれるもの

- `configureStore()`
- `createReducer()`
- `createAction()`
- `createSlice()`
- `createAsyncThunk()`
  - 与えられた action type (文字列)と Promise を返す関数を元に、thunk を生成する
  - thunk は Promise の結果により`pending/fulfilled/rejected`のいずれかの action type を送出する
  - 生成された thunk は`action.fulfilled`の形式で action type として利用できる
- `createEntityAdapter`
  - 再利用可能な reducers と selectors を生成する？
  - ノーマライズされたデータをストア内で管理するために使用する？
- `createSelector`
  - Reselect ライブラリのユーティリティを利便性のために再エクスポートしたもの？

## 基本チュートリアル

### configureStore

- `createStore()`のラッパー
- reducer をオブジェクトとして与えた場合には`combineReducer()`が自動で呼ばれる
- ミドルウェア群がデフォルトで追加される
  - Redux DevTools
  - redux-thunk
  - Immutability check middleware --- store の値が直接改変されないよう監視する
  - Serializability check middleware --- シリアライズ出来ない値()が store に入り込まないように監視する

```js
// Before:
const store = createStore(counter);

// After:
const store = configureStore({
  reducer: counter,
});
```

### createAction

- 与えられた action type (文字列)を元に action creator を生成する
- 生成された action creator 関数は`toString()`メソッドを持つため、そのまま action type としても使用できる
- 本当は`createActionCreator()`が[正しい名前](https://redux-toolkit.js.org/tutorials/basic-tutorial#introducing-createaction)である

action type の取得方法は 2 つある

- オーバーライドされた`toString()`を使う(action creator をそのまま使う)
- `.type`を使う

```js
// Before
const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';

function increment() {
  return { type: INCREMENT };
}

function decrement() {
  return { type: DECREMENT };
}

function counter(state = 0, action) {
  switch (action.type) {
    case INCREMENT:
      return state + 1;
    case DECREMENT:
      return state - 1;
    default:
      return state;
  }
}

// After
const increment = createAction('INCREMENT');
const decrement = createAction('DECREMENT');

function counter(state = 0, action) {
  switch (action.type) {
    // .typeを使う方法
    case increment.type:
      return state + 1;
    // toStringを使う方法
    case decrement:
      return state - 1;
    default:
      return state;
  }
}
```

### createReducer

- slice reducer を作成して返す
  - root reducer --- store 全体を管理する reducer (アプリ単位。多くの場合`combineReducers()`で作られる reducer)
  - slice reducer --- store の一部を管理する reducer (ドメイン単位。例：`store.todos`を管理する reducer)
  - case reducer --- 個々のアクションに対応する reducer (アクション単位。例：`ADD_TODO` を担当する reducer)
- action type から reducer へのルックアップテーブルという形で処理を記述できるようにする。これにより switch 文が不要になる。
- 裏側で immer が使われているため、state を直接書き換える形で値を改変することができることにより、簡潔な表記が可能になる
- デフォルトケースについては明記する必要はない

```js
const increment = createAction('INCREMENT');
const decrement = createAction('DECREMENT');

const counter = createReducer(0, {
  // .typeを使う方法
  [increment.type]: (state) => state + 1,
  // toStringを使う方法
  [decrement]: (state) => state - 1,
});
```

### createSlice

- slice オブジェクトを作成する(state の一部を管理する責務をもつオブジェクト)
- 下記を一括で生成する
  - reducer
  - action creators (reducer オブジェクトのキー名が関数名となる)
  - action type strings (slice 名 + reducer オブジェクトのキー名)
- 引数
  - slice 名
  - store の初期値
  - reducers オブジェクト
- 多くの場合`createAction()`や`createReducer()`を使うまでもなく`createSlice()`だけで事足りる

```js
const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {
    increment: (state) => (state += 1),
    decrement: (state) => (state -= 1),
  },
});

const { actions, reducer } = counterSlice;
const { increment, decrement } = actions;

// createSlice()の返値は下記のような形式になる
// {
//   name: "todos",
//   reducer: (state, action) => newState,
//   actions: {
//     addTodo: (payload) => ({type: "todos/addTodo", payload}),
//     toggleTodo: (payload) => ({type: "todos/toggleTodo", payload})
//   },
//   caseReducers: {
//     addTodo: (state, action) => newState,
//     toggleTodo: (state, action) => newState,
//   }
// }
```

## 中級チュートリアル

### ducks パターン

redux コミュニティの慣例

- 単一ファイルに action creators と reducers を記載する
- reducer をデフォルトエクスポートする
- action creators を named export する

### Flux Standard Actions

- アクションは`{type:string, payload: any}`の形式であるべき
- redux-toolkit ではデフォルトでその形式になる

### payload に手を加えるには

- `createAction()`や`createSlice()`を使って生成された action creators は、与えた引数をそのまま`action.payload`として発出する
- 与えた引数に何らかの処理を行ってから(prepare してから) payload を作成したい場合は下記のようにする

```js
// createActionの場合は第2引数に`prepare callback`を記載する
const addTodo = createAction('ADD_TODO', text => {
  return {
    payload: { id: nextTodoId++, text }
  }
})

// createSliceの場合はreducerとprepare functionを分けて記述する
const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    addTodo: {
      reducer(state, action) {
        const { id, text } = action.payload
        state.push({ id, text, completed: false })
      },
      prepare(text) {
        return { payload: { text, id: 1 + 2 + 3 } }
      }
    }
  }
}
```

### セレクタの最適化

- state の一部を抜き出すときは`reselect`を使ってメモ化すると良い
  - 例えば下記の`getVisibleTodos()`では、フィルタの値が変わるたびに全く新しい(参照の異なる)`todos`が生成される
  - これが mapStateToProps に与えられているため、毎回再描写が走ることになる
  - `reselect`を使うとメモ化されるため、同じ参照のオブジェクトを取得できる
- 単純な selectors は slice のファイルに含めてしまって良いかも

```diff
import { connect, useSelector } from 'react-redux'
+import { createSelector } from '@reduxjs/toolkit'
import { toggleTodo } from 'features/todos/todosSlice'
import TodoList from '../components/TodoList'
import { VisibilityFilters } from 'features/filters/filtersSlice'

-const getVisibleTodos = (todos, filter) => {
-  switch (filter) {
-    case VisibilityFilters.SHOW_ALL:
-      return todos
-    case VisibilityFilters.SHOW_COMPLETED:
-      return todos.filter(t => t.completed)
-    case VisibilityFilters.SHOW_ACTIVE:
-      return todos.filter(t => !t.completed)
-    default:
-      throw new Error('Unknown filter: ' + filter)
-  }
-}
+const selectTodos = state => state.todos
+const selectFilter = state => state.visibilityFilter
+const selectVisibleTodos = createSelector(
+  [selectTodos, selectFilter],
+  (todos, filter) => {
+    switch (filter) {
+      case VisibilityFilters.SHOW_ALL:
+        return todos
+      case VisibilityFilters.SHOW_COMPLETED:
+        return todos.filter(t => t.completed)
+      case VisibilityFilters.SHOW_ACTIVE:
+        return todos.filter(t => !t.completed)
+      default:
+        throw new Error('Unknown filter: ' + filter)
+    }
+  }
+)


const mapStateToProps = state => ({
- todos: getVisibleTodos(state.todos, state.visibilityFilter)
+ todos: selectVisibleTodos(state)
})

又はhookの場合、
+ const todos = useSelector(selectVisibleTodos)
```
