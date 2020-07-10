# Redux - Style Guide

[[toc]]

## 絶対に守ること

### state を改変しない

- あらゆるバグのもとになる
- `redux-immutable-state-invariant`や`immer`などのツールを活用せよ

### reducers に side effect を記載しない

- reducer の結果は state と action にのみ依存すること
- 下記のようなものを reducer に記載しないこと
  - ajax, timeout, promise などの非同期処理
  - Date.now()などの乱数生成

### シリアライズ出来ない値を state や action に含めない

- Promise, Symbols, Maps/Sets, Functions, Class instances など
- ただし reducer に届くまでに`redux-thunk`などのミドルウェアで処理される場合は除く

### 複数の store を作らない

## 強い推奨事項

### Redux Toolkit を使え

### immer を使え

### フォルダ構成は Feature Folders か、少なくとも Ducks にせよ

- ファイルの種類(reducers, actions, etc)でフォルダ分けするな
- Feature Folders --- 特定の機能に関する全てのファイルを一つのフォルダにまとめる
- Ducks --- 特定の機能のうち redux に関する部分のみを一つのファイルにまとめる

### ロジックはなるべく reducers に記載せよ

- action の発出側(onClick など)ではなく、reducer 側に積極的にロジックを記載せよ
- これによりテスト性やデバッグの容易さが高まるうえ、ミスも減る
- id の採番など、場合によっては発出側でしか行えない処理もあるが、最小限におさえること

### reducer で state の構造をしっかり管理せよ

- Reducer の責務
  - 初期値を決定する
  - state を正しい形式に維持する(必要に応じて action.payload のバリデーションを行うなど)
- blind spread`return {...state, ...action.payload}`や、blind return `return action.payload`は避けること。
  - これは state の形式を決定する責務が action 発出側に漏れ出している状態であるため
  - フォーム内のデータを編集する際は使って良いかも。要素ごとに action creators を書くのは時間の無駄だからね。
- 利便性の観点から、単一の root reducer ではなく、複数の slice reducer で state を管理すると良い

### state の slice 名は格納するデータの名前にせよ

- `{users: {}, posts: {}}`がよい
- `{usersReducer: {}, postsReducer: {}}`はだめ

### reducer を state machines として扱え

- 通常は action だけを見て無条件で値を更新しがちだが、これはバグを生みやすい
- state を考慮しながら、値を更新するかどうかを決定するとよい(これを state machine という)
  - 例えば、読み込み状態が'loading'なのに新しいデータが飛んできた場合は無視する、など

### ネストしたデータは正規化して管理せよ

- 簡単にルックアップできる
- 更新が簡単
- 良いパフォーマンス

### action はイベントとして扱え。セッターとして使うな。

- 「何が起こったか」で命名する `action.payload === 'user/nameUpdated'`
  - 意味がわかりやすい
  - dispatch される action の数が減る
  - ログが見やすい
- セッターとして命名しない `action.payload === 'user/setNewName'`

### 意味のあるアクション名にする

- `SET_DATA`や`UPDATE_STORE`といった無意味な名前にしない

### 単一のアクションに複数の reducer が反応する構成を検討する

- スケールしやすい
- 発出すべき action の数を減らせる

### 複数の action を順番に発出しない

- A,B,C を順に発出すると、中間でおかしな state になる可能性がある
- なるべく一発の action で全てを更新せよ
- どうしても必要な場合は`react-redux`の`batch()`を使え

### 値を store に保存すべきか常に考える

下記の場合は store で管理するとよい

- 別のコンポーネントでその値が必要
- その値から派生した別の値を生成する必要
- 複数のコンポーネントで同じデータが使用されている
- タイムトラベルデバッグが必要
- キャッシュ機能が必要
- Hot-reloading されたときに値を保持する必要がある

### 積極的に多くのコンポーネントを store に接続する

- その方がパフォーマンスが上がる

### mapDispatch はオブジェクト形式で書け

- object shorthand のほうが読みやすい
- 関数形式で書く必要はほぼない

### useSelector は何回かに分けて呼ぶ

- でかいデータを一発で取得せず、細かく分けて取得する
- そうすれば再描写の可能性が下がる
- mapState と異なり、useSelector はオブジェクトを返す必要はない
- とはいえ、バランスを考えて。コンポーネントが slice 全体のデータを利用する場合は一発で取得しても問題ない。

### 型を使え

- ミスが減るしドキュメント性も高まるので
- redux-toolkit は TypeScript に最適化されているのでそっちも使ってね

### Redux DevTools を使え

- これを使わないなら redux を使う意味も半減よ

### state はプレーンなオブジェクトにする

- Immutable.js のような特殊なものを使うな

## 推奨

### `domain/eventName`の形式でアクションを命名せよ

- `SCREAMING_SNAKE_CASE`などの形式はもはや非推奨

### Flux Standard Action にしたがえ

- `{type, payload, meta, error}`の形式

### action creator を使う

- 一貫性が保たれるため
- redux-toolkit の createSlice の利用を推奨

### 非同期処理には thunk を使え

- ほとんどのケースに最適
- `async/await`で読みやすく書ける
- saga や observable を使うのは下記をバリバリ使う場合
  - キャンセル
  - デバウンス
  - action の後に action を発出する
  - background-thread な処理を行う

### 複雑なロジックはコンポーネントの外に出す

- 同期・非同期問わず、複雑な処理はコンポーネントの外(主に thunk、あるいは hook)に外出ししていく

### selector を使う

- `reselect`を使って、メモ化された値を取得せよ

### フォームの値を redux で管理するな

- ほとんどのフォームの値は下記の理由により redux で管理する必要がない
  - グローバルにする必要がない
  - キャッシュする必要がない
  - 複数のコンポーネントで使用しない
  - パフォーマンスが悪化する
- 少なくとも、編集中の値はローカルで管理し、最終的な値だけ redux で管理するに留める
