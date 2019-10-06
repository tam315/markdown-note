# CSS

[[toc]]

## フォントサイズ

### 絶対値

- **px** 10px なら絶対に 10px

### 相対値

親要素のサイズによって可変

- **em** 親要素の`font-size`をベースに算出
- **%** 親要素の`font-size`をベースに算出
- **rem** ルート要素(HTML 要素)の`font-size`をベースに算出。ブラウザ規定は 16px。

## padding での％使用

padding で%指定を使うと、width をベースに算定される。
これは、「横幅\*アスペクト比」で高さを指定したい時に便利。（例えば、4:3 にしたいなら`padding-top: 75%`など）

## BEM

BEM ＝ Block, Element, Modefier

[公式](http://getbem.com/naming/)

```txt
block-longname
block-longname--modefier
block-longname--modkey-modvalue
block-longname__element-longname
block-longname__element-longname--modefier
block-longname__element-longname--modkey-modvalue
```

[変化型](https://qiita.com/mrd-takahashi/items/07dc3b4bad027daa2884)、これがいいかも

```txt
blockLongname-modefier
blockLongname-modkeyModvalue
blockLongname_elementLongname
blockLongname_elementLongname-modefier
blockLongname_elementLongname-modkeyModvalue
```

## z-index

1. HTML において出現順が後のものほど上に重なる
2. `position:static`以外のものは、`position:static`のものより上に重なる
3. transform や opacity を使うと `z-index:0` が指定されたのと同じように振る舞うので注意する
4. 親要素が`position:static`以外の場合、子要素はその親の積み重ねコンテキストに限定される。回避するには、親の外側に移動するか、親の`position`指定を削除する。

[参考](https://coliss.com/articles/build-websites/operation/css/4-reasons-z-index-isnt-working.html)

## その他 Tips

- `margin-left: auto`で右寄せにできる
- `pointer-events: none`でポインタの形が変わるのを無効にできる
- `clip-path`で表示内容にマスクをかけることができる(サポートしているブラウザは少ないので注意)
- `transition`の第 4 引数で開始までの遅延時間を指定できる
