# Google Cloud Platform

[[toc]]

## Functions

### babel 関係のセットアップ

```json
{
  "main": "dist/index.js",
  "scripts": {
    "build": "babel src --out-dir dist --ignore **/__tests__/**",
    "deploy": "yarn build && gcloud beta functions deploy helloGET --trigger-http",
    "deploy:local": "yarn build && functions deploy helloGET --trigger-http"
  }
}
```

### コマンド

#### ファイル

```js
// src/index.js
exports.helloGET = (req, res) => {
  res.send('Hello World!');
};
```

#### デプロイ

```bash
# web
gcloud beta functions deploy helloGET --trigger-http
# local
functions deploy helloGET --trigger-http
```

#### 説明

```bash
gcloud beta functions describe helloGET
```

#### ローカルデプロイ関係

```bash
# node6 しか対応していない。yarn でエラーが出る場合はnpmでインストールするとよい
npm install -g @google-cloud/functions-emulator

# ローカルサーバの開始と終了
functions start
functions stop
functions kill (ハングした時)

# 一覧
functions list

# ファンクションの呼び出し
functions call helloGET --data='{"message":"Hello World"}'
functions call helloGET --file=/path/to/data.json

# ログ
functions logs read
functions status # ログファイルの場所を確認する

# デバッグツールの利用
# https://github.com/GoogleCloudPlatform/cloud-functions-emulator/wiki/Debugging-functions
functions inspect helloGET # chrome-devtools
functions logs read # chrome-devtools 用の URI をコピーしてブラウザで開く
functions reset helloWorld #デバッグモードを離脱
functions reset helloWorld --keep # デバッグモードを維持したまま再起動。URI は変わる。
```
