# React

[[toc]]

## Tips

### props をパスするーする際の注意点

子の先頭で渡す。その下に記載した属性はオーバーライドされるので、必要に応じてマージする。

```jsx
<SomeComponent
  {...props}
  disabled={props.disabled || true} // マージする属性
  name={props.name || 'myname'} // マージする属性
  value={123} // マージしない属性
/>
```

### ReactNode, ReactChild, ReactElement の違い

[こちらを参照](https://dackdive.hateblo.jp/entry/2019/08/07/090000)

### IE11 対応

create-react-app の場合は下記を`index.html`の`head`タグに入れれば OK かも

```js
<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
```
