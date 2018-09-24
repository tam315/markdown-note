# Nuxt.js

[[toc]]

## インストール

### create-nuxt-app を使う

```bash
yarn global add create-nuxt-app
create-nuxt-app some-app
cd some-app
yarn dev
```

### 自前で作る

package.json

```json
{
  "name": "my-app",
  "scripts": {
    "dev": "nuxt"
  },
  "dependencies": {
    "nuxt": "^2.0.0"
  }
}
```

pages/index.vue

```html
<template>
  <h1>Hello world!</h1>
</template>
```

```bash
yarn
yarn dev
```

## Directory Structure

### Directories

#### `assets`

- コンパイルされるべき Less, Sass, Javascript ファイルなど

#### `components`

- Vue コンポーネントを格納する
- Nuxt.js は `components` ディレクトリ内のコンポーネントの data メソッドについては手を加えません
- 一方、Nuxt.js は `pages` ディレクトリ内のコンポーネントの data メソッドには非同期データを扱えるよう手を加えます

#### `layouts`

- アプリケーションのレイアウトファイルを格納する

#### `middleware`

- ミドルウェアを格納する
- ミドルウェアは、ページやレイアウトをレンダリングする前に動作するファンクションである。

#### `pages`

- View と Routes を格納する
- このフォルダにある全ての`.vue`ファイルをもとに routes が生成される

#### `plugins`

- root Vue.js Application が動きはじめる前に動作させたいプラグインを格納する

#### `static`

- 静的ファイルを格納する。
- ここに置いたファイルはそのまま`/`に配置される

#### `store`

- Vuex Store ファイルを格納する

#### `nuxt.config.js`

- nuxt.js のコンフィグファイル

### Aliases

- `~`or`@`は`srcDir`を指す
- `~~`or`@@`は`rootDir`を指す

デフォルトでは srcDir と rootDir は同じ

vue テンプレートでファイルを相対指定する時に、次のように使う

```txt
~/assets/your_image.png
~/static/your_image.png
```

## Configuration

### 設定項目

#### build

- webpack の`vendor.bundle.js`に入れ込むモジュールを指定する。これにより本体 bundle の容量を減らすことができる。
- webpack の設定を変更する

#### css

グローバルに使用する CSS を指定する。

#### dev

`development` or `production`モードを指定する。

#### env

環境変数を指定する。環境変数はサーバサイド、クライアントサイドの両方から参照できる。

#### generate

動的なルーティングをしている場合において、それらを HTML ファイルに変換するときに使う。動的なルーティングに用いるパラメータを指定できる。

#### head

デフォルトの meta タグを指定する

#### loading

ローディング中に表示するコンポーネントを指定する

#### modules

nuxt で使用するモジュールを指定する。モジュール＝ nuxt 用のプラグインのようなもの

#### modulesDir

`node_modules`フォルダの場所を指定する

#### plugins

root Vue.js Application を開始する前に動作させたいプラグインを指定する。

#### rootDir

nuxt のルートディレクトリを指定する

#### server

ポート番号、IP、証明書の場所など、サーバのセットアップに関する情報を指定する。

#### router

vue-router の設定を指定する。

#### srcDir

ソースディレクトリを指定する。

#### transition

ページのトランジションを指定する。

## Routing

### Routes

- ファイル名が`index.vue`だと、パスは`''`（ホーム）になる
- フォルダ名 or ファイル名に`_`をつけると Dynamic Route(`:id`など) になる
- フォルダ内の`_`ファイルは一つまで。2 つ以上あると名前順で一番上のものが採用される
- フォルダ内に`index.vue`が存在しない場合、`_`から始まるファイルは**任意の**Dynamic Route になる（index.vue の役割を兼ねる）
- Dynamic Routes は`generage`コマンドでは無視される

```txt
pages/
--| category/
-----| _id.vue
--| users/
-----| _id.vue
-----| index.vue
--| index.vue
```

