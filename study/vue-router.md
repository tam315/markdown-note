# vue-router

[[toc]]

## API

[https://router.vuejs.org/api/](https://router.vuejs.org/api/)

## 基本的な使い方

```html
<!-- ここにマッチしたコンポーネントが描写される -->
<router-view></router-view>

<!-- リンクを張りたいときは -->
<router-link to="/foo">Go to Foo</router-link>
<router-link to="/bar">Go to Bar</router-link>
```

```js
const Foo = { template: '<div>foo</div>' };
const Bar = { template: '<div>bar</div>' };

const routes = [
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar },
];

const router = new VueRouter({
  routes,
});

var app = new Vue({
  el: '#app',
  router,
});
```

`router-link`には、ルートによって`router-link-exact-active`や`router-link-active`といったクラスが自動的に設定される。

コンポーネント側から vue-router を操作するには次のオブジェクトを使う。

- `this.$route`
  - `path`
  - `fullPath`
  - `params`
  - `query`
  - `hash`
  - `matched`
  - 詳細は[ドキュメント](https://router.vuejs.org/api/#route-object-properties)参照
- `this.$router`（===`router`)
  - `go`
  - `push`
  - `back`
  - `forward`
  - 詳細は[ドキュメント](https://router.vuejs.org/api/#router-instance-methods)参照

## Dynamic Route Matching

次のようにすることで、ダイナミックルーティングを設定できる。
`:username`や`:post_id`の部分は、`this.$route.params`としてコンポーネントに渡される。

```js
const routes = [{ path: '/user/:username/post/:post_id', component: User }];

// /user/evan/post/123?page=2
//
// params => { username: 'evan', post_id: 123 }
// query => { page: 2 }
```

### params の変更を検知する

params が変更されただけでは、コンポーネントは再作成されない（再利用される）。
つまりライフサイクルメソッドは発動しない。
これを検知したいときは次のようにする。

```js
const User = {
  watch: {
    $route(to, from) {},
  },
  // もしくはナビゲーションガードを使う
  beforeRouteUpdate(to, from, next) {},
};
```

### 様々なルート定義

vue-router は[path-to-regexp](https://github.com/pillarjs/path-to-regexp)を使用しており、多様なルート定義ができる。詳細はドキュメントを参照。

### 優先順位

重複したルートが合った場合は、先に定義されている方が優先される。

## Nested Routes

下記のように設定すると、`User`コンポーネントの中に配置した`<router-view />`の部分に指定したコンポーネントが描写される。

```js
const routes = [
  {
    path: '/user/:id',
    component: User,
    children: [
      { path: '', component: UserHome },
      {
        path: 'profile',
        component: UserProfile,
      },
      {
        path: 'posts',
        component: UserPosts,
      },
    ],
  },
];
```

## Programmatic Navigation

### router.push

```js
router.push('home');
router.push({ path: 'home' });
router.push({ path: `/user/${userId}` });
router.push({ path: 'register', query: { plan: 'private' } });

// なお、pathを指定すると、paramsは無視される。
// paramsを使うときは、`path`の代わりに`name`を使うこと。
router.push({ name: 'user', params: { userId: 123 } });
```

### router.replace

history に履歴を残さずにルートを変更する。その他は`push`と同じ。

### router.go

```js
router.go(1);
router.go(-1);
router.go(3);
```

## Named Routes

ルートに名前をつけることができる。

```js
routes = [
  {
    path: '/user/:userId',
    name: 'user',
    component: User,
  },
];
```

```html
<router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>
```

## Named Views

- サイドバーの内容をページによって変更したいときなどは、`router-view`に名前をつけることで対応する。
- 名前をつけなかった View には自動的に`default`という名前が与えられる。
- `component`ではなく`components`なので注意

```html
<router-view></router-view>
<router-view name="a"></router-view>
<router-view name="b"></router-view>
```

```js
routes = [
  {
    path: '/',
    components: {
      default: Foo,
      a: Bar,
      b: Baz,
    },
  },
];
```

### Named View をネストする

例えば、次の例のように、`/settings/profile`のときだけ特定のコンポーネントを表示したい場合

```txt
/settings/emails                                       /settings/profile
+-----------------------------------+                  +------------------------------+
| UserSettings                      |                  | UserSettings                 |
| +-----+-------------------------+ |                  | +-----+--------------------+ |
| | Nav | UserEmailsSubscriptions | |  +------------>  | | Nav | UserProfile        | |
| |     +-------------------------+ |                  | |     +--------------------+ |
| |     |                         | |                  | |     | UserProfilePreview | |
| +-----+-------------------------+ |                  | +-----+--------------------+ |
+-----------------------------------+                  +------------------------------+
```

```html
<!-- UserSettings.vue -->
<router-view/>
<router-view name="helper"/>
```

```js
{
  path: '/settings',
  // You could also have named views at the top
  component: UserSettings,
  children: [
    {
      path: 'emails',
      component: UserEmailsSubscriptions
    },
    {
      path: 'profile',
      components: {
        default: UserProfile,
        helper: UserProfilePreview
      }
    },
  ]
}
```

## Redirect and Alias

- リダイレクトするには次のようにする。
- なお、この場合、ナビゲーションガードはリダイレクト元には適用されないので注意。

```js
routes = [
  // 通常のリダイレクト
  { path: '/a', redirect: '/b' },
  // Named Routeにリダイレクト
  { path: '/a', redirect: { name: 'foo' } },
  // ファンクションを使ってリダイレクト
  {
    path: '/a',
    redirect: to => {
      // TODO: toがなんなのかよくわからない
      // return redirect path/location here.
    },
  },
];
```

## Alias

リダイレクトと異なり、history を変更せず、ただ単に表示する内容を`path`で指定したものに差し替える。
パスを変更するコストをかけずに、URL の構成を変えることができるので便利。

```js
routes = [{ path: '/a', component: A, alias: '/b' }];
```

## ルートに関する情報を、$route ではなく Props として渡す

パラメータ類を`$route`で取得するとコンポーネントの再利用性・テスト性が低くなるので、`props`を使って取得するほうがよい。

BAD

```js
// コンポーネント
const User = {
  template: '<div>User {{ $route.params.id }}</div>',
};
// vue-router設定
const router = new VueRouter({
  routes: [{ path: '/user/:id', component: User }],
});
```

GOOD

```js
// コンポーネント
const User = {
  props: ['id'],
  template: '<div>User {{ id }}</div>',
};
// vue-router設定
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User, props: true },

    // Named Viewを使っている場合はそれぞれに指定する
    {
      path: '/user/:id',
      components: { default: User, sidebar: Sidebar },
      props: { default: true, sidebar: false },
    },
  ],
});
```

`props`に指定できる値は下記の 3 種類がある

- boolean
  - `route.params`が props として渡される
- object
  - そのオブジェクトがそのまま props として渡される
- function
  - 計算結果のオブジェクトが props として渡される
  - ルートが変更された時にのみ実行されるので、ステートフルにしないよう注意する
  - 例：`(route) => ({ query: route.query.q }) }`

## HTML5 History Mode

- hash mode (デフォルト)
- history(HTML5) mode

HTML5 モードを使うには次のように設定する。

```js
const router = new VueRouter({
  mode: 'history',
});
```

HTML5 モードにした場合、サーバ側で、全てのルートへのリクエストに対し`index.html`を返すように設定しておく必要があるので注意する。サーバ別の設定方法は[こちら](https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations)

この設定を行うと、404 ページが表示されなくなるため、下記の設定を行っておくこと。もしくは、サーバー側で、存在しない URL の場合に 404 を返す設定を行うこと。

```js
routes = [{ path: '*', component: NotFoundComponent }];
```

## Navigation Guards

### Global Guards

#### beforeEach

全てのルート変更をキャッチする。

```js
router.beforeEach((to, from, next) => {});
```

- `to` 移動先の[Route Object](https://router.vuejs.org/api/#route-object-properties)
- `from` 移動元の Route Object
- `next` 処理を完了するファンクション
  - `next()`　ルートの変更が**承認**される
  - `next(false)`　処理を中止し元のルートに戻る
  - `next('/')` or `next({...})`　別のルートに移る。[オブジェクトとして渡せるもの一覧](https://router.vuejs.org/api/#route-object-properties)
  - `next(ErrorInstance)` 処理を中断する。エラーは`router.onError()`で拾える。

#### beforeResolve

`router.beforeResolve`で登録する。`beforeEach`との違いは次の通り。

- Route の変更が承認される**直前**に実行される。
- 全ての、in-Component Guard と、非同期コンポーネントが解決された**後**に実行される。

#### afterEach

Route 変更の後に呼ばれる。`next`は無いので変更を止めることはできない。

```js
router.afterEach((to, from) => {});
```

### Per-Route Guard

Route 設定ごとのガード。`beforeEnter`

```js
routes = [
  {
    path: '/foo',
    component: Foo,
    beforeEnter: (to, from, next) => {},
  },
];
```

### In-Component Guards

コンポーネントごとのガード

- `beforeRouteEnter`

  - そのコンポーネントを使う Route が承認される前に呼ばれる
  - `this`でコンポーネントインスタンスにアクセスできない（作られる前だから）
  - インスタンスへアクセスするには `next` コールバックを使う。ナビーゲーションの確定後に実行される。
    ```js
    next(vm => {
      // `vm` を通じてコンポーネントインスタンスにアクセス
    });
    ```

- `beforeRouteUpdate`
  - そのコンポーネントを使う Route が変更された場合に呼ばれる
  - 例）'/foo/1' => '/foo/2'
  - `this`でコンポーネントインスタンスにアクセスできる
- `beforeRouteLeave`
  - そのコンポーネントを使う Route から、別の Route に移動する前に呼ばれる
  - `this`でコンポーネントインスタンスにアクセスできる

```js
const MyComponent = {
  template: `...`,
  beforeRouteEnter(to, from, next) {},
  beforeRouteUpdate(to, from, next) {},
  beforeRouteLeave(to, from, next) {},
};
```

### ガードの呼び出し順まとめ

1. **ナビゲーションがトリガされる**
1. 非アクティブ化されたコンポーネントの `beforeRouteLeave`
1. グローバル `beforeEach`
1. 再利用されるコンポーネントの `beforeRouteUpdate`
1. ルート設定内の `beforeEnter`
1. 非同期ルートコンポーネントを解決する
1. アクティブ化されたコンポーネントの `beforeRouteEnter`
1. グローバル `beforeResolve`
1. **ナビゲーションが確定される**
1. グローバル `afterEach` フックを呼ぶ
1. DOM 更新がトリガされる
1. 生成されたインスンタンスによって `beforeRouteEnter` ガードで `next` に渡されたコールバックを呼ぶ

### 注意

`params`,`query`だけの変更は、`enver`/`leave`ナビゲーションガードを発動**しない**ので注意。

## Route Meta Fields

ルート設定にメタ情報をもたせることができる

```js
routes = [
  {
    path: '/foo',
    component: Foo,
    meta: { requiresAuth: true },
  },
];
```

メタ情報は`route`オブジェクトの`matched`Array の各アイテムの`meta`として取得できる。

```js
if (someRouteObject.matched.some(record => record.meta.requiresAuth)) {
  alert('require authengication');
}
```

### 詳細

- `routes`コンフィグに記載した一つ一つのルート設定を**route record**と呼ぶ
- ネストしたパスの場合は、複数の route record にマッチする場合がある
- そのため、`$route`オブジェクトは、`matched`という Array プロパティを持ち、マッチした全ての Route 情報を保持している。

```js
// Route設定
routes = [
  {
    path: '/foo',
    component: Foo,
    children: [
      {
        path: 'bar',
        component: Bar,
        // a meta field
        meta: { requiresAuth: true },
      },
    ],
  },
];

// 例えば上記の設定の場合、'/foo/bar'にアクセスすると、
// matched配列には2つのRouteオブジェクトが入る

// ナビゲーションガード
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!auth.loggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  } else {
    next(); // make sure to always call next()!
  }
});
```

## Transitions

TODO: Vue の Transition を読んでから

## Data Fetching

ルートの変更をトリガにデータを取得する場合の方法は 2 つある。詳細は[こちら](https://router.vuejs.org/guide/advanced/data-fetching.html#data-fetching)を参照。

### ナビゲーション後に取得

コンポーネントのライフサイクルメソッド(`created`)においてデータ取得

```js
// ナビゲーション後に取得
MyComponent = {
  created() {
    this.fetchData();
  },
  watch: {
    // call again the method if the route changes
    $route: 'fetchData',
  },
  methods: {
    fetchData() {
      /* なんらかのデータ取得処理と、データのstateへの格納処理 */
    },
  },
};
```

### ナビゲーション前に取得

コンポーネントの`beforeRouteEnter`ガードで取得する

```js
// ナビゲーション前に取得
MyComponent = {
  beforeRouteEnter(to, from, next) {
    /* なんらかのデータ取得処理 */
    next(vm => vm.setData(data));
  },
  beforeRouteUpdate(to, from, next) {
    /* なんらかのデータ取得処理 */
    this.setData(data));
    next();
  },
  methods: {
    setData(err, post) {
      /* データのstateへの格納処理 */
    },
  },
};
```

## Scroll Behavior

ページ遷移時のスクロール位置を設定できる。

```js
const router = new VueRouter({
  scrollBehavior(to, from, savedPosition) {
    // return Position Object
  },
});
```

Position Object の形式は以下のいずれか。

- `{ x: number, y: number }`
- `{ selector: string, offset? : { x: number, y: number }}`
- 上記 2 つのいずれかを返す`Promise`

```js
scrollBehavior (to, from, savedPosition) {
  // 常にトップ位置にスクロール
  return { x: 0, y: 0 }

  // 以前の位置にスクロール、以前の位置がなければトップにスクロール
  if (savedPosition) {
    return savedPosition
  } else {
    return { x: 0, y: 0 }
  }

  // アンカーがある場合はその位置にスクロール
  if (to.hash) {
    return {
      selector: to.hash
      // , offset: { x: 0, y: 10 }
    }
  }
}
```

## Lazy Loading Routes

Async Component を作成するには、Promise を使う。

```js
const Foo = () =>
  Promise.resolve({
    /* component definition */
  });
```

webpack では、`import`が使える。

```js
import('./Foo.vue'); // returns a Promise
```

上記の 2 つの事実から、vue-router でコンポーネントを Lazy Loading するには次のようにする。

```js
const Foo = () => import('./Foo.vue');
```

なお、Babel を使っている場合は、import 文を正しく理解させるため、`syntax-dynamic-import`をあわせて導入する必要がある。
