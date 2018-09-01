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

属性にデータをバインドする。

```html
<a v-bind:href="someUrl" />
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
<button v-on:click="onButtonClick">
  Press Me
</button>
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
