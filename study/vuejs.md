# Vue.js

[[toc]]

## 基本

### セットアップ

```html
<div id="app" />
```

```jsx
var app = new Vue({
  el: '#app',
});
```

### Interpolation (展開)

```html
<span>{{message}}</span>
```

```jsx
// index.js
var app = new Vue({
  data: {
    message: 'hello!',
  },
});
```

### bind

属性にデータをバインドする。バインドしないと、ただのテキストとして評価される。

```html
<a v-bind:href="someUrl" />
<a :href="someUrl" />
```

```jsx
new Vue({
  data: {
    someUrl: 'http://someghing.com/',
  },
});
```

### if

```html
<span v-if="rock">you rock!</span>
```

```jsx
new Vue({
  data: {
    rock: true,
  },
});
```

### for

```html
<li v-for="todo in todos">
  {{ todo.text }}
</li>
```

```js
new Vue({
  data: {
    todos: [
      { text: 'Learn JavaScript' },
      { text: 'Learn Vue' },
      { text: 'Build something' },
    ],
  },
});
```

### on

イベントリスナを設定する。

```html
{{message}}
<button v-on:click="onButtonClick" />
<button @click="onButtonClick" />
```

```js
new Vue({
  data: {
    message: 'Hello',
  },
  methods: {
    onButtonClick() {
      this.message = 'Hello Again!';
    },
  },
});
```

### model

two-way binding を設定する。

```html
<input v-model="name" />
```

```js
new Vue({
  data: {
    name: 'john',
  },
});
```

### components

```html
<todo-item
  v-for="item in groceryList"
  v-bind:todo="item"
/>
```

```js
Vue.component('todo-item', {
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>',
});

new Vue({
  data: {
    groceryList: [
      { id: 0, text: 'Vegetables' },
      { id: 1, text: 'Cheese' },
      { id: 2, text: 'Whatever' },
    ],
  },
});
```

## Vue Instance

### インスタンスの作成

```js
const vm = new Vue(options); // root Vue instance
Vue.component('some-component', options); // other Vue instances
```

### data

- data プロパティに渡したオブジェクトは、Vue の Reactivity System に組み込まれる。
- インスタンスからの変更、元データの変更は、双方向に反映される。
- data の変更は自動的に View に反映される。
- data に後からプロパティを追加することはできない。

```js
var data = { a: 1 };

var vm = new Vue({
  data: data,
});

vm.a === data.a; // => true

vm.a = 2;
data.a; // => 2

data.a = 3;
vm.a; // => 3
```

### 規定のプロパティ・メソッド

インスタンスには、名前が`$`で始まる、規定のプロパティとメソッドがある。

