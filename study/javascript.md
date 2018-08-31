# Javascript

[[toc]]

## Tips

### URI エンコード

エンコードが必要な部分ごとに `encodeURIComponent` をかけた上で結合し、URI を完成させること。

firebase storage のダウンロードリンクを作成する際によく使う。

[参考](http://www.m-bsys.com/code/javascripr-encodeuri)

```js
encodeURIComponent('post/filename.jpg');
// => "post%2Ffilename.jpg"
```
