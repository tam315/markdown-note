# Firebase

[[toc]]

## Functions

### 名称

下記の 2 つは微妙に違うみたい。

- Cloud Functions
  - `gcloud` cli から操作する
- Cloud Functions for Firebase
  - `firebase` cli から操作する

### セットアップ

```bash
firebase login
firebase init functions
firebase deploy
```

Node.js v8.\* を使うなら、`functions/package.json` に `"engines": { "node": "8" }` を追加する

```js
const functions = require('firebase-functions');

// ユーザの削除をトリガにする
exports.helloWorld = functions.auth.user().onDelete(user => {});

// http通信をトリガにする
exports.helloWorld2 = functions.https.onRequest(async (req, res) => {});
```

### cors を有効にする

```js
const cors = require('cors')(); // invokeを忘れずに

exports.storeImage = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    // do something
  });
});
```

## Auth

### backend

```bash
yarn add firebase-admin
```

```js
const firebaseAdmin = require('firebase-admin');

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert({
    projectId: '',
    clientEmail: '',
    private_key_id: '',
    privateKey: JSON.parse(process.env.FIREBASE_PRIVATE_KEY),
  }),
});

const result = await firebaseAdmin.auth().verifyIdToken(token);
const firebaseUserId = result.user_id;
```

### frontend

```bash
yarn add firebase
```

#### 初期化

```js
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';

firebase.initializeApp({
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
});
```

#### ログイン

```js
// login with google
const provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('email');
await firebase.auth().signInWithRedirect(provider);

// login anonimously
const result = await firebase.auth().signInAnonymously();
```

#### ユーザ情報の取得

```js
// listen auth status change (必要に応じてunsubscribeを忘れずに)
const unsubscribe() = firebase.auth().onAuthStateChanged(user => {});
unsubscribe();

// get current user（初期ロード時などはUndefinedになる可能性あり）
var user = firebase.auth().currentUser;
```

#### リダイレクト情報の取得

```js
// handle redirect all time
const result = await firebase.auth().getRedirectResult();
if (!result.user) return;
const token = await firebase.auth().currentUser.getIdToken();
```

#### gapi を使った手動でのログイン

[gapi](/study/gapi.html) を使って取得した idToken を使う方法。匿名アカウントのアップグレードなどが必要な場合は、この方法をとる必要がある。

```js
var credential = firebase.auth.GoogleAuthProvider.credential(ID_TOKEN);

// 既存アカウントに紐付ける
await firebase.auth().currentUser.linkAndRetrieveDataWithCredential(credential);

// ログインする
await firebase.auth().signInAndRetrieveDataWithCredential(credential);
```