```js
routes = [
  {
    name: 'index',
    path: '/',
    component: 'pages/index.vue',
  },
  {
    name: 'category-id',
    path: '/category/:id?',
    component: 'pages/category/_id.vue',
  },
  {
    name: 'users',
    path: '/users',
    component: 'pages/users/index.vue',
  },
  {
    name: 'users-id',
    path: '/users/:id',
    component: 'pages/users/_id.vue',
  },
];
```

### Nested Routes

- ネストした Routes を定義するには、フォルダ名と同名の vue ファイルを作成する

```txt
pages/
--| users/
-----| _id.vue
-----| index.vue
--| users.vue
```

```js
routes = [
  {
    path: '/users',
    component: 'pages/users.vue',
    children: [
      {
        path: '',
        component: 'pages/users/index.vue',
        name: 'users',
      },
      {
        path: ':id',
        component: 'pages/users/_id.vue',
        name: 'users-id',
      },
    ],
  },
];
```

### Dynamic Nested Routes

Dynamic Routes をネストさせることもできる。

```txt
pages/
--| _category/
-----| _subCategory/
--------| _id.vue
--------| index.vue
-----| _subCategory.vue
-----| index.vue
--| _category.vue
--| index.vue
```

```js
routes = [
  {
    path: '/',
    component: 'pages/index.vue',
    name: 'index',
  },
  {
    path: '/:category',
    component: 'pages/_category.vue',
    children: [
      {
        path: '',
        component: 'pages/_category/index.vue',
        name: 'category',
      },
      {
        path: ':subCategory',
        component: 'pages/_category/_subCategory.vue',
        children: [
          {
            path: '',
            component: 'pages/_category/_subCategory/index.vue',
            name: 'category-subCategory',
          },
          {
            path: ':id',
            component: 'pages/_category/_subCategory/_id.vue',
            name: 'category-subCategory-id',
          },
        ],
      },
    ],
  },
];
```

#### SPA fallback

TODO: よくわからない

