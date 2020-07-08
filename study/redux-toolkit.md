# Redux Toolkit

[[toc]]

## QuickStart

### 目的

- Redux Toolkit は、redux に関する下記の問題を解決するためのツール
  - 初期セットアップが複雑すぎる
  - 便利に使うには多くのパッケージをインストールする必要がある
  - ボイラープレートが多すぎる
- 全てのケースはカバー出来なくても、大半のケースでコードを簡略化できるツールを目指している
- `create-react-app`や`apollo-boost`の精神に感化されている

### 含まれるもの

- `configureStore()`
- `createReducer()`
- `createAction()`
- `createSlice()`
- `createAsyncThunk()`
- `createEntityAdapter`
  - ノーマライズを行う際に使う。詳細略。
- `createSelector`
  - Reselect ライブラリのユーティリティを利便性のために再エクスポートしたもの

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

#### extraReducers

- action creator を自動的に作成したくない場合に使用する
- action creator が作成されない点を除いて`reducers`と同じ働きをする
- TypeScript 環境の場合は、object を使う方法ではなく、[builder callback を使った方法が推奨されている](https://redux-toolkit.js.org/api/createSlice#the-builder-callback-api-for-extrareducers)
  - action creator を元に型推論が働き便利なため

```js
const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  // objectを使う方法
  extraReducers: {
    // action変数に手動で型付けが必要、かつキー名に`.type`が必要
    [fetchIssue.pending.type]: (state, action) => {},
    [fetchIssue.fulfilled.type]: (state, action) => {},
    [fetchIssue.rejected.type]: (state, action) => {},
  },
  // builder callbackを使う方法
  extraReducers: (builder) =>
    builder
      // action変数には自動で型推論が効いている
      .addCase(fetchIssue.pending, (state, action) => {})
      .addCase(fetchIssue.fulfilled, (state, action) => {})
      .addCase(fetchIssue.rejected, (state, action) => {}),
});
```

#### 注意点

createSlice や ducks パターンで注意すること

- action type は単一の slice でのみ使うのではなく、複数の slice で共有されるべきものであることを認識して設計を行う
  - 例えば、ユーザがログアウトしたよー、というアクションは様々な slice ので処理されうる
- action type の循環参照に注意する。対処法は以下の通り。
  - 例えば 2 つ異なる slice がお互いの action (type) を相互に参照している場合
  - 該当する action を新たなファイルに移行して`createAction`で作成する
  - 作成した action type を 2 つの slice においてインポートし`extraReducer`に処理を記載する

### createAsyncThunk

- createAsyncThunk を使うと、thunk を書くときにありがちな冗長なコードを簡略化できる。
- 与えられた action type (文字列)と Promise を返す関数を元に、thunk を生成する
- thunk は Promise の結果により`pending/fulfilled/rejected`のいずれかの action type を送出する
- 生成された thunk は`thunk.fulfilled`等の形式で action type として利用できる

```ts
export const fetchIssue = createAsyncThunk(
  'issues/fetchIssue', // アクション名は手動で指定する
  async (arg, thunkAPI) => {
    // 引数は1つしか使えないので、複数必要な場合はこのようにオブジェクトにする必要がある
    const { org, repo, issueId } = arg;
    const issues = await getIssue(org, repo, issueId);
    return issues;
  },
);

const issues = createSlice({
  name: 'issues',
  initialState: issuesInitialState,
  reducers: {},
  // action creatorは作成する必要がないので、extraReducersを使う
  extraReducers: {
    [fetchIssue.pending.type]: (state, action) => {},
    // action.payloadにissuesが入っている
    [fetchIssue.fulfilled.type]: (state, action) => {},
    [fetchIssue.rejected.type]: (state, action) => {},
  },
});

// コンポーネントで
dispatch(fetchIssue({ org: 1, repo: 2, issueId: 3 }));
```

なお、`ThunkAPI`は以下のような値を持つ

```ts
interface ThunkAPI {
  dispatch: Function;
  getState: Function;
  extra?: any;
  requestId: string;
  signal: AbortSignal;
}
```

#### unwrapResult

- 通常の thunk action と異なり、createAsyncThunk で作成した thunk action は常に action`{type, payload}`を返す。
- この挙動を避けて、元のプロミスが返す値を取得したい場合は、`unwrapResult`を使う。

```ts
import { unwrapResult } from '@reduxjs/toolkit';
const onClick = () => {
  dispatch(fetchUserById(userId))
    .then(unwrapResult)
    .then((fetchedUser) => {});
};
```

## 中級チュートリアル

### ducks パターン

redux コミュニティの慣例

- 単一ファイルに action creators と reducers を記載する
- reducer をデフォルトエクスポートする
- action creators を named export する

### おすすめのフォルダ構成

- ほとんどの場合において **"feature folder" approach** が有効であることが確認されている
- 機能やドメインごとにフォルダ分けする方法
- ファイルタイプ(actions, reducers, containers, components)ごとにフォルダを分ける方法は見通しが悪化しがち
- [参考](https://redux-toolkit.js.org/tutorials/intermediate-tutorial#writing-the-slice-reducer)

#### フォルダ構成例

[このプロジェクト](https://github.com/reduxjs/rtk-github-issues-example)を参考にするとよいかも

- src
  - api
    - api を叩く関数など
  - app
    - `App.tsx|css`, `rootReducer.ts`, `store.ts`など、アプリの核となるファイル
  - components
    - 再利用可能なコンポーネント
    - 画面や機能に依存しないコンポーネント
  - features
    - 機能ごと、画面ごと、ドメインごとにフォルダを作る
    - コンポーネント、css、スライス(actions, reducers)、セレクタ、テストファイルなどを含む
  - utils

### Flux Standard Actions

- アクションは`{type:string, payload: any}`の形式であるべき
- redux-toolkit ではデフォルトでその形式になる

### payload に手を加えるには

- `createAction()`や`createSlice()`を使って生成された action creators は、与えた引数をそのまま`action.payload`として送出する
- 与えた引数に何らかの処理を行ってから(prepare してから) payload を作成したい場合は下記のようにする

```js
// createActionの場合は第2引数に`prepare callback`を記載する
const addTodo = createAction('ADD_TODO', text => {
  return {
    payload: { id: uuid(), text }
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

### セレクタの最適化(sharrowEqual を使う場合)

- 下記の場合、data は毎回新しいオブジェクトになる。すなわち再描写がかかる。
- これは useSelector の比較方法が reference equality だからである。なお、connect の比較方法は shallow equality である。
  - reference equality --- セレクタが返したオブジェクト「自体」のアドレスが同一であるか
  - shallow equality --- セレクタが返したオブジェクトの「1 階層目のキーの種類とその参照先アドレス」が同一であるか
- 第 2 引数に shallowEqual を渡すことで比較方法を変更できる

```ts
const data = useSelector(
  (state) => ({
    commentsLoading: state.comments.loading,
    commentsError: state.comments.error,
    comments: state.comments.commentsByIssue[issueId],
  }),
  // shallowEqual,
);
```

### セレクタの最適化(reselect を使う場合)

- shallowEqual を使ったとしても再描写がかかってしまう場合がある。例えば下記の`getVisibleTodos()`のうち`.filter()`された結果については、必ず新しい(=参照の異なる)配列として生成される
- このように state の一部をフィルタして抜き出すなどするときなどは、`reselect`を使って適宜メモ化すること
- `reselect`を使うと`.filter()`した結果もメモ化され、同じ参照のオブジェクトとして取得できる

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

## 上級チュートリアル

[お題のプロジェクト](https://github.com/reduxjs/rtk-github-issues-example)

### dispatch()の戻り値

- `dispatch()`の戻り値は引数の戻り値と等しくなる。例えば：
  - `プレーンなaction creator()`を与えた場合 --- action creator が return した値(通常は`{type, payload}`)
  - `thunk action creator()`を与えた場合 --- thunk が return した値(よって、thunk が async なら Promise が戻る)

### HMR

- HMR が利用できる環境では`module.hot`が存在するので、これを使って再描写を行う
- 再描写の方法は`accept()`のコールバックに個別に記載する
- create-react-app ではデフォルトでは HMR ではなくフルリロードが行われる

```ts
module.hot.accept(
  dependencies, // 監視するファイル
  callback, // ファイルが変更されたときに何をするか
);
```

### store の型

- `mapState`,`useSelector`,`getState`などで store の型を利用するには`ReturnType` という TS のビルトイン型を使う
- 下記のようにすることで自動的に store の型が最新に保たれる

```ts
// app/rootReducer.ts

import { combineReducers } from '@reduxjs/toolkit';
const rootReducer = combineReducers({});

// rootReducerが返す値の型をstoreの型として利用する
// 型はエクスポートしておき、各所で利用する
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
```

### store のセットアップ

`app/store.ts`のセットアップ例

#### インポート関連

```ts
import { Action, configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as rawUseDispatch,
  useSelector as rawUseSelector,
} from 'react-redux';
import { ThunkAction } from 'redux-thunk';
import rootReducer, { RootState } from './rootReducer';
```

#### ストアの作成

```ts
const store = configureStore({
  reducer: rootReducer,
});
export default store;
```

#### HMR の設定(redux 関連)

```ts
// reducerが更新されたときはHMRする
// (store.replaceReducerを使って、reducerだけを入れ替える)
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./rootReducer', () => {
    const newRootReducer = require('./rootReducer').default;
    // const newRootReducer = (await import('./rootReducer')).default

    store.replaceReducer(newRootReducer);
  });
}
```

#### thunk action の型定義

- thunk action creator の戻り値の型(= thunk action の型)として使用する
- `createAsyncThunk`のみを使用し、手動で thunk を作成しない場合は、この作業は不要

```ts
export type MyThunkAction<R = Promise<any>> = ThunkAction<
  R, // thunk actionの戻り値(結果)の型。ほとんどの場合Promiseになる。
  RootState, // root stateの型
  unknown, // thunk actionの第3引数の型(拡張用、通常は使わない)
  Action<string> // action.typeの型