[参考](https://vuejs.org/v2/api/#Instance-Properties)

```js
vm.$data === data; // => true
vm.$el === document.getElementById('example'); // => true

vm.$watch('a', function(newValue, oldValue) {
  // This callback will be called when `vm.a` changes
});
```

### Lifecycle Hooks

- いくつかのライフサイクルメソッドがある
- ライフサイクルメソッドの中の`this`は、常に Vue インスタンスを指す（アロー関数は使えないので注意する）

![lifecycle](https://vuejs.org/images/lifecycle.png =500x)

## Template Syntax

- テンプレートは Valid な HTML である。
- テンプレートを使わずに、JSX と`render`ファンクションを使うこともできる。

### Interpolation(Vue のデータをテンプレートに展開する)

#### Text

- Mustache 記法を使う

```html
<span>Message: {{ msg }}</span>
<span v-once>This will never change: {{ msg }}</span> // 最初の1回のみ更新

<!-- 下記は機能しない。代わりにv-modelを使うこと。 -->
<textarea>{{text}}</textarea>
```

#### Raw HTML

- v-html ディレクティブを使う

```html
<span v-html="rawHtml" />
```

#### Attributes

- 属性の中では Mustache 記法は使えない。代わりに v-bind を使う。
- null, undefined, false の場合、属性はレンダリングされない

```html
<div v-bind:id="dynamicId"></div>
<div v-bind:active="isActive"></div> // falsyならactiveはレンダリングされない
```

#### Javascript

テンプレートには 1 文までの Javascript を記載できる。

```html
{{ number + 1 }}
{{ ok ? 'YES' : 'NO' }}
{{ message.split('').reverse().join('') }}
<div v-bind:id="'list-' + id"></div>
```

### Directives

- `v-**`がディレクティブである
- ディレクティブには 1 文までの Javascript を記載できる

#### modifier

`v-on`と`v-model`には Modifier という便利なものが用意されている（後述）

## Computed Properties and Watchers

### computed

- 複雑な計算には`computed`プロパティを使う。
- `comupted`は Getter として機能する。
- `computed`が依存する`data`がアップデートされたときは自動で再計算され、View に反映される

```html
<p>{{ reversedMessage }}</p>
```

```js
var vm = new Vue({
  data: {
    message: 'Hello',
  },
  computed: {
    reversedMessage: function() {
      return this.message.split('');
    },
  },
});
```

### computed と method の違い

`computed`と同じことは`methods`でもできる。違いは下記の通り。

- `computed`は、**依存する`data`が変更されない限り再計算をしない**（キャッシュが使われる）
- `methods`は、常に再計算をする

### computed と watch の違い

殆どの場合`watch`でデータを変更するのは[効率が悪い](https://vuejs.org/v2/guide/computed.html#Computed-vs-Watched-Property)。
`computed`を使え。

`watch`が最適となるのは、データの変更に応じて、**非同期 or 高価**な処理を行う場合に限る（[参考](https://vuejs.org/v2/guide/computed.html#Watchers)）

### setter

`computed`は、標準では getter としてのみ機能する。
setter を使いたいときは下記のようにする。

```js
computed: {
  fullName: {
    get: function () {},
    set: function (newValue) {}
  }
}
```

## Class and Style Bindings

### Classes

- `v-bind:class`を使うことで、クラスを動的に設定できる
- オブジェクトはインラインでなくても OK（外出ししてもよい）
- `computed`で計算したオブジェクトを使うと、便利で強力である
- Array Syntax で複数の要素を指定することもできる

```html
<div class="some-default-class"
     v-bind:class="{ active: isActive, 'text-danger': hasError }">
</div>

<!-- errorClass='some-string' -->
<div v-bind:class="[{ active: isActive }, errorClass]"></div>
```

#### Component に Class を指定したとき

Component に Class を指定したときは、そのコンポーネントのルート要素にそのクラスが設定される。

```html
<my-component class="baz boo"></my-component>
```

### Styles

- Class の場合とほぼ同じ
- Auto Prefix される

```html
<div v-bind:style="styleObject"></div>
<div v-bind:style="[baseStyles, overridingStyles]"></div>
```

## Conditional Rendering

### v-if

```html
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Not A/B/C
</div>
```

### template

2 つ以上の要素にまとめて v-if を設定したいときは template を使う。

```html
<template v-if="ok">
  <h1>Title</h1>
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</template>
```

### DOM の再利用

- v-if は、DOM を再利用する。再利用させたくない場合は`key`属性を指定する。
- 下記の場合、label は再利用されるが、input は再利用されない。

```html
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input key="username-input">
</template>
<template v-else>
  <label>Email</label>
  <input key="email-input">
</template>
```

### v-show

v-if との違いは下記の通り

`v-if`

- 条件が True になったとき、初めて内包する要素が生成される。
- 条件が False になったときは要素が削除される。
- トグルのコストが高い
- あまりトグルしないものに向いている

`v-show`

- template, v-else は使えない
- 条件に関係なく常に生成される。css の display を変更しているだけ。
- 初期表示のコストが高い
- 頻繁にトグルするものに向いている

### v-if と v-for

- `v-if`と`v-for`を同時に使った場合、`v-for`が優先される。
- つまり、`v-for`の各子要素に対して`v-if`がアタッチされる

## List Rendering

### v-for

- Array や Object にループ処理を行った上でレンダリングするためのもの。
- `in`は`of`に置き換えてもよい。

```html
<!-- Array -->
<li v-for="item in array"></li>
<li v-for="(item, index) in array"></li>

<!-- Object -->
<li v-for="item in object"></li>
<div v-for="(value, key) in object">
<div v-for="(value, key, index) in object">
```

#### key

リスト要素には、必ず key 要素をつけること。
（デフォルトの"in-place patch"という方法を意図的に使いたい場合を除く）

### Array の変更検知

data の Array に対して行った、`push()`,`pop()`,`shift()`,`unshift()`,`splice()`,`sort()`,`reverse()`などの変更は、自動的に View に反映される。

`filter()`や`concat()`等の元データを変更しないメソッドの場合は、元データを書き換えるのを忘れないこと。

また、下記の操作は Vue が検知できないので注意。

```js
// インデックスを使用した値の変更
vm.items[indexOfItem] = newValue;
// Arrayのlengthの編集
vm.items.length = newLength;
```

そんなときは`Vue.set`や`splice`を使うこと

```js
Vue.set(vm.items, indexOfItem, newValue);
vm.items.splice(indexOfItem, 1, newValue);
```

### Object の変更検知

ルートレベルのプロパティの追加は Vue が検知できない。

```js
var vm = new Vue({
  data: {
    a: 1,
    userProfile: {},
  },
});
vm.b = 2; // `vm.b` is NOT reactive
```

ルートレベルでなければ、set を使うことで追加は可能

```js
Vue.set(vm.userProfile, 'age', 27);

// setではなくObject.Assignなどを使いたいときは、
// 元のオブジェクトは捨てて、フレッシュなオブジェクトをセットすること
vm.userProfile = Object.assign({}, vm.userProfile, {
  age: 27,
  favoriteColor: 'Vue Green',
});
```

### 配列にフィルタ・ソートをかけるには

フィルタ・ソートをかけたいときは、`computed`or`method`を使うと便利。

```js
data: {
  numbers: [ 1, 2, 3, 4, 5 ]
},
computed: {
  evenNumbers: function () {
    return this.numbers.filter(function (number) {
      return number % 2 === 0
    })
  }
}
```

### 指定回数だけ v-for を実行

```html
<span v-for="n in 10">{{ n }} </span>
<!-- 1,2,3,,,,,10 -->
```

### 複数の要素を繰り返す

v-if と同じく、template を使う。

```html
<template v-for="item in items">
  <li>{{ item.msg }}</li>
  <li class="divider" role="presentation"></li>
</template>
```

### v-for をコンポーネントで使う

通常の要素と同じように、コンポーネントにも v-for が使える。
ただし、コンポーネント内からは外部の値にアクセス出来ないので、必要なものは明示的に props として渡す必要がある。

```html
<my-component
  v-for="(item, index) in items"
  v-bind:item="item"
  v-bind:index="index"
  v-bind:key="item.id"
></my-component>
```

## Event Handling

### イベントを Listen する

```html
<!-- `counter` is the name of a variable -->
<button v-on:click="counter += 1">Add 1</button>

<!-- `greet` is the name of a method. JSXと異なり、()をつけてもInvokeされない -->
<button v-on:click="greet">Greet</button>
<button v-on:click="greet('hello')">Greet</button>

<!-- イベントを渡したいときは$eventを使う -->
<button v-on:click="greet('hello', $event)"></button>
```

### Event Modifier

- DOM 専用
  - `.stop` propagation を止める(バブリングフェーズでの外側のイベントの発生を止める)
  - `.prevent` preventDefault()
  - `.capture` capture モードにする（キャプチャフェーズでイベントを発生させる）
  - `.self` ターゲットが自分自身であったときのみイベントを発生させる
  - `.passive` passive イベントとして設定（preventDefault しないことを宣言。[参考資料](https://blog.jxck.io/entries/2016-06-09/passive-event-listeners.html)）
- DOM/Component で使用可
  - `.once` 一度だけ実行

#### 注意点

- 適用順に注意
  - `v-on:click.prevent.self`
    - バブリングを含めた全てのフェーズにおいて prevent する
    - ターゲットが自分自身のフェーズにおいてのみ、click イベントが発生する
  - `v-on:click.self.prevent`
    - ターゲットが自分自身のフェーズにおいてのみ click イベントが発生かつ prevent する
- 当然だが、`prevent`と`passive`は同時に使用できない

### Key Modifier

```html
<input v-on:keyup.13="submit">
<!-- same as above -->
<input v-on:keyup.enter="submit">
```

エイリアスの一覧

- `.enter`
- `.tab`
- `.delete` (captures both “Delete” and “Backspace” keys)
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

[KeyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values)をケバブケースにしたものも使用可能。

```html
<input @keyup.page-down="onPageDown">
```

独自のエイリアス設定も可能

```js
Vue.config.keyCodes.f1 = 112;
```

### System Modifier Key

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

```html
<!-- Alt + C -->
<input @keyup.alt.67="clear">

<!-- Ctrl + Click -->
<div @click.ctrl="doSomething">Do something</div>
```

### exact Modifier

`exact`を指定すると、指定したキーのみが押されているときのみイベントが発生する。

```html
<!-- this will fire even if Alt or Shift is also pressed -->
<button @click.ctrl="onClick">A</button>

<!-- this will only fire when Ctrl and no other keys are pressed -->
<button @click.ctrl.exact="onCtrlClick">A</button>
```

### Mouse Button Midifier

- `.left`
- `.right`
- `.middle`

## Form Input Bindings

### 基本

- `v-model`を使う
- IME 環境では確定されるまで data は変更されない。確定前の入力を捕捉したい場合は`input`イベントを使って自前で実装すること。

#### Text

```html
<input v-model="message">
```

#### Multiline text

```html
<textarea v-model="message"></textarea>
```

#### Checkbox

```html
<!-- checkedはbooleanになる -->
<input type="checkbox" id="checkbox" v-model="checked">

<!-- もし、toggleに特定の文字列を入れたい場合 -->
<input
  type="checkbox"
  v-model="toggle"
  true-value="yes"
  false-value="no"
>

<!-- checkedNamesは、valueの値からなる配列になる -->
<div>
  <input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
  <input type="checkbox" id="john" value="John" v-model="checkedNames">
  <input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
  <span>Checked names: {{ checkedNames }}</span>
</div>
```

#### Radio

`picked`には value の値が入る。

```html
<input type="radio" id="one" value="One" v-model="picked">
<input type="radio" id="two" value="Two" v-model="picked">
```

#### Select（単一選択）

- `selected`には`option`で囲んだ値が入る
- iOS で問題が起こるので、1 行目は`disabled`とし、空の value を設定したほうがよい

```html
<select v-model="selected">
  <option disabled value="">Please select one</option>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
```

#### Select（複数選択）

```html
<!-- selectedはArrayになる -->
<select v-model="selected" multiple>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
```

#### その他

`value`の値は、string 以外にも、v-bind した値を使用することもできる。この場合、string だけでなく、オブジェクトや数値を渡すことができる。

### Modifier

- `.lazy` input イベントではなく change イベント（フォーカスを失った時）の際に data を更新する。
- `.number` 文字列ではなく数値として扱う
- `.trim` 余分な空白等を削る

```html
<input v-model.lazy="msg" >
<input v-model.number="age" type="number">
<input v-model.trim="msg">
```

## Components Basics

### 基本

コンポーネントは、root Vue とほぼ同じプロパティを持つ。相違点は次のとおり。

- `el`がない
- `data`はファンクションにする必要がある

### 注意点

- コンポーネントはシングルルート要素でなければならない
- template リテラルは IE では使えないので注意。使うなら babel でトランスパイルする。

  ```js
  template = `
  multiline
  `;
  ```

### global と local

global に宣言すると、root Vue instance の中のどこからでも使える。

```js
Vue.component('my-component-name');
```

### props

コンポーネントはコンポーネントの外の値にアクセスできない。
アクセスするには、props を使って明示的に値を渡す必要がある。

```js
Vue.component('blog-post', {
  props: ['title'],
  template: '<h3>{{ title }}</h3>',
});
```

### Emitting Event

コンポーネントから親にイベントを渡すには、`this.$emit`を使う。

```html
<!-- component -->
<button v-on:click="$emit('enlarge-text')"></button>
<button v-on:click="$emit('enlarge-text', 2)"></button>

<!-- parent -->
<!-- 引数があり、かつメソッドの()を省略した場合、自動的に第一引数に渡される -->
<blog-post :enlarge-text="alert()"></blog-post>
<blog-post :enlarge-text="alert($event)"></blog-post>
<blog-post :enlarge-text="onEnlargeText"></blog-post>
```

### コンポーネントで v-model を使うには

v-bind は、内部的には次の 2 つの機能から成り立っている。

- `value`prop へのバインディング
- `input`イベントによるデータの更新

```html
<input v-model="searchText">
<!-- これは下記と等価 -->
<input
  v-bind:value="searchText"
  v-on:input="searchText = $event.target.value"
>
```

コンポーネントの場合は、上記を念頭に置き、下記のようにする。

```html
<!-- parent -->
<custom-input
  v-bind:value="searchText"
  v-on:input="searchText = $event"
></custom-input>

<!-- component -->
<input
  v-bind:value="value"
  v-on:input="$emit('input', $event.target.value)"
>

<!-- ここまで来たら、parentは下記の通り書き換えてもOK -->
<custom-input v-model="searchText" />
```

なお、標準では、v-model は、`value`props と`input`event を使うので、
checkbox などを使うときは、下記のような工夫が必要。

```js
Vue.component('base-checkbox', {
  model: {
    // v-modelに、valueの代わりに`checked`を使え、と伝える
    prop: 'checked',
    // v-modelに、inputイベントの代わりに`change`イベントを見ろ、と伝える
    event: 'change',
  },
  props: {
    checked: Boolean,
  },
  template: `
    <input
      type="checkbox"
      v-bind:checked="checked"
      v-on:change="$emit('change', $event.target.checked)"
    >
  `,
});
```

### Slot

React での children と同じ。

```html
<!-- parent -->
<alert-box>
  Something bad happened.
</alert-box>

<!-- component -->
<div>
  <slot></slot> <!-- ここに`Something bad happened.`が入る -->
</div>
```

### Dynamic Components

- コンポーネントを動的に切り替えたい場合は、`component`要素と`is`属性を使う。
- `is`の値には次のいずれかを指定する
  - 登録済みのコンポーネントの名称を入れた変数
  - コンポーネントを作成するときの`option`に相当するオブジェクト

```html
<component :is="currentTabComponent"></component>
```

### DOM テンプレートパース時の警告

- `ul`,`ol`,`table`のようないくつかの HTML 要素には、それらの要素の中でどの要素が現れるかに制限がある。そんなときは`is`属性を使うこと。
- なお、下記の中であればこの制約は該当しない
  - `template`プロパティの中
  - `.vue`ファイルの中
  - `<script type="text/x-template">`の中

```html
<!-- 下記は認められない -->
<table>
  <blog-post-row></blog-post-row>
</table>

<!-- 下記のようにすべし -->
<table>
  <tr is="blog-post-row"></tr>
</table>
```

## Component Registration

### 名前の付け方

- 全て小文字、必ずハイフンを含める（W3C）
- PascalCase で宣言すると、ケバブ、パスカルのどちらでもアクセスできる。ただし、DOM の中ではケバブのみが valid である点に留意する

### Global Registration

```js
Vue.component('component-a', {});
Vue.component('component-b', {});
```

component-b から component-a を利用できる。

### Local Registration

```js
var ComponentA = {};
var ComponentB = {};

new Vue({
  components: {
    'component-a': ComponentA,
    'component-b': ComponentB,
  },
});
```

component-b から component-a は利用できない。利用するには下記のようにする。

```js
var ComponentA = {};

var ComponentB = {
  components: {
    'component-a': ComponentA,
  },
};

// もしくは、webpack等を使っている場合、ComponentB.vueにおいて
import ComponentA from './ComponentA.vue';

export default {
  components: {
    ComponentA,
  },
};
```

### Base Component

- 頻繁に使用するコンポーネントは Base Component として作成しておくと良い。
- [Base コンポーネントを自動的にグローバル登録する方法](https://vuejs.org/v2/guide/components-registration.html#Automatic-Global-Registration-of-Base-Components)もある

## Props

### camel vs kebab

props の名前を camelCase にした場合は、props を渡す時に kebab-case にする必要がある。
ただし、string templates の中ではこの制約は該当しない。

```js
Vue.component('blog-post', {
  props: ['postTitle'],
  template: '<h3>{{ postTitle }}</h3>',
});
```

```html
<!-- DOMテンプレート -->
<blog-post post-title="hello!"></blog-post>
<!-- string templateの中では下記でもOK -->
<blog-post postTitle="hello!"></blog-post>
```

### Prop Types & Validation

Prop Types を使いたいときは、配列ではなく、オブジェクトで指定する。

```js
Vue.component('my-component', {
  props: {
    // Basic type check (`null` matches any type)
    propA: Number,
    // Multiple possible types
    propB: [String, Number],
    // Required string
    propC: {
      type: String,
      required: true,
    },
    // Number with a default value
    propD: {
      type: Number,
      default: 100,
    },
    // Object with a default value
    propE: {
      type: Object,
      // Object or array defaults must be returned from
      // a factory function
      default: function() {
        return { message: 'hello' };
      },
    },
    // Custom validator function
    propF: {
      validator: function(value) {
        // The value must match one of these strings
        return ['success', 'warning', 'danger'].indexOf(value) !== -1;
      },
    },
  },
});
```

Type として使えるもの

- String
- Number
- Boolean
- Array
- Object
- Date
- Function
- Symbol
- コンストラクタ関数(instanceof でチェックされる)

### props に様々な種類のデータを渡す

v-bind を使うと、様々な Javascript の値を渡すことができる。

```html
<!-- 数値として -->
<blog-post :likes="42"></blog-post>

<!-- オブジェクトの値を渡す -->
<blog-post :likes="post.likes"></blog-post>

<!-- Booleanとして -->
<blog-post :is-published="false"></blog-post>

<!-- 配列として -->
<blog-post :comment-ids="[234, 266, 273]"></blog-post>

<!-- オブジェクトとして -->
<blog-post :author="{ name: 'Veronica', company: 'Veridian Dynamics' }"></blog-post>
```

### オブジェクトのプロパティを分解して渡す

`v-bind=`を使うことで全てのプロパティを分解して渡せる。

```js
post: {
  id: 1,
  title: 'My Journey with Vue'
}
```

```html
<blog-post v-bind="post"></blog-post>
<!-- 上記は下記と等価 -->
<blog-post
  v-bind:id="post.id"
  v-bind:title="post.title"
></blog-post>
```

### One-way data flow

いかなる場合でも、props の値は変更するな。
変えたいなら、あくまで`data`の初期値として利用するにとどめるか、computed を使うなどしろ。

### コンポーネントに対して Props に記載してない属性を渡すとどうなる？

- コンポーネントのルート要素にアタッチされる。
- その際、class と style についてはマージされる。それ以外はまるごと置換えられるので注意。

この機能を無効にするには：

```js
Vue.component('my-component', {
  inheritAttrs: false,
});
```

無効にしても、`$attrs`を使うことで属性の取得は行える。これは、Base Component を作る時に特に便利。

```js
Vue.component('base-input', {
  inheritAttrs: false,
  props: ['label', 'value'],
  template: `
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        :value="value"
        :input="$emit('input', $event.target.value)"
      >
    </label>
  `,
});
```

```jsx
<base-input
  label="something" // `label` propsになる
  v-model="username" // `value` propsになる。また、inputイベントを受けて値を更新する。
  class="username-input" // input要素にアタッチされる
  placeholder="Enter your username" // input要素にアタッチされる
/>
```

## Custom Events

### イベント名

イベント名には常に kebab-case を使え。例外はない。

### ネイティブイベントを補足する

- `.native` modifier を使うと、コンポーネントのルート要素のイベントを捕捉できる。
- ルート要素以外のイベントを捕捉するには[工夫](https://vuejs.org/v2/guide/components-custom-events.html#Binding-Native-Events-to-Components)が必要。

```html
<base-input v-on:focus.native="onFocus"></base-input>
```

### `.sync` modifier

- 親とコンポーネントの間で擬似的な two-way binding を行うためのもの。
- キモは`update:`の記法と`.sync`がセットになっていること。

```js
// コンポーネント側
this.$emit('update:title', newTitle);
```

```html
<!-- 親 -->
<text-document
  :title="doc.title"
  @update:title="doc.title = $event"
></text-document>

<!-- 上記は下記と等価 -->
<text-document :title.sync="doc.title"></text-document>
```

## Slot

### Scope

親テンプレート内の全てのものは親のスコープでコンパイルされ、子テンプレート内の全てものは子のスコープでコンパイルされる

### Named Slot

```html
<!-- component -->
<div class="container">
  <header>
    <slot name="header">Default Content</slot>
  </header>
  <main>
    <slot>Default Content</slot>
  </main>
  <footer>
    <slot name="footer">Default Content</slot>
  </footer>
</div>

<!-- parent -->
<base-layout>
  <template slot="header">
    <h1>Here might be a page title</h1>
  </template>

  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template slot="footer">
    <p>Here's some contact info</p>
  </template>
</base-layout>
```

### Scoped Slots

`slot-scope`属性を指定することで、slot（子）の属性に、外側（親）からアクセスできる。

```html
<!-- component -->
<slot :a="1" normalAttr="2"></slot>

<!-- parent -->
<todo-list>
  <p slot-scope="slotProps">{{ slotProps }}</p>
  <!-- { "a": 1, "normalAttr": "2" } -->
</todo-list>
```

## Dynamic & Async Components

### Dynamic Component（keep-alive）

- `is`プロパティを使ってコンポーネントを切り替えると、切り替える前のコンポーネントは破棄される。
  破棄したくない場合は、`keep-alive`要素で囲むこと。
- この機能は、コンポーネントが name を持っている場合にのみ機能するので注意すること

```html
<keep-alive>
  <component v-bind:is="currentTabComponent"></component>
</keep-alive>
```

### Async Components

コンポーネントを非同期に作成する方法

```js
Vue.component('async-example', option);

// 方法1（ファンクションを使う）
const option = function(resolve, reject) {
  setTimeout(function() {
    resolve({
      template: '<div>I am async!</div>',
    });
  }, 1000);
};

// 方法2（Webpack の code-splitting の機能 を使用）
const option = function(resolve) {
  require(['./my-async-component'], resolve);
};

// 方法3（Promiseを使う方法。importはPromiseを返す）
const option = () => import('./my-async-component');
```

## Handling Edge Cases

### 親へのアクセス

下記のような便利な変数もあるが、デバッグ目的でのみ使うこと。

- `$root` root instance の値にアクセス
- `$parent` 親の値にアクセス

### 子へのアクセス

ref を使用することで、要素への参照を取得できる

```html
<input ref="usernameInput"></input>
```

```js
this.$refs.input.focus();
```

コンポーネントの中の要素への参照を取得したい場合は[こちら](https://vuejs.org/v2/guide/components-edge-cases.html#Accessing-Child-Component-Instances-amp-Child-Elements)を参照

### Dependency Injection

React の Context に近い。親コンポーネントのデータを、子・孫コンポーネントで使いたい時に使う。多用厳禁（Vuex を使え）。

```js
// 親コンポーネント
provide: function () {
  return {
    getMap: this.getMap
  }
}

// 子 or 孫コンポーネント
inject: ['getMap']
```

### Programatic Event Listener

- `$emit` イベントを発生させる
- `$on` イベントを Listen する
- `$off` イベントの Listen をやめる
- `$once` イベントを一度だけ Listen する（`$off`がいらない？）

これらをうまく使うとコードをきれいに書ける場合がある。

例：

```js
mounted: function () {
  this.attachDatepicker('startDateInput')
  this.attachDatepicker('endDateInput')
},
methods: {
  attachDatepicker: function (refName) {
    var picker = new Pikaday({
      field: this.$refs[refName],
      format: 'YYYY-MM-DD'
    })

    this.$once('hook:beforeDestroy', function () {
      picker.destroy()
    })
  }
}
```

### 循環参照の解決

循環参照 = 互いに依存するコンポーネント

`Vue.component`を使ってグローバル登録した場合は Vue が自動的に問題を解消するが、webpack を使っている場合は下記のエラーが出る。

```txt
Failed to mount component: template or render function not defined.
```

これを解決するには、親となるコンポーネントで次のようにする（[詳細](https://vuejs.org/v2/guide/components-edge-cases.html#Circular-References-Between-Components)）。

```js
// $optionsを使う方法
beforeCreate: function () {
  this.$options.components.TreeFolderContents = require('./tree-folder-contents.vue').default
}

// webpackのimportを使う方法
components: {
  TreeFolderContents: () => import('./tree-folder-contents.vue')
}
```

### テンプレートの作り方（番外編）

どちらも使うな

- Inline Template
- X-Template

## Transitions & Animation

TODO

## Mixins

mixin = コンポーネント作成時につかう`option`の雛形

```js
var myMixin = {
  created: function() {
    this.hello();
  },
  methods: {
    hello: function() {
      console.log('hello from mixin!');
    },
  },
};

var MyComponent = new Vue.extend({
  mixins: [mixin],
  // ...
}
```

### マージ戦略

- `data` sharrow merge (1 階層目だけ)される。重複時は mixin 側が破棄される
- `Lifecycle method` Array になる。全て保持される(mixin の方が最初に実行される)
- `methods`, `components`, `directives` 重複時は mixin 側が破棄される

マージ戦略のカスタマイズ方法は[こちら](https://vuejs.org/v2/guide/mixins.html#Custom-Option-Merge-Strategies)

### Global Mixin

使うな

```js
Vue.mixin({
  /*...*/
});
```

## Custom Directives

自分だけの`v-***`を作ることができる。詳細は[こちら](https://vuejs.org/v2/guide/custom-directive.html)。

```js
// v-focus を作りたい場合

// グローバル
Vue.directive('focus', {
  inserted: function (el) {
    el.focus()
  }
})

// ローカル（コンポーネントごと）
directives: {
  focus: {
    inserted: function (el) {
      el.focus()
    }
  }
}
```

## Render Functions & JSX

TODO

## Plugins

プラグインのタイプ

- グローバルなメソッドとプロパティを追加する
- グローバルなアセットを追加する（directives/filters/transitions etc）
- コンポーネントの option を mixin で追加する(e.g. vue-router)
- Vue instanse メソッドを追加する(Vue.prototype を使う)
- 上記のいずれかと組み合わせて、API を追加する(e.g. vue-router)

プラグインの使い方

```js
Vue.use(MyPlugin, options);

new Vue({});
```

## Filter

Filter は、Mustache 記法の中と、v-bind の中で使える。

```html
<!-- in mustaches -->
{{ message | capitalize }}

<!-- in v-bind -->
<div v-bind:id="rawId | formatId"></div>
```

宣言方法

```js
// ローカル
filters: {
  capitalize: function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
}

// グローバル
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

new Vue({})
```

なお、Filter に引数を渡した場合は、それらは function の第２引数以降に渡される。

```html
{{ message | filterA('string', someValue) }}

<!-- function (message, arg1, arg2)) -->
```

## Production Deployment

[参照](https://vuejs.org/v2/guide/deployment.html)

## Single File Components

webpack+`vue-loader`により、シングルファイルコンポーネントを利用することで、次のことが可能になる。

- シンタックスハイライト
- テンプレートエンジンの利用
- プリプロセッサの利用
- scoped CSS の利用　など

![single file component](https://vuejs.org/images/vue-component-with-preprocessors.png =500x)

## Unit Testing

- [基本的なテストのやり方](https://vuejs.org/v2/guide/unit-testing.html)
- [vue-test-utils](https://vue-test-utils.vuejs.org/)

## Typescript

### コンポーネントの Type

コンポーネントにタイプをアタッチするには、`Vue.component` or `Vue.extend`でコンポーネントを作ること。

### Class-Style Vue Components

[vue-class-component](https://github.com/vuejs/vue-class-component)を使えば
Vue コンポーネントをクラスで記載できる。

## Routing

[vue-router](https://router.vuejs.org/)を使え

## State Management

[vuex](https://vuex.vuejs.org/)を使え

vue-devtools を使えばタイムトラベルデバッグもできる

## Server Side Rendering

[Nuxt](https://nuxtjs.org/)を使え

もしくは[こちらのガイド](https://ssr.vuejs.org/)を参照して自前でやれ
