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

### Interpolation(Vue のデータを HTML に展開する)

#### Text

- Mustache 記法を使う

```html
<span>Message: {{ msg }}</span>
<span v-once>This will never change: {{ msg }}</span> // 最初の1回のみ更新
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

`v-on`と`v-model`には Modifier という便利なものが用意されている。

```html
<!-- submit時にevent.preventDefault()してくれる -->
<form v-on:submit.prevent="onSubmit"> ... </form>
```

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

#### 注意

下記の操作は Vue が検知できないので注意。対処法は[こちら](https://vuejs.org/v2/guide/list.html#Caveats)。

```js
// インデックスを使用した値の変更
vm.items[indexOfItem] = newValue;
// Arrayのlengthの編集
vm.items.length = newLength;
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

// ルートレベルでなければ、setを使うことで追加は可能
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

### is Attribute

例えば、li 要素に該当する部分をコンポーネントに置き換えるときは、下記のようにする。
そうしないと、valid な HTML とならないため、なにか問題が起こるかも。

```html
<li is="todo-item-component"></li>
<!-- これは下記と等価 -->
<todo-item-component></todo-item-component>
```
