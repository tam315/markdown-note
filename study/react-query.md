# React Query

[[toc]]

## 原典

[https://react-query.tanstack.com/overview](https://react-query.tanstack.com/overview)

## 概要

- Server state(バックエンドのデータ)を fetching, caching, synchronizing and updating するためのライブラリ
- Server state は、ローカルの同期的なデータとは根本的に性質が異なる。にもかかわらず、redux のようなものでそれを管理してきたけど、辛いよね。私に頼りなさい。

## インストール

```sh
yarn add react-query
```

```jsx
// App.tsx
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <MyApp />
    </QueryClientProvider>
  );
}
```

## 使い方

```jsx
// MyComponent.tsx
import { useQuery } from 'react-query';

function MyComponent() {
  const { isLoading, error, data } = useQuery('repoData', () =>
    fetch(
      'https://api.github.com/repos/tannerlinsley/react-query',
    ).then((res) => res.json()),
  );

  if (isLoading) return 'Loading...';

  if (error) return 'An error has occurred: ' + error.message;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>👀 {data.subscribers_count}</strong>{' '}
      <strong>✨ {data.stargazers_count}</strong>{' '}
      <strong>🍴 {data.forks_count}</strong>
    </div>
  );
}
```

## デフォルト設定に関する注意

- キャッシュデータは stale として扱われる(`staleTime`)。このため、下記の場合にデータが自動的に再取得される。
  - クエリを使用する新しいコンポーネントがマウントされた時(`refetchOnMount`)
  - ウィンドウが再フォーカスされた時(`refetchOnWindowFocus`)
  - ネットワークが再接続された時(`refetchOnReconnect`)
  - 再取得の間隔が明示的にセットされている時(`refetchInterval`)
- どのコンポーネントにも使用されていないキャッシュデータは`inactive`としてしばらく残るが、5 分後に削除される(`cacheTime`)。
- 失敗したクエリは自動的に３回再試行される。間隔は指数関数的に伸びる。(`retry`, `retryDelay`)
- クエリ結果は[Structural Sharing](https://medium.com/@dtinth/immutable-js-persistent-data-structures-and-structural-sharing-6d163fbd73d2)という仕組みで保持されている。これにより、本当に値が変わった時にだけ最小限のオブジェクトの参照が変更される。これは、ほとんどの場合で効率的である。

## クエリ

- クエリするには下記の２つが必要
  - ユニークなキー
  - Promise(データを resolve するか、エラーを投げる)

```ts
const result = useQuery('todos', fetchTodoList);
// or
const result = useQuery({
  queryKey: 'todos',
  queryFn: fetchTodoList,
});
```

- result
  - `isLoading` or `status === 'loading'` 初期ロード中
  - `isError` or `status === 'error'` エラーが発生した状態
    - `error` エラーの内容
  - `isSuccess` or `status === 'success'` データ取得が成功した状態
    - `data` データ
  - `isIdle` or `status === 'idle'` クエリが無効化された状態
  - `isFetching` なんらかの通信中である(`isLoading`を含む)

## クエリキー

- クエリキーに基づいてキャッシュが行われる
- シリアライズ可能な値ならなんでもキーとして使用できる

```ts
useQuery('todos', ...)
// queryKey === ['todos']

useQuery(['todo', 5], ...)
// queryKey === ['todo', 5]

useQuery(['todo', 5, { preview: true }], ...)
// queryKey === ['todo', 5, { preview: true }]

// なお、下記は同じものとして扱われる
useQuery(['todos', { status, page }], ...)
useQuery(['todos', { page, status }], ...)
```

クエリが特定の id 等に基づいて行われるものであるならば、その値をキーとして含めておくこと

```ts
function Todos({ todoId }) {
  const result = useQuery(['todos', todoId], () => fetchTodoById(todoId));
}
```

## クエリを実行する(データを取得する)関数

- データ取得に失敗した時は必ずエラーを投げること(この制約は React Query の仕様によるもの)
  - `axios`と異なり、`fetch`はデフォルトではエラーを投げないので注意する

```ts
useQuery(['todos', todoId], async () => {
  const { ok, json } = await fetch('/todos/' + todoId);
  if (!ok) {
    throw new Error('Network response was not ok');
  }
  return json();
});
```

- ユニークキーは Query function に渡されるので、必要に応じて使用するとよい

```ts
function Todos({ status, page }) {
  const result = useQuery(['todos', { status, page }], fetchTodoList);
}

function fetchTodoList({ queryKey }) {
  const [_key, { status, page }] = queryKey;
  return new Promise();
}
```

## クエリを並列で実行する

- `useQuery`を並べて書けば OK
- ただし、配列に基づいてクエリしたい場合や、suspense mode を使っている場合は`useQueries`を使う必要がある

```ts
const userQueries = useQueries(
  users.map((user) => {
    return {
      queryKey: ['user', user.id],
      queryFn: () => fetchUserById(user.id),
    };
  }),
)``;
```

## クエリを順次に実行する

- クエリの実行結果を使って別のクエリを実行するには、`enabled`オプションを使用する。
- `isIdle` は初めは `true`となる。`enabled`になりデータ取得が始まると`false`になる

```ts
// ユーザIDの取得
const { data: user } = useQuery(['user', email], getUserByEmail);
const userId = user?.id;

// ユーザIDを使用して、プロジェクトを取得
const { isIdle, data: projects } = useQuery(
  ['projects', userId],
  getProjectsByUser,
  {
    // userIDが存在する場合のみこのクエリを実行する
    enabled: !!userId,
  },
);
```

## バックグラウドでのデータ取得をユーザに通知する

- `isFetching`を使う。
  - `isFetching`はあらゆる通信で`true`となる
  - `idLoading`は初回データ取得の時だけ`true`となる
- アプリ全体での通信状態を取得したい場合は`useIsFetching`を使用する

## Window Focus Refetching

- デフォルトで有効になっている
- 詳細略

## クエリの無効化・停止

`enabled`オプションを`false`設定することで以下のようになる。

- キャッシュデータが存在する場合は、`isSuccess`状態になり、かつ`data`が提供される
- キャッシュデータがない場合は`isIdle`状態になる
- マウント時にクエリが実行されない
- バックグラウンドで再クエリされない
- `invalidateQueries`や`refetchQueries`が発火されても再クエリしない
- `refetch`を使って手動でクエリを実行できる

## リトライ

デフォルトで有効。詳細略。

## ページネーション

- 普通にページネーションしようとすると、切り替えのたびに画面がローディング中になり、がたつく。これを防ぐには`keepPreviousData`オプションを有効にする。
  - ユニークキーが変更されても、前回取得した`data`が利用可能で、かつステータスが毎回`isLoading`にならない
  - データ取得が成功すると`data`が差し替えられる
  - `isPreviousData`フラグが提供される

詳細略

## Infinite Queries

略

## Placeholder Query Data

略

## Initial Query Data

略

## Prefetching

略

## Mutations

データを作成・更新・削除する場合は`useQuery`ではなく`useMutation`を使う。

```ts
const {
  status,
  isLoading,
  isError,
  isSuccess,
  mutate,
  error,
  data,
} = useMutation((newTodo) => axios.post('/todos', newTodo));

mutate({ id: 1234, title: 'hello' });
```

- `isIdle` or `status === 'idle'` アイドル状態、フレッシュな状態、リセットされた状態
- `isLoading` or `status === 'loading'` 通信中
- `isError` or `status === 'error'` エラー
  - `error` レスポンス
- `isSuccess` or `status === 'success'`
  - `data` レスポンス
- `reset` --- `error`や`data`をリセットする
- `mutate` データを更新する。渡せる引数は 1 つ。

これだけならなんの変哲もないが、`invalidateQeries`や`setQueryData`と組み合わせることで強力になる。

### Mutation Side Effects

- mutation 時に Side Effects を実行できる
- mutation 後の invalidation, refetching や optimistic update に使用する
- `async`が使用できる

```ts
useMutation(addTodo, {
  onMutate: (variables) => {
    // mutationの直前に実行される

    // 任意のコンテキストを返すこともできる
    const context = { id: 1 };
    return context;
  },
  onError: (error, variables, context) => {
    console.log(`rolling back optimistic update with id ${context.id}`);
  },
  onSuccess: (data, variables, context) => {},
  onSettled: (data, error, variables, context) => {
    // 成功時・エラー時どちらでも実行される
  },
});
```

`useMutation`だけでなく、`mutate`にも記載できる。この場合、`useMutation`の後に実行される。

```ts
mutate(todo, { onSuccess, onError, onSettled });
```

### Promises

`mutateAsync`を使えば Promise 形式で Side Effects を記載することもできるが、省略。

### Retry

mutation ではエラー時の再試行はデフォルトで無効化されている。必要なら`retry`オプションを指定する。

### Persist mutations

オフライン時に実行中の mutation を永続化しておき、復帰時に再実行することもできる。高度すぎるため省略。

## Query Invalidation

- mutation 後に、必要に応じてクエリを無効化する(Query Invalidation = キャッシュを古いものと認識させること)。
- クエリが無効化されると、キャッシュデータが強制的に`stale`になったうえでデータ再取得が行われる。

```ts
// Invalidate every query in the cache
queryClient.invalidateQueries();
// Invalidate every query with a key that starts with `todos`
queryClient.invalidateQueries('todos');
```

### どのクエリを無効化するか

先頭のキーが一致するものは全て無効化される

```ts
// キーが一つ
queryClient.invalidateQueries('todos');
// 両方とも無効化される
const todoListQuery = useQuery('todos', fetchTodoList);
const todoListQuery = useQuery(['todos', { page: 1 }], fetchTodoList);
```

```ts
// キーが二つ
queryClient.invalidateQueries(['todos', { type: 'done' }]);
// こっちは無効化される
const todoListQuery = useQuery(['todos', { type: 'done' }], fetchTodoList);
// こっちは無効化されない
const todoListQuery = useQuery('todos', fetchTodoList);
```

完全一致するものだけを無効化するには`exact`オプションを使う

```ts
queryClient.invalidateQueries('todos', { exact: true });
// 無効化される
const todoListQuery = useQuery(['todos'], fetchTodoList);
// 無効化されない
const todoListQuery = useQuery(['todos', { type: 'done' }], fetchTodoList);
```

もっと詳細なコントロールもできるけど省略

## Invalidation from Mutations

- 前項は Invalidation のやり方(How)の話
- 本項は Invalidation をいつ(When)やるのかという話
- mutation が成功したときは、まさにその時だよね

```ts
import { useMutation, useQueryClient } from 'react-query';

const queryClient = useQueryClient();

const mutation = useMutation(addTodo, {
  onSuccess: () => {
    queryClient.invalidateQueries('todos');
    queryClient.invalidateQueries('reminders');
  },
});
```

## Mutation のレスポンスを使ってクエリを更新する

- 更新時のレスポンスを使ってクエリを更新すれば、ネットワークリソースを効率的に使用できる
- `queryClient.setQueryData`を使う

```ts
const queryClient = useQueryClient();

const mutation = useMutation(editTodo, {
  onSuccess: (data, variables) =>
    queryClient.setQueryData(['todo', { id: variables.id }], data),
});

mutation.mutate({
  id: 5,
  name: 'Do the laundry',
});

// 場合によっては上記をひっくるめてhook化しておくとよい。詳細略。
```

## 楽天的更新

略

## Query Cancellation

略

## Scroll Restoration

- スクロールポジションの復元については、React Query では特に心配する必要がない。
- なぜなら、データがキャッシュされている限り、再マウント時などでも同期的にデータが取得でき、前回と全く同じ通り画面が描写されるため。

## Query Filters

- Query Filters とは、クエリをフィルタするためのオブジェクト
- `cancelQueries`, `removeQueries`, `refetchQueries`などに渡して使うことができる
- 指定できるキー
  - `exact`
  - `active`
  - `inactive`
  - `stale`
  - `fetching`
  - `predicate` --- 手動で詳細にフィルタしたい時に使う
  - `queryKey`

```ts
// 全てのクエリ（Query Filters指定しないパターン）
await queryClient.cancelQueries();

// 全ての非アクティブなクエリ
queryClient.removeQueries('posts', { inactive: true });

// 全てのアクティブなクエリ
await queryClient.refetchQueries({ active: true });

// `post`で始まる全てのクエリ
await queryClient.refetchQueries('posts', { active: true });
```

## SSR & Next.js

略

## Caching

略

## Default Query Function

```tsx
// デフォルトクエリ関数を作る
const defaultQueryFn = async ({ queryKey }) => {
  const { data } = await axios.get(
    `https://jsonplaceholder.typicode.com${queryKey[0]}`,
  );
  return data;
};

// クライアント作成時にデフォルトクエリ関数をセットしておく
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
    </QueryClientProvider>
  );
}

// 使用するときはキーだけ渡せばOK
function Posts() {
  const { status, data, error, isFetching } = useQuery('/posts');
  // ...
}

// なお、デフォルトクエリ関数がセットされている場合は、第二引数にクエリ関数ではなくオプションを記載できる
function Post({ postId }) {
  const { status, data, error, isFetching } = useQuery(`/posts/${postId}`, {
    enabled: !!postId,
  });
  // ...
}
```

## Suspense

実験的なモードです

## Testing

略
