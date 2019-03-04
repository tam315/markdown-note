# React - Hook

[[toc]]

## Introducing Hooks

### Hook とは

Hook とは、React 16.8 でリリースされた、**ステート**や**ライフサイクルメソッド**を持つコンポーネントをファンクションで作成するための仕組み。

また、React の state やライフサイクルメソッドに`hook into`（接続する）ための関数のこと。

#### いままで（クラス）

```js
class Example extends React.Component {
  constructor(props) {
    this.state = { count: 0 };
  }

  render() {
    return (
      <div>
        <p>You clicked {count} times</p>
        <button
          onClick={() => this.setState(state => ({ count: state.count + 1 }))}
        >
          Click me
        </button>
      </div>
    );
  }
}
```

#### これから（Hook）

```jsx
function Example() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

### Hooks が生まれた背景

#### ステートフルなロジックを簡単に再利用するため

これまでは、ステートフルなロジック(State + Side Effect(Lifecycle Method))を React に注入するために`render props`や`HOC`を使ってきたが、それらは下記の問題を抱えていた。Hook はこれらの問題を全て解消する。

- コンポーネントを再構成しないとステートフルなロジックを再利用できない
- コードが読みにくくなる（Wrapper Hell）
- コンポーネントからステートフルなロジックを分離できない
- ステートフルなロジックのテストと、コンポーネントのテストを分離できない

#### コンポーネントをシンプルにするため

今までは、`componentDidMount`といった一つのライフサイクルメソッドに、複数の無関係な処理（データ取得、何らかの初期化処理、その他）がごちゃまぜになっていた。これにより、コードが読みにくくなり、バグの温床にもなっていた。

Hook を使うことにより、これらの処理を「ライフサイクルメソッドごと」ではなく、「関連する機能ごと」で関数に分割できる。

#### JavaScript のクラスは人にもマシンにも良くない

`this`や`bind`など、JavaScript のクラスは変な癖があり、多くの初学者にとってハードルが高い。

また、マシンにとっても、クラスが使ってあることで minify や最適化をやりにくくなる。

### 段階的な移行のススメ

クラスベースのコンポーネントを廃止する計画はない。既存のコードを Hooks で書き直すことはせずに、新規コードから徐々に移行することをおすすめする。

## Hooks の概要

### State Hook

```js
import React, { useState } from 'react';

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

- `useState`が State Hook である。
- `useState`は、function component が複数回呼ばれた（再レンダリングされた）場合も、前回の state の値を保持している
- `useState`は、値と、値を更新するファンクションを返す。
- `useState`には初期値を渡す。
- 2 回目以降の render 時には、`useState`に渡した値（初期値）は単に無視される。
- `this.setState`と異なり、値はオブジェクトでなくてもよい。
- `this.setState`と異なり、オブジェクトをマージするような機能はない。

#### なぜ`createState`という名前ではないのか

初回の render 時に state を「作成」するだけでなく、2 回目以降の render 時には state を「取得」する役割があるから。

#### 複数の State を使う

```js
function ExampleWithManyStates() {
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
  // ...
}
```

### Effect Hook

`Side Effects(≒effects)`とは、データの取得やサブスクリプションなどの処理のこと。一般的にはライフサイクルメソッドとして書かれる。

名前の由来は、render メソッドの外（=side）に記述することと、コンポーネントの描写に影響を与える(effect)ことである。（render に書くと頻繁に呼ばれすぎる）

```js
import React, { useEffect } from 'react';

function Example() {
  useEffect(() => {
    // ここが`componentDidMount`と`componentDidUpdate`に該当
    document.title = `You clicked ${count} times`;

    return () => {
      // ここが`componentWillUnmount`に該当
      document.title = '';
    };
  });
  return <div />;
}
```

- `useEffect`が Effect Hook である。
- 下記の 3 つを 1 つにまとめたものである
  - `componentDidMount`
  - `componentDidUpdate`
  - `componentWillUnmount`
- 初回を含め、**レンダリング後に毎回呼ばれる**。
  - `componentDidMount`と`componentDidUpdate`が一緒になっているようなもの。
  - props が変化するたびに毎回呼ばれることで、[props の変化を漏らさず捕捉し、必ず適切なクリーンアップを毎回行い、もってバグを減らす](https://reactjs.org/docs/hooks-effect.html#explanation-why-effects-run-on-each-update)ことができる
- `useEffect`に記載した内容は、**レンダリングの後**に行われる(でなければ useEffect を使う意味が薄れる)
- `componentDidMount`などと異なり、`useEffect`はレンダリングをブロックしない。ブロックしたい場合は、類似品の`useLayoutEffect`を使うこと。

#### useEffect が呼ばれる条件を変更する

「props が変化するたびに毎回呼ばれる」という動作を変更するには、第 2 引数に、変化を補足したい state や props を指定する。空配列(`[]`)を指定すると、初回マウント時にだけ実行される（`componentDidMount`と同じ動作になる）。

いずれ、これらの配列を明示的に渡さなくても、自動で最適化されるようになる予定らしい。

```js
useEffect(() => {}, [count]); // 初回及び`count`の値が変化した時に実行される
useEffect(() => {}, []); // 初回のみ実行される
```

#### 複数の Effect Hook

```js
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0);
  useEffect(() => { /* do something */});

  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => { /* do something */});
})
```

### Hook に関する絶対的ルール

- Hook は 「React function component」及び「カスタム Hook」 の**トップレベル**でのみで使え
- Hook をループや if 文や子ファンクションの中で呼ぶな
- Hook は 通常の関数から呼ぶな
- [`eslint-plugin-react-hooks`](https://reactjs.org/docs/hooks-rules.html#eslint-plugin)を使ってルールが守られているかチェックしろ

### カスタム Hook を作る

カスタム Hook を作ることで、ロジックを再利用可能にすることができる。

カスタム Hook は、React の機能というよりは、関数を使って Hook に関する重複処理を排除するための、ただの慣習である。

例えば、ユーザのログイン状態を表す state をコンポーネントに注入する Hook の例は以下の通り（いままでなら HOC などを使ってやらざるを得なかったところ）

カスタム Hook

```js
import React, { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

コンポーネント

```js
// コンポーネント1
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}

// コンポーネント2
function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id);

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>{props.friend.name}</li>
  );
}
```

- Hook は、「State 自体」ではなく、「State を提供するロジック」を保持している。このため、上記の 2 つのコンポーネントにある`isOnline`は完全に独立している。
- カスタム Hook は、アニメーション、サブスクリプション、タイマー、ブラウザイベントなど、どんなものでも対象にできる。
- カスタム Hook の名前は`use****`の形式でつけること。

## その他の Hook API

- `useContext` --- コンテキストを使う
- `useReducer` --- リデューサーを使う
- `useCallback` --- コールバックをメモ化して子コンポーネントに渡す時に使う。無駄な再描写を防ぐために使う。
- `useMemo` --- メモ化の機能を使いながら値を計算する。パフォーマンス最適化のために使う。
- `useRef` --- DOM への参照を取得するときに使う
- `useImperativeHandle` --- 親から子を ref で操作する時に使うっぽいがよくわからない
- `useLayoutEffect` --- 同期版の`useEffect`である。従来の`componentDidMount`等と同じ。
