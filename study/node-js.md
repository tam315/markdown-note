# Node.js

[[toc]]

## ファイル操作

### writeFileSync

データをファイルに同期的に書き込む。

```js
fs.writeFileSync('/tmp/uploaded-image.jpg', request.body.image, 'base64');
```