>;

// コンポーネントでの使用例
export const fetchIssues = (): MyThunkAction => async (dispatch) => {};
```

#### dispatch の型定義

- 素の `useDispatch` を型付けして再利用可能にしておく
- これを行わないと `dispatch().then()`したときに型エラーとなる
- https://qiita.com/hiroya8649/items/73d80a52636a787fefa5

```ts
// 暗黙的に ThunkDispatch 型になる
type MyDispatch = typeof store.dispatch;
export const useDispatch = () => rawUseDispatch<MyDispatch>();
```

#### useSelecter の型定義

- 素の `useSelector` を型付けして再利用可能にしておく

```ts
export const useSelector: TypedUseSelectorHook<RootState> = rawUseSelector;
```

### 起点ファイル(index.ts)のセットアップ

```tsx
// index.tsx

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './app/store';
import './index.css';

const render = () => {
  const App = require('./app/App').default;
  // const App = (await import('./app/App')).default;

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root'),
  );
};

// 初回に一度だけレンダリングを行う
render();

// コンポーネントが更新されたときはHMRする
// (React部分だけを再描写する)
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./app/App', render);
}
```

### どのような値を redux で管理すべきか

- 最適
  - 複数のコンポーネントにまたがって使用されそうな値
- 不適
  - 一つのコンポーネントでのみ使用される値、特にフォームの値

### reducers や actions の型

`createSlice()`では下記の 2 箇所で型を指定できる

- initialState
  - 各 case reducer が受け取る state の型として利用される
  - slice reducer が返す値の型として利用される。つまり、最終的に store の型として利用される
- case reducer の action
  - 各 case reducer が受け取る payload の型として利用される
  - action creator に渡すべき引数の型として利用される

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

let initialState: SomeMyType = {
  org: 'rails',
  repo: 'rails',
  page: 1,
  displayType: 'issues',
  issueId: null,
};

const issuesDisplaySlice = createSlice({
  name: 'issuesDisplay',
  initialState,
  reducers: {
    setCurrentPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
  },
});
```

