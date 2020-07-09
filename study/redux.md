# Redux - Normalization

[[toc]]

## 非正規データの弊害

- ネストされたデータをそのまま扱うことには下記の弊害がある
  - 同一データが複数の場所に散在するため、一貫性のある更新が困難
  - ネストしたデータを更新する reducer は見づらい
  - ネストしたデータを更新すると祖先のデータも更新され、結果として大量の再描写が発生する
- このことから、正規化してデータを持つことが推奨される

```js
// 非正規データの例
const blogPosts = [
  {
    id: 'post1',
    author: { username: 'user1', name: 'User 1' },
    body: '......',
    comments: [
      {
        id: 'comment1',
        author: { username: 'user2', name: 'User 2' },
        comment: '.....',
      },
      {
        id: 'comment2',
        author: { username: 'user3', name: 'User 3' },
        comment: '.....',
      },
    ],
  },
  {
    id: 'post2',
    author: { username: 'user2', name: 'User 2' },
    body: '......',
    comments: [
      {
        id: 'comment3',
        author: { username: 'user3', name: 'User 3' },
        comment: '.....',
      },
      {
        id: 'comment4',
        author: { username: 'user1', name: 'User 1' },
        comment: '.....',
      },
      {
        id: 'comment5',
        author: { username: 'user3', name: 'User 3' },
        comment: '.....',
      },
    ],
  },
];
```

### 正規化の基本コンセプト

- データの種類ごとに「テーブル」を state に作成する
- テーブルは以下の 2 つのオブジェクトを持つ
  - 「キーが ID、値がデータ」のオブジェクト(下記の`byId`)
    - ここで実際のデータを管理する
    - 個々のアイテムを参照するときは ID を使って行う
  - 全ての ID を持つ配列(下記の`allIds`)
- 必要に応じて[Normalizr](https://github.com/paularmstrong/normalizr)などのライブラリを使うと良い

```js
// 正規化済みのデータ
const normalizedState = {
  posts: {
    byId: {
      post1: {
        id: 'post1',
        author: 'user1',
        body: '......',
        comments: ['comment1', 'comment2'],
      },
      post2: {
        id: 'post2',
        author: 'user2',
        body: '......',
        comments: ['comment3', 'comment4', 'comment5'],
      },
    },
    allIds: ['post1', 'post2'],
  },
  comments: {
    byId: {
      comment1: {
        id: 'comment1',
        author: 'user2',
        comment: '.....',
      },
      comment2: {
        id: 'comment2',
        author: 'user3',
        comment: '.....',
      },
      comment3: {
        id: 'comment3',
        author: 'user3',
        comment: '.....',
      },
      comment4: {
        id: 'comment4',
        author: 'user1',
        comment: '.....',
      },
      comment5: {
        id: 'comment5',
        author: 'user3',
        comment: '.....',
      },
    },
    allIds: ['comment1', 'comment2', 'comment3', 'commment4', 'comment5'],
  },
  users: {
    byId: {
      user1: {
        username: 'user1',
        name: 'User 1',
      },
      user2: {
        username: 'user2',
        name: 'User 2',
      },
      user3: {
        username: 'user3',
        name: 'User 3',
      },
    },
    allIds: ['user1', 'user2', 'user3'],
  },
};
```

### 正規化のメリット

- データの更新は 1 箇所だけ行えば良い
- reducer において深くネストしたデータを更新しなくていい
- データの取得や更新がシンプルかつ一貫性を持ったものになる
  - データの種類と ID を指定するだけで、検索をかけることなく直接ルックアップできる
- 更新時の UI への影響範囲が最小限になる

正規化を行うと「限られたコンポーネントが store に接続して、ネストした大量のデータを取得して子孫に渡していく」スタイルから「**多くのコンポーネントが個々に store に接続して最小限のデータを取得する**」ようになる。

親も子孫も store に接続したうえで、親から子へ渡す props は id だけ、というパターンにしておくのが、もっとも UI パフォーマンスがよい。

### state の構成例

- 正規化したデータは共通のキー(`entities`など)の下に集約するのがおすすめ
- 現在の値と編集中の値を分ける方法の例
  - 編集 --- "entities"から必要なデータを"work-in-progress"な場所にコピーして編集する
  - 適用 --- "work-in-progress"な場所から"entities"にデータをコピーする
  - 編集のリセット --- "work-in-progress"な場所をクリアし、"entities"から必要なデータを"work-in-progress"な場所に再びコピーする

```txt
{
    simpleDomainData1: {....},
    simpleDomainData2: {....},
    entities : {
        entityType1 : {....},
        entityType2 : {....}
    },
    ui : {
        uiSection1 : {....},
        uiSection2 : {....}
    }
}
```

## 正規化したデータの更新方法

- 例えば前述の Comments を更新する場合の方法を検討してみよう
- この場合、下記の 4 つの state の更新が必要になる
  - `state.entities.posts['該当するpostId'].comments`にコメント ID を追加
  - `state.entities.comments.byId`にコメントを追加
  - `state.entities.comments.allIds`にコメント ID を追加

### スタンダードな方法 (単純なマージ)

- reducer の記述は最小で住む
- 一方で、action の発出側で整合性のとれた全データを作成するのが大変
- 追加・更新は可能だが、削除はできない

```js
import merge from 'lodash/merge';

function commentsById(state = {}, action) {
  switch (action.type) {
    default: {
      if (action.entities?.comments) {
        return merge({}, state, action.entities.comments.byId);
      }
      return state;
    }
  }
}
```

### スタンダードな方法 (Slice Reducer Composition)

- 下記のそれぞれに case reducer を作成し、タスク(コメントの追加など)に適切に対応させる[方法](https://redux.js.org/recipes/structuring-reducers/updating-normalized-data#slice-reducer-composition)
- これが一番シンプルでよいかも

```txt
{
  entities:{
    posts:{
      byId, ←これ
      allIds, ←これ
    },
    comments:{
      byId, ←これ
      allIds, ←これ
    }
  }
}
```

### その他の方法 (Task-Based Updates)

- タスク(コメントの追加など)で必要となる処理を一括で記載した reducer を作成する方法
- この reducer はトップレベルに配置する必要がある
- `immer`を内包した`redux-toolkit`を使えばコードはかなりすっきりする
- タスクで必要となる処理が見渡せる一方で、state 全体の知識が必要になるため、あまり良くないかも

```js
import { createReducer } from '@reduxjs/toolkit';
const addCommentFeatureReducer = createReducer(
  {},
  {
    ADD_COMMENT: (state, action) => {
      const { payload } = action;
      const { postId, commentId, commentText } = payload;

      state.posts.byId[postId].comments.concat(commentId);
      state.comments.byId[commentId] = { id: commentId, text: commentText };
      state.comments.allIds.concat(commentId);
    },
  },
);
```
