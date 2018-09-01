# Material-UI

[[toc]]

## Setup

- add font link to `index.html` file
- install `@material-ui/core` & `@material-ui/icons`
- normalize styles with `<CssBaseline />`
- use `withStyles()` to write css in js

## react-router のリンクを張る

```jsx
<ListItem button component={Link} to="/Auth">
<Button component={Link} to="/account">
```