Dynamic Routes で SPA フォールバックを有効にするには設定が必要らしい。[ドキュメント](https://nuxtjs.org/guide/routing#dynamic-nested-routes)参照。

### リンクの貼り方、子コンポーネントの配置の仕方

```html
<!-- リンクを貼る router-linkは使えない-->
<nuxt-link to="/">Home page</nuxt-link>

<!-- 子コンポーネントの配置　router-viewは使えない -->
<nuxt-child/>
```

### Vlidation

- params のバリデーションを行うには、コンポーネントで次のようにする。
- booblean か、boolean を解決する Promise を返すこと。
- false だった場合は 404 ページ又は 500 ページが表示される。

```js
export default {
  validate({ params }) {
    // Must be a number
    return /^\d+$/.test(params.id);
  },
};
```

### Transitions

#### グローバルセッティング

- Nuxt.js のデフォルトトランジション名は`page`である。
- トランジションの詳細については Vue.js の[ドキュメント](https://vuejs.org/v2/guide/transitions.html#Transitioning-Single-Elements-Components)を参照

```css
/* assets/main.css */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.5s;
}
.page-enter,
.page-leave-to {
  opacity: 0;
}
```

```js
// nuxt.config.js
module.exports = {
  css: ['assets/main.css'],
};
```

#### ページ単位のセッティング

```css
/* assets/main.css */
.test-enter-active,
.test-leave-active {
  transition: opacity 0.5s;
}
.test-enter,
.test-leave-active {
  opacity: 0;
}
```

```js
// コンポーネントで
export default {
  transition: 'test',
};
```

### Middleware

- ページ（又はページグループ）をレンダリングする前になにかの処理を行うためのもの。
- `middleware`フォルダに配置する
- ファイル名がミドルウェア名になる　`middleware/auth.js` => `auth`
- ミドルウェアは非同期にすることもできる。非同期にしたい場合は Promise を Return すること。

ミドルウェアは`context`を引数に取る。Context の詳細は[こちら](https://nuxtjs.org/api/context)。

```js
export default function(context) {
  context.userAgent = context.isServer
    ? context.req.headers['user-agent']
    : navigator.userAgent;
}
```

ミドルウェアは下記の順で実行される。

1. `nuxt.config.js`
1. マッチしたレイアウト
1. マッチしたページ

ミドルウェアを使用するときは、`nuxt.config.js`、レイアウト、又はページに置いて`middleware`キーを指定する。

```js
// nuxt.config.jsの例
module.exports = {
  router: {
    middleware: 'auth',
  },
};
```

## Views

### Document

ルートディレクトリに`app.html`を配置することでデフォルトの HTML テンプレートを上書きできる。
デフォルト設定は以下の通り。

```html
<!DOCTYPE html>
<html {{ HTML_ATTRS }}>
  <head>
    {{ HEAD }}
  </head>
  <body {{ BODY_ATTRS }}>
    {{ APP }}
  </body>
</html>
```

### Layouts

`layouts/default.vue`を作成することで、デフォルトのレイアウトを上書きできる。
デフォルト設定は以下のとおり。

```html
<template>
  <nuxt/>
</template>
```

### Error Page

`layouts/error.vue`を作成することで、デフォルトのエラーページを上書きできる。
デフォルト設定は[こちら](https://github.com/nuxt/nuxt.js/blob/master/lib/app/components/nuxt-error.vue)

### Custom Layout

`layouts`フォルダの第一階層においたファイルは、レイアウトとして登録される。登録したレイアウトは、コンポーネントで使用することができる。

例）`layouts/blog.vue`

```html
<template>
  <div>
    <div>My blog navigation bar here</div>
    <nuxt/>
  </div>
</template>
```

コンポーネント側でレイアウトを指定する

```js
export default {
  layout: 'blog',
};
```

### Pages

Nuxt のページは、全て Vue コンポーネントである。
Nuxt は、このコンポーネントに特別なキーを追加して、アプリケーションの開発を容易にする。

```js
// コンポーネント
export default {
  asyncData(context) {},
  fetch() {},
  head() {},
  // and more functionality to discover
};
```

<!-- prettier-ignore -->
キー名|説明
---|---
`asyncData`|ページがインスタンス化される前に、データを取得し、`data`にセットする。コンテキストを引数として受け取る。
`fetch`|ページがインスタンス化される前に、データを取得する。`data`にセットするのではなく、storeを操作する時に使う。
`head`|現在のページに対して`<meta>` タグを設定する。
`layout`|layouts ディレクトリに定義されているレイアウトを指定する
`loading`|false に設定すると、ページへ遷移してきた際に this.$nuxt.$loading.finish() が呼び出されなくなり、ページから離れる際に this.$nuxt.$loading.start() が呼び出されなくなります。これによりローディングの振る舞いを 手動で 制御ができるようになります。この動作は、exampleから確認できます。loading は nuxt.config.js で設定されている場合のみ適用されます。loading プロパティを参照してください。
`transition`|ページの特定のトランジションを設定する
`scrollToTop`|Boolean型（デフォルト値：false）で、ページをレンダリングする前にページを一番上にスクロールするかどうかを指定する。これはネストされたルートに使用されます。
`validate`|動的なルーティングを行った際に`params`を検証する
`middleware`|このページのミドルウェアを設定する
`watchQuery`|どのクエリが変更された時に、上記のメソッド群を実行するか指定する（デフォルトではクエリ変更時に上記のメソッド群は実行されない）

### HTML Head

nuxt は head の管理に`vue-meta`を使用している。デフォルトの設定は以下の通り。

```js
{
  keyName: 'head', // the component option name that vue-meta looks for meta info on.
  attribute: 'data-n-head', // the attribute name vue-meta adds to the tags it observes
  ssrAttribute: 'data-n-head-ssr', // the attribute name that lets vue-meta know that meta info has already been server-rendered
  tagIDKeyName: 'hid' // the property name that vue-meta uses to determine whether to overwrite or append a tag
}
```

アプリケーション単位、ページ単位で head プロパティを設定できる。

```js
// nuxt.config.jsの例
head: {
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto' }
  ]
}
```

親と子で重複させたくない項目については、`hid`キーを設定しておくことで子のほうが優先されるようになる。詳細は[こちら](https://github.com/declandewet/vue-meta#lists-of-tags)。

### Async Data

- return したオブジェクトが`data`にマージされる
- `pages`フォルダ内のコンポーネントを描写する時に呼ばれる
- サーバサイドでデータを取得してプリレンダリングする or SPA のページ遷移時にデータを取得する
- 第一引数に`context`を受け取る
- store は使えない
- `this`でコンポーネントインスタンスにアクセスすることはできない（Instanciate する前だから）

実装の方法は次の 3 種類がある。実装例は[こちら](https://nuxtjs.org/guide/async-data#the-asyncdata-method)。

- Promise を返す
- async/await を使う
- callback を使う

```js
// async/awaitの例
export default {
  async asyncData(context) {
    let { data } = await axios.get(`https://my-api/posts/${context.params.id}`);
    return { title: data.title };
  },
};
```

### Context

context の詳細は[こちら](https://nuxtjs.org/api/context)

ルーティングに関するデータの取得をする際は、例えば`_slug.vue`なら、`context.params.slug`で取得できる。

注意：query の変更では`asyncData`メソッド等は実行されない。実行したい場合は[`watchQuery`](https://nuxtjs.org/api/pages-watchquery)プロパティに下記のような設定を行う。

```js
// 下記の設定により、'page'クエリが変更された時に、
// 全てのコンポーネントメソッド（asyncData, fetch, validate, layout, ...）が
// 実行されるようになる。
export default {
  watchQuery: ['page'],
};
```

### エラーハンドリング

非同期データ取得に失敗したときのエラーは次のように処理する。

```js
export default {
  asyncData({ params, error }) {
    return axios
      .get(`https://my-api/posts/${params.id}`)
      .then(res => {
        return { title: res.data.title };
      })
      .catch(e => {
        error({ statusCode: 404, message: 'Post not found' });
      });
  },
};
```

## Assets

### Assets(webpacked)

#### 段階 1：vue-loader

nuxt は vue-loader を使用している。コンパイルの過程で、下記のような記述は依存モジュールとして変換される。

- `<img src="...">`
- `background: url(...)`
- `@import`(CSS)

CSS の例：
`url('~/assets/image.png')` => `require('~/assets/image.png')`

コンポーネントの例：
`<img src="~/assets/image.png">` => `createElement('img', { attrs: { src: require('~/assets/image.png') }})`

#### 段階 2：file-loader, url-loader

その後、png のように、JavaScript ファイルでないものは、`file-loader`と`url-loader`を使って処理される。これらの利点は次の通り。

- file-loader 　ファイル名にハッシュを含めることでキャッシュをより良くする
- url-loader 　小さいファイルは base64 にして埋め込む。大きいファイルは file-loader にフォールバックする。

url-loader の初期設定

```js
// 1kb以下のファイルはインライン化し、そうでないものは所定のフォルダに配置する
[
  {
    test: /\.(png|jpe?g|gif|svg)$/,
    loader: 'url-loader',
    query: {
      limit: 1000, // 1kB
      name: 'img/[name].[hash:7].[ext]',
    },
  },
  {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    loader: 'url-loader',
    query: {
      limit: 1000, // 1kB
      name: 'fonts/[name].[hash:7].[ext]',
    },
  },
];
```

#### まとめ

最終的に、下記のような形になる。

```html
<img src="~/assets/image.png">
<!-- 上記は下記に変換される -->
<img src="/_nuxt/img/image.0c61159.png"><!-- もしくはbase64インライン -->
```

### Static

robotx.txt など、webpack に触れさせたくないファイルは、`static`フォルダに置くことで、そのままルートに配置される。

```html
<!-- Static フォルダのファイルを使うときの記法 -->
<img src="/my-image.png"/>

<!-- Assets(webpacked)フォルダのファイルを使うときの記法 -->
<img src="~/assets/my-image-2.png"/>
```

## Plugins

- root Vue.js インスタンスが開始する前に行っておきたい処理を Plugins に記載する。
- 注意：Nuxt では、`beforeCreate`と`created`のみ、サーバ・クライアントサイドの両方で動作する。それ以外はクライアントサイドでしか動作しない。

### 外部パッケージの利用

例えば`axios`を使いたい場合

```bash
yarn add axios
```

```js
// コンポーネントで
import axios from 'axios';
```

これだけでは、`axios`がシングルトンにならず、容量が肥大化する。それを防ぐために、`nuxt.config.js`に下記を記載する。

```js
module.exports = {
  build: {
    vendor: ['axios'],
  },
};
```

### Vue Plugins

Vue のプラグインを使うには下記のようにする。

```js
// plugins/vue-notifications.js:
import Vue from 'vue';
import VueNotifications from 'vue-notifications';

Vue.use(VueNotifications);

// nuxt.config.js
module.exports = {
  plugins: ['~/plugins/vue-notifications'],
};
```

デフォルトでは、プラグインは Webpack の App Bundle にバンドルされるので、Vendor Bundle にバンドルされるよう、次の一文を追加する。

```js
// nuxt.config.js
module.exports = {
  build: {
    vendor: ['vue-notifications'],
  },
};
```

### $root や context へのインジェクト

- アプリケーションワイドで使いたいファンクションは、`$root`（クライアントサイド、Vue.js のルートインスタンス）や`context`（サーバサイド）にインジェクトするとよい。
- これらのファンクションには慣習として、`$`を頭につける。

#### クライアントサイド（Vue インスタンスへのインジェクト）

```js
// plugins/vue-inject.js
import Vue from 'vue';
Vue.prototype.$myInjectedFunction = string =>
  console.log('This is an example', string);

// nuxt.config.js
module.exports = {
  plugins: ['~/plugins/vue-inject.js'],
};

// Componentでの呼び出し方
export default {
  mounted() {
    this.$myInjectedFunction('test');
  },
};
```

#### サーバサイド（context へのインジェクト）

```js
// plugins/ctx-inject.js
export default ({ app }, inject) => {
  // Set the function directly on the context.app object
  app.myInjectedFunction = string =>
    console.log('Okay, another function', string);
};

// nuxt.config.js
module.exports = {
  plugins: ['~/plugins/ctx-inject.js'],
};

// Componentでの呼び出し方
export default {
  asyncData(context){
    context.app.myInjectedFunction('ctx!')
  }
}
```

#### クライアントサイド・サーバサイドの両方にインジェクト

両方にいっぺんにインジェクトする方法。なお、ファンクション名の頭の`$`は自動的に付与される。

```js
// plugins/cimbined-inject.js
export default ({ app }, inject) => {
  inject('myInjectedFunction', string => console.log('That was easy!', string));
};

// nuxt.config.js
module.exports = {
  plugins: ['~/plugins/combined-inject.js'],
};

// Componentでの呼び出し方
export default {
  mounted(){
      this.$myInjectedFunction('works in mounted')
  },
  asyncData(context){
    context.app.$myInjectedFunction('works with context')
  }
}

// storeでの呼び出し方
export const mutations = {
  changeSomeValue(state, newValue) {
    this.$myInjectedFunction('accessible in mutations')
  }
}
export const actions = {
  setSomeValueToWhatever (context)) {
    this.$myInjectedFunction('accessible in actions')
  }
}
```

### クライアントサイドでしか動かないプラグイン

クライアントサイドでしか動かないプラグインを使うときは、`ssr`を`false`にする。

```js
module.exports = {
  plugins: [{ src: '~/plugins/vue-notifications', ssr: false }],
};
```

### サーバサイドでしか動かないプラグイン

- process.server 変数を使って制御する。この変数には、Webpack が server.bundle.js ファイルを作成するタイミングにおいてのみ true がセットされる。
- nuxt generate コマンドによって生成されたアプリケーションの中にいるかどうか知る必要がある場合は、process.static 変数に true がセットされているかでチェックする。

## Module

Nuxt のセットアップを簡単にする方法。

```js
// modules/simple.js
module.exports = function SimpleModule(moduleOptions) {
  // この中で色々な処理ができる
  this.options = {};
};

// nuxt.config.js
module.exports = {
  modules: [
    // Simple usage
    '~/modules/simple',
    // Passing options
    ['~/modules/simple', { token: '123' }],
  ],
};
```

- `moduleOptions` 上記で言うところの`{ token: '123' }`
- `this.options` nuxt.config.js 自身を指す。書き換えても OK。
- `this.nuxt` [nuxt のインスタンス](https://nuxtjs.org/api/internals-nuxt)を指す
- `this` モジュールのコンテキストを指す。Nuxt の設定を変更するメソッド類が用意されている。[詳細](https://nuxtjs.org/api/internals-module-container)
- `module.exports.meta` モジュールを npm で公開する時に設定する

### 使用例

#### トップレベルの option

```js
// nuxt.config.js
module.exports = {
  axios: {
    option1,
    option2,
  },
};

// module.js
module.exports = function(moduleOptions) {
  const options = Object.assign({}, this.options.axios, moduleOptions);
  // ...
};
```

#### プラグインの追加

```js
// plugin.js
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm';
Vue.use(BootstrapVue);

// module.js
module.exports = function(moduleOptions) {
  // Register `plugin.js` template
  this.addPlugin(path.resolve(__dirname, 'plugin.js'));
};
```

#### テンプレートプラグインの追加

TODO:よくわからない lodash templates を使っているらしい

```js
// plugin.js
ga('create', '<%= options.ua %>', 'auto');

// module.js
module.exports = function nuxtBootstrapVue(moduleOptions) {
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    options: {
      ua: 123,
    },
  });
};
```

#### CSS ライブラリの追加

```js
// module.js
module.exports = function(moduleOptions) {
  this.options.css.push('font-awesome/css/font-awesome.css');
};
```

#### Emit Assets

webpack プラグインを登録する方法
TODO: よくわからない

```js
module.exports = function(moduleOptions) {
  const info = 'Built by awesome module - 1.3 alpha on ' + Date.now();

  this.options.build.plugins.push({
    apply(compiler) {
      compiler.plugin('emit', (compilation, cb) => {
        // This will generate `.nuxt/dist/info.txt' with contents of info variable.
        // Source can be buffer too
        compilation.assets['info.txt'] = {
          source: () => info,
          size: () => info.length,
        };
        cb();
      });
    },
  });
};
```

#### カスタムローダーを登録する

前項と同じことは`extendBuild`を使って実現することもできる。

```js
module.exports = function(moduleOptions) {
  this.extendBuild((config, { isClient, isServer }) => {
    // `.foo` Loader
    config.module.rules.push({
      test: /\.foo$/,
      use: [
        /*something*/
      ],
    });

    // Customize existing loaders
    const barLoader = config.module.rules.find(
      rule => rule.loader === 'bar-loader',
    );
  });
};
```

### Nuxt の各段階で所定の処理を行う

```js
// module.js
module.exports = function() {
  // Add hook for modules
  this.nuxt.hook('module', moduleContainer => {
    // This will be called when all modules finished loading
  });

  // Add hook for renderer
  this.nuxt.hook('renderer', renderer => {
    // This will be called when renderer was created
  });

  // Add hook for build
  this.nuxt.hook('build', async builder => {
    // This will be called once when builder created

    // We can even register internal hooks here
    builder.hook('compile', ({ compiler }) => {
      // This will be run just before webpack compiler starts
    });
  });

  // Add hook for generate
  this.nuxt.hook('generate', async generator => {
    // This will be called when a Nuxt generate starts
  });
};
```
