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
