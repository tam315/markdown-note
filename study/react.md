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
