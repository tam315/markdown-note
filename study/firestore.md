# Firestore

[[toc]]

## データの追加と管理

### データモデル

#### ドキュメント

一つの JSON データ。
なお、ドキュメント内のネストされた Object のことを「マップ」という

#### コレクション

ドキュメントのコンテナ。自動で作成・削除される。

#### リファレンス

ドキュメントへのリファレンス

```js
db.collection('users').doc('alovelace');
db.doc('users/alovelace');
```

コレクションへのリファレンス

```js
db.collection('users');
```

サブコレクション内へのリファレンス

```js
db.collection('rooms')
  .document('roomA')
  .collection('messages')
  .document('message1');
```

### データ構造の選択

- 単純にネストさせる
  - 簡単
  - ネストされたリストにはクエリを実行できない
  - ドキュメントが大きくなりがち
- サブコレクションを使う
  - 親ドキュメントのサイズが変わらない
  - クエリが使える（複数のサブコレクション間は不可）
  - サブコレクションの削除が面倒
- ルートレベルのコレクション
  - クエリが強力

### データの追加

```js
const db = firebase.firestore();
```

#### 更新

`set`を使う。`merge`オプションをつけると、既存データにマージされる。ないと、まるごと上書きされるので注意する。

```js
db.doc('users/someSpecificId').set(
  {
    name: 'Ada',
  },
  { merge: true },
);
```

#### 一部の更新

ドキュメント全体を上書きせずにドキュメントの一部のフィールドを更新するには、`update()` メソッドを使用する。

```js
db.collection('cities')
  .doc('DC')
  .update({
    capital: true,

    favorites: { color: 'Blue' },
    // なお、上記は下記のように書くこともできる
    'favorites.color': 'Red',

    // 更新日時を記録しておく方法
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  });
```

#### 新規追加

`set`もしくは`add`を使う。

```js
// ドキュメントのIDを自動生成する場合(どちらも等価)
db.collection('users').add({
  name: 'Ada',
});
db.collection('users')
  .doc()
  .set({
    name: 'Ada',
  });

// ドキュメントのIDを指定する場合
db.doc('users/someSpecificId').set(
  {
    name: 'Ada',
  },
  { merge: true },
);
```

### アトミックオペレーション

- トランザクション　「読み書き」をまとめて行う
- 一括書き込み　「書き込み」をまとめて行う

いずれも、最大 500 ドキュメントまで。

#### トランザクション

フィールドの値を、その現行値またはその他のフィールドの値に基づいて更新する場合には、トランザクションが便利です。

`get`,`set`,`update`,`delete`などが使える。注意点は下記のとおり。

- `get`は、`set`,`update`,`delete`の**前**に実行する必要がある
- `get`したドキュメントが、トランザクション実行中に他者に編集された場合は、トランザクションはやり直しされる。
- トランザクション関数の中でアプリケーションの状態を直接変更してはダメ（複数回実行されることがあるから）
- クライアントがオフラインの場合、トランザクションは失敗する

```js
// Create a reference to the SF doc.
var sfDocRef = db.collection('cities').doc('SF');
sfDocRef.set({ population: 0 });

const result = await db.runTransaction(transaction => {
  // This code may get re-run multiple times if there are conflicts.
  const sfDoc = await transaction.get(sfDocRef);

  var newPopulation = sfDoc.data().population + 1;
  transaction.update(sfDocRef, { population: newPopulation });

  return newPopulation;
});

// アプリケーションの状態変更は、トランザクション関数の完了後に行うこと！
console.log('newPopulation:', result);
```

#### 一括書き込み

読み取り(`get`)が不要の場合は、`batch`を使う。

- トランザクションより失敗が少ない
- シンプル
- クライアントがオフラインでも成功する

```js
var batch = db.batch();

var nycRef = db.collection('cities').doc('NYC');
batch.set(nycRef, { name: 'New York City' });
var sfRef = db.collection('cities').doc('SF');
batch.update(sfRef, { population: 1000000 });
var laRef = db.collection('cities').doc('LA');
batch.delete(laRef);

batch.commit().then(function() {
  // ...
});
```

#### データの検証

セキュリティルールにおいて`getAfter()`ルール関数を使うことで、関連するドキュメント群が常に整合性を持った状態で更新されるように、設定することができる。

```js
// citiesを更新するときは、countriesの編集日時も一緒に更新されていることを保証
match /cities/{city} {
  allow getAfter(
          /databases/$(database)/documents/countries/$(request.resource.data.country)
        ).data.last_updated == request.time;
}

match /countries/{country} {
  allow write;
}
```

### データの削除

#### ドキュメントの削除

`delete()`を使う。

```js
await db
  .collection('cities')
  .doc('DC')
  .delete();
```

#### フィールドの削除

`FieldValue.delete()`を使う。

```js
await db
  .collection('cities')
  .doc('BJ')
  .update({
    capital: firebase.firestore.FieldValue.delete(),
  });
```

### データのインポートとエクスポート

