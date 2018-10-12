# Firebase

[[toc]]

## Functions

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

// login with google
const provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('email');
await firebase.auth().signInWithRedirect(provider);

// login anonimously
const result = await firebase.auth().signInAnonymously();

// listen auth status change
firebase.auth().onAuthStateChanged(user => {});

// get current user
var user = firebase.auth().currentUser;

// handle redirect all time
const result = await firebase.auth().getRedirectResult();
if (!result.user) return;
const token = await firebase.auth().currentUser.getIdToken();
```

[gapi](/study/gapi.html) を使って取得した idToken を使う方法。匿名アカウントのアップグレードなどが必要な場合は、この方法をとる必要がある。

```js
var credential = firebase.auth.GoogleAuthProvider.credential(ID_TOKEN);

// 既存アカウントに紐付ける
await firebase.auth().currentUser.linkAndRetrieveDataWithCredential(credential);

// ログインする
await firebase.auth().signInAndRetrieveDataWithCredential(credential);
```
