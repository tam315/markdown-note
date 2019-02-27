# JavaScript コードレシピ集

[[toc]]

## Bool, Number, String

### slice

最初と最後の位置を指定して文字列を切り出す。似たもので`substring()`もあるが使うな。

```js
'JavaScript'.slice(0); // => 'JavaScript'
'JavaScript'.slice(0, 4); // => 'Java'
'JavaScript'.slice(1, -1); // => 'avaScrip'
'JavaScript'.slice(-1); // => 't'
```

### substr

最初の文字位置と、そこから切り出す文字数を指定する。

```js
'JavaScript'.substr(4, 3); // => 'Scr'
```

### padStart, padEnd

文字列の頭や末尾を特定の文字で埋める。長さと埋める文字を指定する。

```js
'5'.padStart(4, 'a'); // 'aaa5'
'5'.padEnd(4, 'a'); // '5aaa'
```

### encodeURI, encodeURIComponent

URI で日本語等を扱うためにエンコードするときに使う。前者は`/`や`:`などの記号等をエスケープしない、後者はするという違いがある。

## 複数データ

### unshift, push

配列の先頭にデータを追加する（高コストな場合があるので注意）。配列の末尾にデータを追加する。

### shift, pop

配列の先頭のデータを削除する（高コストな場合があるので注意）。配列の末尾のデータを削除する。

### splice

配列の一部を置き換える。追加位置、取り除く数、追加する要素、、、、を指定する。

```js
a = [1, 2, 3, 4, 5];
a.splice(2, 2, 'a', 'b', 'c'); // => [3, 4] (取り出した要素が返る)
a; // [1, 2, "a", "b", "c", 5]
```

### localCompare

大文字、小文字を無視して文字列を比較する

```js
'B'.localeCompare('A'); // 1
'B'.localeCompare('a'); // 1
'B'.localeCompare('B'); // 0
'B'.localeCompare('b'); // 0
'B'.localeCompare('c'); // -1
'B'.localeCompare('C'); // -1

a = ['a', 'c', 'B'];
a.sort((prev, next) => prev.localeCompare(next));
a; // ["a", "B", "c"]
```

### [...arrayLikeObject]

- ArrayLikeObject とは、`length`属性を持ち、`[0]`などの添字を使ってインデックスでアクセスできる、配列っぽいけど配列じゃないオブジェクトのこと。
- 例えば**文字列**や、`document.querySelectorAll()`で取得したオブジェクトなど。
- 配列に変換することで`filter()`などを使えるようになるというメリットがある。

```js
arrayLike = 'abcde';
[...arrayLike]; //  ["a", "b", "c", "d", "e"]
```

### Object.keys|values|entries

オブジェクトのキー、値、キーと値のペアを、配列として受け取る。プロトタイプのキーは含まれないので安心。

### Object.freeze|isFrozen

オブジェクトや配列について、追加・削除・変更を不可能にする。又はそうなっているかどうか調べる。

他に、追加削除のみ禁じる`Object.seal()`、追加のみ禁止の`Object.preventExtensions()`等がある。

## データ

### ミュータブル、イミュータブル

- プリミティブ --- イミュータブル、変化しない（`1`が`2`にはならない）
- 配列、オブジェクト等 --- ミュータブル、変化する（`[]`が`[1,2]`になる）

## その他

- 日付や時間
- ブラウザやウィンドウの操作
- ユーザアクション、DOM イベント
- DOM 操作
- フォーム、フォームに関するイベント
- アニメーション
- 音声・動画
- SVG/Canvas
- Promise, setTimeout 等
- JSON, XML
- localStorage, Cookie
- スマホのセンサー
- デバッグ
  - `console.dir(someObject)`
  - `console.table(someObject)`
