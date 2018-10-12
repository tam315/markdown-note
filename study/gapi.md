# Google API Client Libraries

## ドキュメント

[https://developers.google.com/api-client-library/javascript/start/start-js](https://developers.google.com/api-client-library/javascript/start/start-js)

## 基本

1. ライブラリを読み込む(`https://apis.google.com/js/api.js`)
1. 下記のオプションとともにライブラリを Initialize する
   - API key
   - OAuth client ID
   - API Discovery Documents
1. リクエストを送り、レスポンスを処理する。

### `API_KEY`

GCP コンソールで生成する。使用できる API の種類を制限したり、Origin を制限することで、適切に API を利用できる。

### `discoveryDocs`

API を生成するための API。`gapi.client`に機能をインジェクトしてくれる。

## 認証

### レベル

Google API Client には 2 つのレベルがある
レベル名|説明|必要なもの
---|---|---
Simple|ユーザのプライベートデータにアクセスできない|API key
Authorized|ユーザのプライベートデータにアクセスできる|API key と Oauth 2.0 Credentials

### Authorized Level (Oauth 2.0)

Oauth は複雑な仕組みで動いているものの、Google API Client Libraries を使うなら簡単。
やるべきことは下記の 2 つをライブラリに渡すことだけ。

- OAuth 2.0 client ID
  - GCP コンソールで発行できる
- scope
  - 必要な情報の範囲の定義
  - scope の一覧は[こちら](https://developers.google.com/identity/protocols/googlescopes)
  - scope はスペース区切りの文字列である（space delimited string）

## 例

### 認証が不要のパターン

translations API を使っている。ユーザのプライベートデータにアクセスしないため、API キーのみで動作する。

```js
gapi.load('client', async () => {
  await gapi.client.init({
    apiKey: 'API_KEY',
    discoveryDocs: [
      'https://www.googleapis.com/discovery/v1/apis/translate/v2',
    ],
  });

  // `gapi.client.language.translations`は、discoveryDocs により利用可能になっている
  const response = await gapi.client.language.translations.list({
    q: 'なんでも翻訳できるんですね',
    source: 'ja',
    target: 'en',
  });

  console.log(response.result.data.translations[0].translatedText);
  // => 'you can translate anything`
});
```

### 認証情報を取得する方法

下記のようにすることで、リダイレクト形式のログインを行える。
ユーザがログインを承認した後に、`redurect_url`に token を含むハッシュがついた形でリダイレクトされる。

[参考](https://developers.google.com/api-client-library/javascript/features/authentication)

```js
const initClient = async () => {
  await gapi.client.init({
    apiKey: 'API_KEY',
    clientId: 'OAUTH2_CLIENT_ID',
    scope: 'profile',
  });

  gapi.auth2.getAuthInstance().signIn({
    ux_mode: 'redirect',
    redirect_uri: 'http://localhost:3000/',
  });
};

gapi.load('client', initClient);
```

リダイレクトされる URL の例

```txt
http://localhost:3000/
#scope=https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/plus.me%20https://www.googleapis.com/auth/userinfo.profile
&id_token=some_random_string
&login_hint=some_random_string
&client_id=some_oauth_client_id
&prompt=consent
```
