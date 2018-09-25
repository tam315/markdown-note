# Vue CLI

[[toc]]

## Overview

### 構成要素

#### CLI (`@vue/cli`)

- `vue`コマンドを提供する
- グローバルインストールされることが多い
- `vue create`, `vue serve`, `vue ui`などのコマンドがある。

#### CLI Service (`@vue/cli-service`)

- `vue`コマンドを使って作成したプロジェクトのローカルにインストールされる
- webpack 及び webpack-server の上に構成されている
- `vue-cli-service`コマンドにより、`serve`,`build`,`inspect`などが行える。
- `react-create-app`でいう`react-scripts`に相当
- eject しないで済むよう、様々なコンフィグが可能

#### Global CLI Service (`@vue/cli-service-global`)

- `@vue/cli-service`のグローバルインストール版
- `vue serve`,`vue build`した時に使われる。
- ローカルでとりあえず vue を走らせる時に使うもの。プロダクション環境では使うな。

#### CLI Plugins

- プロジェクトに機能を追加するもの（TypeScript,Babel,ESLint,Unit Testing など）
- `@vue-cli-plugin-***`という名前になっている（コミュニティ版は`@`がない）
- `vue-cli-service`が走る時に自動的に読み込まれる
- plugins は`package.json`に記載する

## インストール

```bash
yarn global add @vue/cli
vue --version
```

## Instant Prototyping

- `vue serve`,`vue build`により迅速なプロトタイピングができる
- 事前に`@vue/cli-service-global`をインストールしておくこと
- `package.json`や`index.html`を指定することもできる

```bash
vue serve # main.js, index.js, App.vue, app.vue を探して起動
vue serve -o # ブラウザを開く
vue serve MyComponent.vue # コンポーネントを指定して開く

vue build
vue build MyComponent.vue
```

## Creating a Project

### CLI でプロジェクトを作成

```bash
vue create hello-world
```

manual を選ぶとより詳細な設定が行える。それらの設定は`.vuerc`に保存されるので、別のプロジェクトセットアップ時に使用することができる。

### GUI でプロジェクトを作成

```bash
vue ui
```

## Plugins

- プラグインの役割
  - webpack の設定を拡張する
  - vue-cli-service にコマンドを追加する
- これにより、Vue CLI は高い拡張性と柔軟性を確保している。
- プラグインの追加は`vue ui`からでも行える

### プラグインの追加

プラグインは次の 2 つから構成される

- **generator**
  - プロジェクト作成時に必要なファイルを作る役割
- **runtime plugin**
  - webpack config を変更する役割
  - vue-cli-service にコマンドを追加する役割

プラグインを追加するには次のようにする。

```bash
vue add @vue/eslint
# これは自動的に下記に変換される
vue add @vue/cli-plugin-eslint

# オプションも渡せる
vue add @vue/eslint --config airbnb --lintOn save

# vue-routerとvuexだけは特別に次のようにする
vue add router
vue add vuex
```

### ローカルプラグイン

理由があって、未完成なプラグインを使いたい場合や、Plugin API にアクセスしたいときは、次のようにする。

通常の plugin API を使う時

```js
{
  "vuePlugins": {
    "service": ["my-commands.js"]
  }
}
```

UI plugin を使う時

```js
{
  "vuePlugins": {
    "ui": ["my-ui.js"]
  }
}
```

## Presets

- `vue create`時に作成される`.vuerc`のこと。このファイルは他のプロジェクトで再利用できる。
- `useConfigFiles` を有効にすると、eslint や jest の設定が個別ファイルに書き込まれる。無効にすると package.json に書き込む。
- `configs`の設定は package.json 又は個別ファイルにマージされる。

### ファイルの例

```json
{
  "useConfigFiles": true,
  "router": true,
  "vuex": true,
  "cssPreprocessor": "sass",
  "plugins": {
    "@vue/cli-plugin-babel": {},
    "@vue/cli-plugin-eslint": {
      "config": "airbnb",
      "lintOn": ["save", "commit"]
    }
  },
  "configs": {
    "vue": {"..."},
    "postcss": {"..."},
    "eslintConfig": {"..."},
    "jest": {"..."}
  }
}
```

### Preset Plugin Versioning

公式ではない、サードパーティのプラグインを使う場合はバージョニングしたほうが良い。

```json
{
  "plugins": {
    "@vue/cli-plugin-eslint": {
      "version": "^3.0.0"
    }
  }
}
```

### Preset Prompt

`.vuerc`にプラグインの設定が記載されている場合は、`vue create`時のプロンプトはスキップされる。表示させたい場合は次にようにする。

```json
{
  "plugins": {
    "@vue/cli-plugin-eslint": {
      "prompts": true
    }
  }
}
```

### Remote Presets

第三者の作成したプリセットをリポジトリから取得して、新規プロジェクトを作成することができる。
プリセットは下記の 3 種類を含むことができる。

