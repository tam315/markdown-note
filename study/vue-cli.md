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

## CSS の設定

vue-cli では、PostCSS, CSS Modules のほか、プリプロセッサとして Sass,Less,Stylus をサポートしている。

### Assets の参照

- コンパイル後の CSS は css-loader で処理される。css-loader は、`url()`の参照をモジュールに変換してくれる。
- これは、`url()`に相対パスを記載できることを意味する。なお、`node_modules`のファイルを参照するときはパスを`~`から始めること。

### Pre-Processors

プリプロセッサを後から追加する場合は下記を実行する。

```bash
# Sass
npm install -D sass-loader node-sass

# Less
npm install -D less-loader less

# Stylus
npm install -D stylus-loader stylus
```

これで、それらのファイルを import したり、`*.vue`ファイルの中で記載できるようになる。

```txt
<style lang="scss">
$color: red;
</style>
```

### Automatic imports

TODO: よくわからない

### PostCSS

Vue CLI は内部で PostCSS を使っている。

- `.postcssrc` postCSS の設定を行う
- `vue.config.js`の`css.loaderOptions.postcss` postcss-loader の設定を行う

### CSS Modules

[CSS Module](https://vue-loader.vuejs.org/guide/css-modules.html#usage)がデフォルトで使える。

### Pre-Processor ローダの設定

`vue.config.js`の`css.loaderOptions`で行う。下記の全てを同じ方法で設定できる。

- css-loader
- postcss-loader
- sass-loader
- less-loader
- stylus-loader

例えば、全ての sass ファイルに特定の変数を読み込ませる設定の場合：

```js
// vue.config.js
module.exports = {
  css: {
    loaderOptions: {
      // pass options to sass-loader
      sass: {
        // @/ is an alias to src/
        // so this assumes you have a file named `src/variables.scss`
        data: `@import "@/variables.scss";`,
      },
    },
  },
};
```

## Webpack の設定

### シンプルな設定方法

`configureWebpack`オプションを使う。

`webpack-merge`を使ってマージされる。直接変更しては行けない Webpack のプロパティもあるので注意する。

```js
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [new MyAwesomeWebpackPlugin()],
  },
};
```

条件によって設定を変えたいときや、直接コンフィグを編集したいときは、ファンクションを使う。
config を直接編集するか、マージしたい Object を return すること。

```js
// vue.config.js
module.exports = {
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // mutate config for production...
    } else {
      // mutate for development...
    }
  },
};
```

### 複雑な設定方法(Chaining)

[`webpack-chain`](https://github.com/neutrinojs/webpack-chain#getting-started)を使った設定方法。`vue inspect`しながら使うとよい。なお、CSS 関連の設定はこの方法は使わずに、`css.loaderOptions`で変更すること。

例：ローダーの設定を変更する

```js
// vue.config.js
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        // modify the options...
        return options;
      });
  },
};
```

例：ローダを新しく追加する

```js
// vue.config.js
module.exports = {
  chainWebpack: config => {
    // GraphQL Loader
    config.module
      .rule('graphql')
      .test(/\.graphql$/)
      .use('graphql-tag/loader')
      .loader('graphql-tag/loader')
      .end();
  },
};
```

例：ローダをまるごと置き換える

```js
module.exports = {
  chainWebpack: config => {
    const svgRule = config.module.rule('svg');

    // clear all existing loaders.
    // if you don't do this, the loader below will be appended to
    // existing loaders of the rule.
    svgRule.uses.clear();

    // add replacement loader(s)
    svgRule.use('vue-svg-loader').loader('vue-svg-loader');
  },
};
```

例：プラグインの設定を変更する

```js
// vue.config.js
module.exports = {
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      return [
        /* new args to pass to html-webpack-plugin's constructor */
      ];
    });
  },
};
```

### 現在の webpack の設定を確認

`vue inspect`で現在の webpack 設定を出力できる。
出力結果はシリアライズされているため、そのままでは valid な webpack のコンフィグにはならないので注意すること。

```bash
vue inspect > output.js
vue inspect module.rules.0
vue inspect --rules
vue inspect --rule vue
vue inspect --plugins
vue inspect --plugin html
```

### 生成された webpack のコンフィグが必要な場合

外部ツール（IDE など）で webpack のコンフィグファイル自体への参照が必要な場合は、下記を使うとよい。
このファイルは常に最新の webpack 設定を返すように設定されている。

```txt
<projectRoot>/node_modules/@vue/cli-service/webpack.config.js
```

## Environment Variables and Modes

プロジェクトルートに下記のファイルを作成することで、環境変数を設定できる。
環境変数は、`vue-cli-service`コマンドや、プラグイン等で利用できる。

```txt
.env                # loaded in all cases
.env.local          # loaded in all cases, ignored by git
.env.[mode]         # only loaded in specified mode
.env.[mode].local   # only loaded in specified mode, ignored by git

// mode
mode = production | development | test | otherUserDefinedMode...

// ファイルの内容はkey=valueの形式で記載する
FOO=bar
VUE_APP_SECRET=secret
```

### Modes

Vue CLI にはデフォルトで 3 つの動作モードがある。ユーザ定義のモードを追加することもできる。

- `development` is used by `vue-cli-service serve`
- `production` is used by `vue-cli-service build` and `vue-cli-service test:e2e`
- `test` is used by `vue-cli-service test:unit`

### 例）ユーザ定義の「Staging Mode」を追加する

Mode が`development`,`production`,`test`のいずれかだった場合、`NODE_ENV`もそれと同じものに自動的に設定される。独自に作ったモードにおいては、手動での設定が必要。

`.env`

```txt
VUE_APP_TITLE=My App
```

`.env.staging`

```txt
NODE_ENV=production
VUE_APP_TITLE=My App (staging)
```

上記設定で`vue-cli-service build`した場合は、`.env`, `.env.production`, `.env.production.local`が参照される。

上記設定で`vue-cli-service build --mode staging`した場合は、`.env`, `.env.staging`, `.env.stagin.local`が参照される。

いずれも、NODE_ENV は production に設定される。

## Build Targets

`vue-cli-service build`するときに、App, Library, Web Component の 3 種類のターゲットを指定することができる。

### App

デフォルトのターゲットである。このターゲットでは下記の処理が行われる。

- リソースヒントとともに、`index.html`が生成される
- ベンダーバンドルは分離して生成される
- 4kb 以下のアセットはインライン化される
- `public`フォルダのファイルが出力フォルダにコピーされる

### Library

ライブラリとして出力する。エントリファイルは`.js`or`.vue`を指定する。
指定されていない場合は`src/App.vue`が参照される。

```bash
vue-cli-service build --target lib --name myLib [entry]
```

このコマンドは 4 つのファイルを出力する。

- `dist/myLib.common.js` CommonJS バンドル(Webpack 等用)
- `dist/myLib.umd[.min].js` UMD バンドル（ブラウザで直接使う時、もしくは AMD ローダー用）
- `dist/myLib.css` 抽出された CSS ファイル（インライン化するには`vue.config.js`で`css: { extract: false }`を設定しておくこと）

#### js ファイルと vue ファイルの違い

- `.vue`ファイルをエントリーポイントとした場合は、コンポーネント自体がエクスポートされる。
- `.js`ファイルをエントリーポイントとした場合は、`default`としてエクスポートされる。これは、ライブラリ使用時に下記のようにしなければならないことを意味する。
  - `window.yourLib.default`
  - `const myLib = require('mylib').default`

js ファイルでも default エクスポートしたい場合は、`vue.config.js`を下記のようにする。

```js
module.exports = {
  configureWebpack: {
    output: {
      libraryExport: 'default',
    },
  },
};
```

### Web Component

::: tip NOTE
IE11 以下では Web Component は使えない
:::

- エントリファイルは`*.vue`である必要がある。自動的に`main.js`にラップされる。
- 使用時は、Vue がグローバルでアクセス可能である必要がある

```bash
vue-cli-service build --target wc --name my-element [entry].vue
```

```html
<script src="https://unpkg.com/vue"></script>
<script src="path/to/my-element.js"></script>

<!-- use in plain HTML, or in any other framework -->
<my-element></my-element>
```

#### 複数のコンポーネントを Web Component にする

- glob で指定することで複数のコンポーネントをいっぺんに Web Component にできる。
- この場合、`--name`に指定した値が prefix として使用される。

```bash
vue-cli-service build --target wc --name foo 'src/components/*.vue'
# `HelloWorld.vue` => `<foo-hello-world>`
```

#### Async Web Component

複数のコンポーネントを一つの Web Component にした場合、使用時に必要ないコンポーネントまで全て読み込まれるため効率がよろしくない。`wc-async`でビルドすることで、コンポーネントごとに JS ファイルが分割され、使用時にオンデマンドで読み込まれる様になる。

```bash
vue-cli-service build --target wc-async --name foo 'src/components/*.vue'

# File                Size                        Gzipped
# dist/foo.0.min.js    12.80 kb                    8.09 kb
# dist/foo.min.js      7.45 kb                     3.17 kb
# dist/foo.1.min.js    2.91 kb                     1.02 kb
# dist/foo.js          22.51 kb                    6.67 kb
# dist/foo.0.js        17.27 kb                    8.83 kb
# dist/foo.1.js        5.24 kb                     1.64 kb
```

```html
<script src="https://unpkg.com/vue"></script>
<script src="path/to/foo.min.js"></script>

<!-- foo-one's implementation chunk is auto fetched when it's used -->
<foo-one></foo-one>
```

## Deployment

[こちら](https://cli.vuejs.org/guide/deployment.html)を参照

MPA の場合や、HTML5(history)モードで動かしている場合はサーバ側にも設定が必要なので注意する。