### thunk とは

```ts
// これは`action` creator
function exampleActionCreator() {
  // これは`action`
  return { type: SOME_TYPE, payload: '' };
}
store.dispatch(exampleActionCreator());

// これは`thunk action` creator --- 略してthunkと呼ぶ
function exampleThunk() {
  // これは`thunk action`
  return function exampleThunkFunction(dispatch, getState) {
    // dispatch(plainActionCreator())
  };
}
store.dispatch(exampleThunk());
```

- thunk とは、関数を返す関数のこと
- その目的は計算を後段に遅らせるため
  - 結果を得るには 2 回呼ぶ必要がある(`thunk()()`)
  - これにより、thunk を実行するタイミングと、実際にその結果を得るタイミングをずらすことができる
- redux-saga や redux-observable も便利だが、ほとんどの場合は thunk で事足りる
- thunk は`createSlice()`内では**作成出来ない**ので、その外側で独立した関数として作成し、named export する
- thunk は slice ファイル内に記載すると良い

### thunk にまつわる型

thunk にまつわる型定義は予め`store.ts`など一箇所で行っておくと、何度も書く必要がなくなるので便利。詳細は前述の[store のセットアップ](#store-のセットアップ)項目を参照。

### thunk の利点

- ロジックが再利用可能で汎用性の高いものになる
- コンポーネントから複雑なロジックを分離できる
- コンポーネント内で利用する際に、同期・非同期を意識しなくてすむ
- `dispatch()`を`await`するなどして非同期処理の完了を知ることができる

### thunk のエラーハンドリング

下記のような書き方をすると`getRepoDetailsSuccess()`で起きたエラーまで拾ってしまうので、本当はもう少し[丁寧な記述](https://redux-toolkit.js.org/tutorials/advanced-tutorial#async-error-handling-logic-in-thunks)が必要。

```ts
try {
  const repoDetails = await getRepoDetails(org, repo);
  dispatch(getRepoDetailsSuccess());
} catch (e) {
  dispatch(getRepoDetailsFailed());
}
```

### Slice の例

- Slice ファイルの全体像は下記のようになる(createAsyncThunk を使わないパターン)
- 並びとしては以下のようになる
  - 型定義
  - inital state
  - 複数の action creators で共通して利用する case reducer 関数
  - `createSlice`
  - action creators の destructuring と named export
  - reducer の default export
  - thunk action creators

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getIssue, getIssues, Issue, IssuesResult } from 'api/githubAPI';
import { MyDispatch, MyThunkAction } from 'app/store';
import { Links } from 'parse-link-header';

interface IssuesState {
  issuesByNumber: Record<number, Issue>;
  currentPageIssues: number[];
  pageCount: number;
  pageLinks: Links | null;
  isLoading: boolean;
  error: string | null;
}

const issuesInitialState: IssuesState = {
  issuesByNumber: {},
  currentPageIssues: [],
  pageCount: 0,
  pageLinks: {},
  isLoading: false,
  error: null,
};

function startLoading(state: IssuesState) {
  state.isLoading = true;
}

function loadingFailed(state: IssuesState, action: PayloadAction<string>) {
  state.isLoading = false;
  state.error = action.payload;
}

const issues = createSlice({
  name: 'issues',
  initialState: issuesInitialState,
  reducers: {
    getIssueStart: startLoading,
    getIssuesStart: startLoading,
    getIssueSuccess(state, { payload }: PayloadAction<Issue>) {
      const { number } = payload;
      state.issuesByNumber[number] = payload;
      state.isLoading = false;
      state.error = null;
    },
    getIssuesSuccess(state, { payload }: PayloadAction<IssuesResult>) {
      const { pageCount, issues, pageLinks } = payload;
      state.pageCount = pageCount;
      state.pageLinks = pageLinks;
      state.isLoading = false;
      state.error = null;

      issues.forEach((issue) => {
        state.issuesByNumber[issue.number] = issue;
      });

      state.currentPageIssues = issues.map((issue) => issue.number);
    },
    getIssueFailure: loadingFailed,
    getIssuesFailure: loadingFailed,
  },
});

export const {
  getIssuesStart,
  getIssuesSuccess,
  getIssueStart,
  getIssueSuccess,
  getIssueFailure,
  getIssuesFailure,
} = issues.actions;

export default issues.reducer;

export const fetchIssues = (
  org: string,
  repo: string,
  page?: number,
): MyThunkAction => async (dispatch: MyDispatch) => {
  try {
    dispatch(getIssuesStart());
    const issues = await getIssues(org, repo, page);
    dispatch(getIssuesSuccess(issues));
  } catch (err) {
    dispatch(getIssuesFailure(err.toString()));
  }
};

export const fetchIssue = (
  org: string,
  repo: string,
  number: number,
): MyThunkAction => async (dispatch: MyDispatch) => {
  try {
    dispatch(getIssueStart());
    const issue = await getIssue(org, repo, number);
    dispatch(getIssueSuccess(issue));
  } catch (err) {
    dispatch(getIssueFailure(err.toString()));
  }
};
```