- preset.json
- generator.js
- prompt.js

```bash
# githubから取得
vue create --preset username/repo my-project
```

または、それらのファイルをローカルに置いて、プロジェクトを作成することもできる。

```bash
# ./my-preset should be a directory containing preset.json
vue create --preset ./my-preset my-project

# or directly use a json file in cwd:
vue create --preset my-preset.json
```

## CLI Service

`@vue/cli-service`は`vue-cli-service`というバイナリをインストールする。

```json
{
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build"
  }
}
```

### `vue-cli-service serve`

開発サーバを立ち上げる

### `vue-cli-service build`

プロフダクションビルドを`dist`に書き出す。オプションは下記の通り。

- `--modern` モダンブラウザに最適化してビルド（フォールバックあり）
- `--target`　ライブラリとして書き出すときに使う
- `--report`, `--report-json`　ビルド情報を分析して出力する（サイズなど）

### `vue-cli-service inspect`

webpack の設定を出力する

### キャッシュ

- `cache-loader` がデフォルトで有効になっているので、コンパイルに失敗するようになったら、`node_modules/.cache`を削除してみること。

### Git Hooks

デフォルトで Git Hooks が使える。

package.json

```json
{
  "gitHooks": {
    "pre-commit": "lint-staged"
  }
}
```

## ブラウザ互換性

### blowserlist

- `package.json`の`browserslist`、もしくは`.browserslistrc`で、互換性をもたせる範囲を指定できる。
- この値によって、`@babel/preset-env`と`autoprefixer`が適切に設定される。

### Polyfills

依存ライブラリに Polyfill が必要なものがあるときは、[こちら](https://cli.vuejs.org/guide/browser-compatibility.html#polyfills)を参考に設定を行う。

### Modern Mode

- ビルド時にモダンモードを有効にすると、モダン向けとレガシィ向けの種類のビルドが作成される。
- モダンブラウザでは、よりコンパクトで速いバンドルを、レガシィでは通常のバンドルを使うことができる。
- 特にその他の設定は不要

## HTML Assets

### Index File

`public/index.html`は、`html-webpack-plugin`のテンプレートとして使用される。これにより下記が自動でインジェクトされる。

- ビルドした JS ファイル
- ビルドした CSS ファイル
- preload/prefetch などのリソースヒント
- manifest/icon リンク（PWA プラグインを使用している場合）

### テンプレートの編集

index.html では lodash template が使える。

- `<%= VALUE %>` for unescaped interpolation;
- `<%- VALUE %>` for HTML-escaped interpolation;
- `<% expression %>` for JavaScript control flows.

例：

```html
<link rel="icon" href="<%= BASE_URL %>favicon.ico">
```

### Preload

Preload = 初期表示に必ず必要なファイル

デフォルトでは、初期表示に必要な全てのファイルに`preload`が設定される。
カスタマイズしたいときは[こちら](https://cli.vuejs.org/guide/html-and-static-assets.html#preload)を参照。

### Prefetch

Prefetch = 近い将来ユーザが必要とするであろうファイル

デフォルトでは、生成したすべての JS ファイルに`prefetch`が設定される。
カスタマイズしたいときは[こちら](https://cli.vuejs.org/guide/html-and-static-assets.html#prefetch)

### Index File 生成の無効化

既にサーバが存在する場合は、index.html の生成を無効化する必要があるかもしれない。
そのときは[こちら](https://cli.vuejs.org/guide/html-and-static-assets.html#disable-index-generation)を参照すること。

### Multi-Page Application

MPA を作るときは[こちら](https://cli.vuejs.org/guide/html-and-static-assets.html#building-a-multi-page-app)を参考に、`pages`オプションを設定すること。

## Static Assets

静的ファイルには以下の 2 種類がある。

- Javascript, templates, CSS で相対パス参照されたファイル(webpack される)
- `public`ディレクトリに置かれたファイル(webpack されずそのままコピーされる)

### 相対パス参照

相対パスで参照されたファイルに対しては、下記の処理が行われる。

- `file-loader`でハッシュ付きファイル名を決め、所定の場所に配置
- `url-loader`でその場所へのリンクを生成（もしくはインライン化）

### URL の変換

- `/`で始まる絶対パスはそのまま保持される
- `.`で始まる相対パスは、フォルダ構造を考慮し、適切に変換される
- `~`で始まるパスは、`node_modules`への参照とみなされる
- `@`で始まるパスは、`<projectRoot>/src`への参照とみなされる。（index.html 内でのみ有効）

### `puclic` Folder

デメリットが多いので基本的には使わないほうが良い。

もし使う場合で、ルートパス以外で運用している場合は[こちら](https://cli.vuejs.org/guide/html-and-static-assets.html#the-public-folder)を参考に、`public/index.html`の変更が必要。
