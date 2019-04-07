# React - Context

[[toc]]

## 参考

- [Context vs Redux](https://www.youtube.com/watch?v=OvM4hIxrqAw)
- [Context w/ Hooks](https://www.youtube.com/watch?v=R_7XRX7nLsw)

## 利用シーン

ある値を、様々な階層に存在する複数のコンポーネントで使用したい場合に使う。コンポーネントの再利用性が下がるため、乱用しないこと。

基本的に、Flux を完全に置き換えるために設計されたものではない。

- 低頻度に更新されるものに使う（テーマ、言語、ログイン状態など）。
- 高頻度に更新されるものには不向き（キーストロークごとの更新など）。そういったものはローカル State 等で管理したほうがいい。

## 使い方

詳細は[こちらのコード](https://github.com/academind/react-redux-vs-context/tree/context-hooks)を参照

### コンテキストの作成

```js
const MyContext = React.createContext(defaultValue);
```

defaultValue は、先祖に該当する Provider がなかったときのみ使用される点に注意する。主にコンポーネントの単体テストの時にのみ使われる。

通常は、後述のとおり、`SomeContext.Provider`の`value`属性に渡した値が defaultValue になる。

### 先祖側

GlobalState.jsx などのコンポーネントを作り、そのローカルステートで Context の値を管理する。

```js
<SomeContext.Provider value={{user:1, updateUser:()=>{...}} />
```

などで子を囲む

### 子側

- クラスコンポーネントかつコンテキストが 1 つの場合 --- `Class.contextType`を使う
- クラスコンポーネントかつコンテキストが 2 つ以上の場合 --- `Context.Consumer`を使う
- ファンクションコンポーネントの場合 --- `useContext()`を使う
