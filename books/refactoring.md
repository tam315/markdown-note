# リファクタリング

[[toc]]

## リファクタリング 最初の例

### 着手前のコメント

- コンパイラと異なり、人間はコードの綺麗さを「気にする」
- コンパイラがわかるコードは誰にでも書ける。優れたプログラマは人間にとってわかりやすいコードを書く
- いつリファクタするか
  - コードの動作を理解して、流れを追わないといけない状況になった時には、リファクタが必要
  - コードが正常に動作していて、今後も変更をする予定が全くないときは、リファクタは不要

### Step1. テストの作成

- リファクタリングの第一歩は、まずテスト群を作り上げること。これは必須。
- そうすれば、コードとテストの両方で失敗をしない限り、間違いはなくなる

### Step2. 名前づけと構造化

- コードを関数に抽出していこう
  - 意味のあるコードの塊を関数にして、何をしているかを端的に示す名前をつけていく
    - 間違った名前をつけると価値がなくなるので注意
  - これは、理解したことをコードに埋め込んでいく作業である
- リファクタとパフォーマンスの捉え方
  - パフォーマンスの問題はほぼ発生しない
  - まずガンガンリファクタを進め、必要ならその後にパフォーマンス改善をやる。
- 作業対象が複雑な場合は、なるべく小さなステップを刻んで作業していくこと
- 一次変数を可能な限り排除しよう
  - 動機
    - 関数に抽出していく作業が楽になるから
      - 一次変数を使うと、その宣言場所と使用場所が「バインド」されてしまう（スコープを気にしなくてはいけない）
      - 一方、（問い合わせ）関数であればどこからでも呼べる
    - ルーチン内でしか使えないことにより、長く複雑なルーチンができがちだから
  - 手順
    - 問い合わせによる一時変数の置き換え p185
    - 変数のインライン化 p129
    - 関数宣言の変更 p130
- 複雑なループ処理をリファクタしよう
  - ループの分離 p236
  - ステートメントのスライド p231
  - 関数の抽出 p112
  - 変数のインライン化
- その他 tips
  - 関数の戻り値を表す変数名は`result`にする
  - 型の名前を変数名に入れる(`Performance`型なら`performance`）
  - 不定冠詞(「不特定の 1 つ」を表す冠詞、`a`や`an`など)をつける
  - 変数名、関数名などをより良いものに積極的・継続的に修正する

Step3. 機能の変更

- フェーズの分離をしよう
  - 一つのコードで異なる二つの処理を行なっている(or 行いたい)場合に、コードを段階ごとに分ける手法
    - 前段で整形や計算などの必要な処理を行なう
    - 後段に対して必要最小限の情報を受け渡す
  - 段階によって使用するデータや関数が決まっている場合に有効
    - e.g. コンパイラ
  - React でいうと下記のイメージに近いかも
    - 親コンポーネントで計算処理などを行う
    - 共通の props を受け取れる複数の子コンポーネントを用意する
    - 子コンポーネントを出し分けて見た目を切り替える
- 方法
  - フェーズの分離 p160
  - 関数の抽出
  - 引数を中間オブジェクトに集約
  - 関数の移動 p206
- リファクタと機能追加のバランス
  - 全てはバランス。リファクタのやりすぎも、やらなさすぎも、どちらもダメ。
  - ただし、最低でも「来た時よりも美しく」は守れ

### Step4. 機能の追加

- 方法
  - 「ポリモーフィズムによる条件記述の置き換え」の記載がある
  - しかし、これは今の時代には古いやり方な気がするし、単純に見づらい
  - 個人的には、以下のような関数型のアプローチ（ファクトリパターン）の方が好き
  - [Qiita 参考記事](https://qiita.com/msakuta/items/e723bbb889c9bba464b3#%E5%AE%9F%E9%9A%9B%E5%BD%B9%E3%81%AB%E7%AB%8B%E3%81%A4%E5%A0%B4%E9%9D%A2)

```ts
const performanceCalculatorFactory =
  ({ contextData, calcAmount, calcVolumeDiscount }) =>
  () => ({
    getAmount: () => {
      const defaultAmount = contextData.price * 100;
      if (calcAmount) {
        return calcAmount(defaultAmount);
      }
      return defaultAmount;
    },
    getVolumeDiscount: () => {
      const defaultVolumeDiscount = contextData.price * 200;
      if (calcAmount) {
        return calcVolumeDiscount(defaultVolumeDiscount);
      }
      return defaultVolumeDiscount;
    },
  });

const createCalculatorFor = (type, contextData) => {
  switch (type) {
    case 'tragedy': {
      return performanceCalculatorFactory({
        contextData,
        calcAmount: (defaultAmount) => defaultAmount * 1.1,
        // ここでは`calcVolumeDiscount`は上書きしていない
      });
    }
    case 'comedy': {
      return performanceCalculatorFactory({
        contextData,
        calcVolumeDiscount: (defaultAmount) => defaultAmount * 0.9,
        // ここでは`calcAmount`は上書きしていない
      });
    }
    default: {
      throw new Error();
    }
  }
};

const main = () => {
  const contextData = { price: 100 };
  const calculator = createCalculatorFor('tragedy', contextData); // or 'comedy'
  console.log(calculator.getAmount());
  console.log(calculator.getVolumeDiscount());
};
```

### まとめ

- リファクタの良いループ
  - まずは、何が行われているかを理解できるようにする
  - 綺麗になるについてより踏み込んだ洞察が可能になり、さらに前向きな改善ループが続いていく
- 良いコードかどうかは、**変更がどれだけ容易なのか**で決まる
