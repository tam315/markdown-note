# Firebase - Firestore

[[toc]]

## API

- [Web](https://firebase.google.com/docs/reference/js/firebase.firestore)
- [Node.js](https://firebase.google.com/docs/reference/admin/node/admin.firestore)

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

子データ群をどのようにもつか

- 単純にネストさせる
  - 簡単
  - ネストされたリストにはクエリを実行できない
  - ドキュメントが大きくなりがち
- サブコレクションを使う
  - 親ドキュメントのサイズが変わらない
  - クエリが使える（複数のサブコレクション間は不可）
  - サブコレクションの削除が面倒
- ルートレベルのコレクションを使う
  - クエリが強力

### データの追加

#### db への参照を取得

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

#### set と update の違い

- `set` without merge will overwrite a document or create it if it doesn't exist yet
- `set` with merge will update fields in the document or create it if it doesn't exists
- `update` will update fields but will fail if the document doesn't exist

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

// querySnapshot.docs[]に、documentSnapshotが入っている。
// これらにforEachするためのショートハンド。
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

### OrderBy, Limit

```js
citiesRef.orderBy('name').limit(3);
citiesRef.orderBy('name', 'desc').limit(3);
citiesRef.orderBy('state').orderBy('population', 'desc');
citiesRef
  .where('population', '>', 100000)
  .orderBy('population')
  .limit(2);

// 範囲フィルタと最初の orderBy を異なるフィールドに使用することはできない
citiesRef.where('population', '>', 100000).orderBy('country');
```

### クエリカーソル

#### シンプルなカーソル

```js
citiesRef.orderBy('population').startAt(10000); // 10000を含む
citiesRef.orderBy('population').startAfter(10000); // 10000を含まない
citiesRef.orderBy('population').endAt(20000); // 20000を含む
citiesRef.orderBy('population').endBefore(20000); // 20000を含まない
```

#### ドキュメント スナップショットを使用したカーソル

数字の代わりにドキュメントスナップショットを渡すこともできる。

```js
return citiesRef
  .doc('SF')
  .get()
  .then(doc => {
    // Get all cities with a population bigger than San Francisco
    var biggerThanSf = citiesRef.orderBy('population').startAt(doc);
  });
```

#### ページネーションの設定

```js
var first = db
  .collection('cities')
  .orderBy('population')
  .limit(25);

return first.get().then(documentSnapshots => {
  // Get the last visible document
  var lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];

  // Construct a new query starting at this document,
  // get the next 25 cities.
  var next = db
    .collection('cities')
    .orderBy('population')
    .startAfter(lastVisible)
    .limit(25);
});
```

#### 複数のカーソル条件

```js
// name=Springfield, state=Missouri からスタート
db.collection('cities')
  .orderBy('name')
  .orderBy('state')
  .startAt('Springfield', 'Missouri');
```

### インデックスの種類

- インデックスタイプ
  - 単一フィールドインデックス
  - 複合インデックス
- インデックスモード（フィールドごとに設定）
  - 昇順
  - 降順
  - 配列の内容

#### 単一フィールドインデックス

デフォルトでは、下記のルールでインデックスが自動作成される。

- 各フィールド（配列・マップを除く）に、2 つの **単一フィールドインデックス（昇順・降順モード）** が作成される。
- マップ内の各サブフィールド（配列・マップを除く）に、2 つの **単一フィールドインデックス（昇順・降順モード）** 作成される。
- 配列フィールドには **単一フィールドインデックス(「配列の内容」モード)** が作成される。

単一フィールドインデックスでは、下記のようなクエリを行える。

```js
var citiesRef = db.collection('cities');

// データの例
citiesRef.doc('SF').set({
  name: 'San Francisco',
  state: 'CA',
  country: 'USA',
  capital: false,
  population: 860000,
  tags: ['west coast', 'famous bridge'],
});

// クエリの例
citiesRef.where('state', '==', 'CA');
citiesRef.where('population', '<', 100000);
citiesRef.where('name', '>=', 'San Francisco');
citiesRef.where('tags', 'array_contains', 'mega city');
citiesRef.where('state', '==', 'CO').where('name', '==', 'Denver');
citiesRef
  .where('country', '==', 'USA')
  .where('capital', '==', false)
  .where('state', '==', 'CA')
  .where('population', '==', 860000);
```

#### 複合インデックス

範囲比較（<、<=、>、>=）を使用する複合クエリを実行する必要がある場合、または別のフィールドにより並べ替える必要がある場合は、そのクエリ用の複合インデックスを作成する必要があります。

```js
citiesRef.where('country', '==', 'USA').orderBy('population', 'asc');
citiesRef.where('country', '==', 'USA').where('population', '<', 3800000);
citiesRef.where('country', '==', 'USA').where('population', '>', 690000);
```

例えば上記のクエリを実行するには、下記から構成される複合インデックスが必要となる。

- `country`フィールドの昇順（or 降順）インデックス
- `population`の昇順インデックス

複合インデックスが必要なクエリを実行すると、エラーメッセージと共に作成方法が教授されるので、それに従うこと。

#### インデックス マージの活用

複数の等式（==）句（およびオプションで orderBy 句）が含まれるクエリについては、インデックスのマージ機能を活用することで、費用を削減できる。
詳細は[こちら](https://firebase.google.com/docs/firestore/query-data/index-overview#taking_advantage_of_index_merging)。

#### インデックス除外のベストプラクティス

- 大きな文字列フィールド（使用しないなら無駄だから）
- 大規模な配列・マップフィールド（ドキュメントごとのインデックス上限が 2 万件だから）
- 連続した値を持つ、書き込みレートの高いもの？

## セキュリティルール

### ルールの作成

```js
service cloud.firestore {
  match /databases/{database}/documents {
    // ここにmatchを記載
  }
}
```

#### match

- すべての match ステートメントは、コレクションではなく**ドキュメント**を指す必要がある
- ネストさせてもいいし、しなくてもいい。

#### ワイルドカード構文

サブコレクションには適用されない。

```txt
match /cities/{city} {
  match /landmarks/{landmark} {
    allow read, write: if <condition>;
  }
}
```

#### 再帰ワイルドカード構文

サブコレクションにも適用される。

```txt
match /cities/{document=**} {
  allow read, write: if <condition>;
}
```

再帰ワイルドカードは、空のパスには一致しない。例えば、

- `/cities/{city}/{document=**}`の場合、`/cities/hamada`は引っかからない
- `/cities/{document=**}`の場合、`/cities/hamada`は引っかかる

#### 権限の種類

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

### 条件設定

#### request

リクエストを表す変数。

- `request.auth.uid` リクエストユーザの ID
- `request.resource.data.***` 書き込もうとしているデータ
- `request.query.***` クエリの`limit`,`offset`,`orderBy`プロパティにアクセスできる

#### resource

既存データを表す変数。存在しない場合は null になる

- `resource.data.***` 既存データ

#### ファンクションの利用

セキュリティルール内でファンクションを使用できる。下記の例では、自身が owner のデータにのみアクセスできるように設定している。

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

#### 他のドキュメントへのアクセス

get()関数、getAfter()関数、exists()関数、$(variable)構文などを使うことで、
現在のコレクション以外のコレクションとの整合性を担保するよう、ルールを設定をすることができる。

```js
service cloud.firestore {
  match /databases/{database}/documents {
    match /cities/{city} {
      // Make sure a 'users' document exists for the requesting user before
      // allowing any writes to the 'cities' collection
      allow create: if exists(/databases/$(database)/documents/users/$(request.auth.uid))

      // Allow the user to delete cities if their user document has the
      // 'admin' field set to 'true'
      allow delete: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.admin == true
    }
  }
}
```

### 安全にクエリを行う

#### クエリとセキュリティルール

- クエリの権限判定は、結果ベースではなく可能性ベースで行われる。
- あるクエリが権限を逸脱したデータを返す可能性がある場合は、そのクエリは失敗する。

#### 上限の設定

大量のデータ取得を防ぐために、`limit`が設定されていないクエリを拒否する例）

```js
allow list: if request.query.limit <= 10;
```

## オフラインデータ

### オフラインデータの有効化

- Android と iOS ではデフォルトで有効になっている。
- ウェブの場合はデフォルトで無効になっている。有効にするには次の通り。

```js
firebase
  .firestore()
  .enablePersistence()
  .then(function() {
    // Initialize Cloud Firestore through firebase
    var db = firebase.firestore();
  });
```

### オフラインデータのリッスン

オフライン時にデータが変更されるとイベントが発生する。
この際、メタデータの`fromCache`プロパティを確認することで、最新のデータなのか、キャッシュデータなのかを確認できる。

```js
db.collection('cities').onSnapshot(
  { includeQueryMetadataChanges: true }, // metadataの変更はデフォルトではイベントを起こさないので
  snapshot => {
    snapshot.docChanges.forEach(change => {
      var source = snapshot.metadata.fromCache ? 'local cache' : 'server';
      console.log('Data came from ' + source);
    });
  },
);
```

## Solutions

### Aggregation

下記の rates が追加されるたびに`avgRating`と`numRatings`を更新するような処理を Aggregation という。

トランザクションを使う方法と Cloud Function を使う方法がある。詳細は[ドキュメント参照](https://firebase.google.com/docs/firestore/solutions/aggregation)。

```js
var someRestaurant = {
  name: 'Arinell Pizza',
  avgRating: 4.65,
  numRatings: 683,
  rates: [4, 4, 5, 1, 3, 4, 4, , , ,],
};
```

## Cloud Functions による拡張

### Cloud Functions のトリガー

- `onCreate` Triggered when a document is written to for the first time.

```js
exports.createUser = functions.firestore
  .document('users/{userId}')
  .onCreate((snap, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const newValue = snap.data();

    // access a particular field as you would any JS property
    const name = newValue.name;

    // perform desired operations ...
  });
```

- `onUpdate` Triggered when a document already exists and has any value changed.

```js
exports.updateUser = functions.firestore
  .document('users/{userId}')
  .onUpdate((change, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const newValue = change.after.data();

    // ...or the previous value before this update
    const previousValue = change.before.data();

    // access a particular field as you would any JS property
    const name = newValue.name;

    // perform desired operations ...
  });
index.js;
```

- `onDelete` Triggered when a document with data is deleted.

```js
exports.deleteUser = functions.firestore
  .document('users/{userID}')
  .onDelete((snap, context) => {
    // Get an object representing the document prior to deletion
    // e.g. {'name': 'Marie', 'age': 66}
    const deletedValue = snap.data();

    // perform desired operations ...
  });
```

- `onWrite` Triggered when onCreate, onUpdate or onDelete is triggered.

```js
exports.modifyUser = functions.firestore
  .document('users/{userID}')
  .onWrite((change, context) => {
    // Get an object with the current document value.
    // If the document does not exist, it has been deleted.
    const document = change.after.exists ? change.after.data() : null;

    // Get an object with the previous document value (for update or delete)
    const oldDocument = change.before.data();

    // perform desired operations ...
  });
```