必要になったら[こちらを参照](https://firebase.google.com/docs/firestore/manage-data/export-import)

## データのクエリ

### データの取得

データの取得には次の 2 つの方法がある。

- メソッドを呼び出す `doc().get().data()`
- イベントを受信する `doc().onSnapshot()`

これらを、下記のそれぞれに対して行うことができる

- ドキュメント
- コレクション
- クエリ結果

### `data()`による取得

#### 単一ドキュメントの取得

```js
const documentSnapshot = await db.doc('testcollection/some-id-98734').get();
console.log(documentSnapshot.data());
```

#### 複数ドキュメントの取得

```js
const querySnapshot = await db
  .collection('testcollection')
  .where('owner', '==', 'some-uid')
  .get();
querySnapshot.forEach(queryDocumentSnapshot =>
  console.log(queryDocumentSnapshot.data()),
);
```

### `onSnapshot()`による取得

データの変更を Listen し、アップデートされるたびに処理を実行する。

```js
// 特定のドキュメント
db.collection('cities')
  .doc('SF')
  .onSnapshot(doc => {
    console.log('Current data: ', doc.data());
  });

// 特定のデータ群（stateがCAのもの）
db.collection('cities')
  .where('state', '==', 'CA')
  .onSnapshot(querySnapshot => {
    var cities = [];
    querySnapshot.forEach(doc => {
      cities.push(doc.data().name);
    });
    console.log('Current cities in CA: ', cities.join(', '));
  });
```

#### 保留中の書き込み

ローカル側でのデータ変更は、サーバ側への反映を待たずに、すぐに`onSnapshot`を呼び出す。これは、レイテンシを向上させるために、楽天的なデータ変更を行っていることが理由である。現在のデータの状態を確認するには、`hasPendingWrites`を使う。

```js
db.collection('cities')
  .doc('SF')
  .onSnapshot(function(doc) {
    var source = doc.metadata.hasPendingWrites ? 'Local' : 'Server';
    console.log(source);
  });
```

書き込み完了時にも`onSnapshot`を呼び出したい場合は、オプションを設定する(デフォルトでは呼び出されない)。
もし、単に書き込みの完了のみを検知したい場合は、`set`や`update`を行う際に`.then()`をチェーンすれば OK。

```js
db.collection('cities')
  .doc('SF')
  .onSnapshot(
    {
      // Listen for document metadata changes
      includeMetadataChanges: true,
    },
    function(doc) {},
  );
```

#### 変更内容の確認

`docChanges()`を使用して、スナップショット間の差分を取得できる。

```js
db.collection('cities').onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    if (change.type === 'added') {
      console.log('New city: ', change.doc.data());
    }
    if (change.type === 'modified') {
      console.log('Modified city: ', change.doc.data());
    }
    if (change.type === 'removed') {
      console.log('Removed city: ', change.doc.data());
    }
  });
});
```

#### リスナのデタッチ

```js
var unsubscribe = db.collection().onSnapshot();
unsubscribe();
```

#### リッスンエラーの処理

権限設定などの失敗により、リッスンが失敗することがある。予め第 2 引数にエラーハンドを渡しておくと、unsubscribe しなくて良いので便利。

```js
db.collection('cities').onSnapshot(snapshot => {}, error => {});
```

### クエリ

基本的にクエリ機能は弱い。

#### シンプルなクエリ

```js
var citiesRef = db.collection('cities');

citiesRef.where('state', '==', 'CA');
citiesRef.where('capital', '==', true);
citiesRef.where('population', '<', 100000);
citiesRef.where('name', '>=', 'San Francisco');
```

#### 複合クエリ

- `where`をチェーンすることで AND 検索になる
- 範囲比較（`<`など）を複数のフィールドに使用することはできない。
- 等価演算子（`==`）と範囲比較（`<`など）を組み合わせるときはカスタムインデックスの作成が必要。

```js
citiesRef.where('state', '==', 'CO').where('name', '==', 'Denver');

// カスタムインデックスが必要
citiesRef.where('state', '==', 'CA').where('population', '<', 1000000);

// 下記は動かない
citiesRef.where('state', '>=', 'CA').where('population', '>', 100000);
```

## セキュリティルール

### 基本形

```js
service cloud.firestore {
  match /databases/{database}/documents {
    // ここにmatchを記載
  }
}
```

### 権限の種類

- read
  - get
  - list
- write
  - create
  - update
  - delete

権限設定の基本例

```txt
allow list, write: if <condition>
```

### match

ネストさせてもいいし、しなくてもいい。

```txt
match /cities/{city} {
  match /landmarks/{landmark} {
    allow read, write: if <condition>;
  }
}
```

再帰ワイルドカード構文

```txt
match /cities/{document=**} {
  allow read, write: if <condition>;
}
```

### `request`, `resource`

- `request` リクエストを扱う API
  - `request.auth.uid` リクエストユーザの ID
  - `request.resource.data.***` 書き込もうとしているデータ
- `resource` 既存データを扱う API。存在しない場合は null になる
  - `resource.data.***` 既存データ自体

下記の例では、自身が owner のデータにのみアクセスできるように設定している。

```js
match /portfolios/{portfolioId} {

  // 既存データが存在しない、かつ、
  // 書き込むデータの`owner`キーにUIDが正しくセットされているか
  function isValidNewPortfolio() {
    return resource == null
      && request.resource.data.owner == request.auth.uid;
  }

  // 既存データのownerであるか
  function isOwner() {
    return request.auth.uid == resource.data.owner;
  }

  allow read, write: if isOwner() || isValidNewPortfolio();
}
```
