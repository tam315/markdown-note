# リーダブルコード

[[toc]]

## 理解しやすいコード

- コードは他の人が最短時間で理解できるように書く
- そのためには少しくらい冗長な記載になっても構わない

## 名前に情報を詰め込む

### 明確な単語を選ぶ

- get => fetch, download
- size => height, numNodes, memoryBytes
- stop => kill, pause(resume できるなら)

### カラフルな単語を選ぶ

類語辞典を使ってより明確な意味の単語を使う

find => search, extract, locate など

### 汎用的な名前を避ける

- tmp など
- ループでの i,j,k など

生存期間がごく短いなど、理由があって使うならいいけど、ただの怠慢で上記を使うのはダメ。

### 抽象的でなく具体的な名前を使う

特定のポートが使えるかチェックする関数なら
serverCanStart() => canListenOnPort()

### 名前に情報を追加する

```js
// フォーマットを追加する
const id = "af84ef845cd8";
const hexId = "af84ef845cd8";

// 単位を追加する
const size = 10;
const sizeMb = 10;

// 文脈を追加する（セキュリティ被害やバグが出そうな場合）
const url = "http://danger.com";
const untrustedUrl = "http://danger.com";
```

### 名前の長さ

- スコープが小さければ短い名前でもよい(m など)
- スコープが大きいなら長くて具体的な名前をつける
- 新入りが即座に理解できないような省略形は使わない
  - formatStr はオーケー
  - BEManeger はだめ
- 意味のない単語は削る
  - convertToString => toString
  - doServeLoop => serverLoop
