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

### Step3. 機能の変更

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

## リファクタリングの原則

### リファクタリングの定義

- ソフトウェアの内部構造を変化させること
- ソフトウェアの理解や修正を容易にするために行う
- 外部から見たときの振る舞いは保つ
- いつでも中断が可能である
- 小さなステップで行う

### 二つの帽子

ある時点では、どちらか一方だけをやること。交互に帽子をかけかえながら作業する。

- 機能追加するとき
  - 新機能に関するテストの追加と、その実装のみを行う
  - 既存コードの再構築をしてはならない
- リファクタリングするとき
  - 既存コードの再構築のみを行う
  - 新機能や、新機能のためのテストを追加してはいけない

### リファクタリングを行う理由

#### 良い設計(アーキテクチャ)を保つため

- アーキテクチャが急速に劣化する負のループ
  - 1. 全体的な理解をせずに変更を行う
  - 2. コードが構造を失う (e.g. 無意味な重複コードが発生するなど)
  - 3. コードを読んで設計を把握するのが困難になる
  - 4. 1 に戻る

#### コードを理解しやすくするため

- コードは書く時間より読まれる時間の方が圧倒的に多い、という視点が重要
- わかりやすいコードを書けば：
  - 後から来た人は容易に短時間で修正ができる
  - 何を書いたか忘れてしまってよくなる。だって読めばすぐわかるから。

#### バグを見つけやすくする

構造が明確ならバグも無理なく発見できる

#### プログラミングを速める

- デザインスタミナ仮説
  - 設計(≒ リファクタ)を入念に行えば、より長い期間、より早いペースで開発できる
  - リファクタせずに場当たり的な対応を重ねると、あっという間に走れなくなる

### いつリファクタリングをすべきか

#### 準備のためのリファクタリング

- 機能を追加したり、バグを修正したりする前に行うリファクタリング
- 森の中を真っ直ぐノロノロ歩いて目的地に突き進むよりも、森を迂回する高速道路を使って目的地行ったほうが、早いだろ

#### 理解のためのリファクタリング

- コード理解を妨げるものを取り除くリファクタリング
  - 不適切な名前
  - 長すぎる関数
- 理解したことをコードに移していく作業と言える。これにより：
  - 意図を長期間保存できる
  - 仲間に伝えられる
  - 設計上の悪い点が見えてくる
- 汚れた窓をまずはきれいにするようなもの。
  - この作業を、単に過去のコードをいじくっているだけと軽視する人は、混沌に埋もれた事実を永遠に見つけられない

#### ゴミ拾いのためのリファクタリング

- 何をしているかは分かるものの、書き方が明らかにクソなコード
- 「来た時よりも美しく」が大事。いつかは綺麗になるよ。
- いま修正している時間がない場合は、せめてメモやコメントを残しておこう

#### 計画してやるか、常にやるか

- リファクタリングは常に行うもの
  - プログラミングと不可分
  - if 文を書くための専用の時間を取らないのと同じ
- リファクタは全てのコードに必要
  - 酷いコードにも必要
  - 素晴らしいコードにも必要(<-ここ重要)
- ソフトウェア開発は：
  - 累積のプロセス**ではない**
  - 常に変容が求められるもの
  - 「完成」が存在しないもの

#### 長期のリファクタリング

- 1 週間以上かかるリファクタであっても、チームをリファクタリングに完全に専念させることはおすすめしない
- 例えば 1 ヶ月くらいかけてチーム全体で徐々に変えていく合意をとった方が良い
- これは、リファクタリングがコードを壊さないという利点を活かしている

#### コードレビュー時のリファクタリング

- ペアプログラミング時にやるのがよい
- Pull Request 形式のレビューではうまくいかない

#### 管理者を説得するには

- 理解のない管理者の場合、おすすめは「彼らには黙ってやる」
- あなたがプロとしてベストと思うやり方を選択すればいい
- 管理者も最も速く済む方法を望んでいるんだから、いいでしょ

#### リファクタリングを避けるとき

- 単なる API とみなせて、かつ今後の修正の必要がないとき
- ゼロから書き直したほうが早いとき

### リファクタリングの問題点

#### 新機能の実装が遅くなる？

- 実装は遅くならない
  - なぜならリファクタの目的はプログラミングの速度を上げることだから
  - ただしトレードレードオフはあるので、このあたりの判断は経験がモノを言う。
- リファクタする場合の例
  - 以後の作業が楽になるとき
  - 何度も同じ問題が起きているとき
  - 同じような醜いコードに何度も出くわしているとき
- リファクタしない場合の例
  - 新機能が非常に些細なもので、リファクタを後回しにできるとき
  - めったに触らない箇所であるとき
  - 道徳的な理由でリファクタしてはならない
    - 「コードが美しくなる」だの
    - 「(しばしば原理主義的な)すばらしいプラクティスにコードを近づける」だの
    - 経済的な基準でのみ判断せよ

#### コードの所有権

- コードの部分ごとにオーナーを設定し、変更を承認するようなやり方が良いのでは
- これは以下の 2 つのあいだを取ったもの
  - 所有権が強すぎて、リファクタが困難な状態
    - e.g. 関数名を変えたときに、呼び出し元のコードを変更できない、など。こういったときは古い関数から新しい関数を呼び出すようにして、古い関数には deprecated を指定するなどするものの、最悪の場合、古い関数は永遠に残り続けることになる。
  - 所有権がなくて、誰もが好き勝手に変更を加えてカオスになる状態

#### ブランチ

- Feature branch 方式はリファクタリングと相性がとても悪い
  - ブランチの生存期間とマージの困難さは指数関数的に相関する
  - マージが難しくなることを理由にリファクタを諦める場合もあるくらい
  - バージョン管理システムは意味的な変更にすこぶる弱い
    - 意味的な変更 ≒ リファクタリング。例えば関数名の変更など
- Trunk-based なブランチ戦略がおすすめ
  - 1 日 1 回はメインブランチに統合する方法
  - ただし、大きな機能を小さな機能に分割したり、分割できない大きな機能を無効化する Feature flags の仕組みを作ったりするなどの準備が必要
  - Feature branch 方式と併用も可能。何れにせよなるべく頻繁にメインブランチにマージする。

#### テスト

- テストは必須。テストがあれば：
  - リファクタが容易になる
    - 間違いにすぐ気づくので、見るべきコードの範囲が狭まるから
  - 新機能追加がやりやすくなる
    - 新たに埋め込んでしまったバグにすぐ気づくから
- テストがない or 少ない場合は、IDE に安全が保証されている自動実行できる種類のリファクタであれば、実施できるかも
  - ただし注意深く手順に従う必要があるし、言語仕様にも依存するので比較的高度なやり方

#### レガシーコード

- レガシーコード = テストのないコード、テストの追加も困難なコード
- 「レガシーコード改善ガイド」を読めとのこと

#### データベース

- 個々の変更は小さく、かつ完結したものにする
- 正式リリースに至るまでに複数のリリースに分割する
  - 例えばフィールド名の変更であれば：
    - 1. 新規フィールドの追加（まだ使わない）
    - 2. 新旧両方のフィールドに書き込みを行うようコードを変更
    - 3. 古いフィールドを削除（使われていないことを確認した上で）

### リファクタリング、アーキテクチャ、Yagni

- リファクタリングという武器を手にすると:
  - 現時点で判明している最低限の要件を満たすだけの、最もシンプルなコードを書きさえすればよい
  - 将来のために変に柔軟性を持たせたりしなくてすむ
    - e.g. 関数に無駄にたくさん引数持たせるなど
    - Yagni = You ain't going to need it = どうせ使わねえよ
    - リファクタリングできるんだから、必要になった段階で変更すれば足りる

### リファクタリングとソフトウェア開発プロセス

- 3 つのコアプラクティス(上から順にやるとよさそう)
  - 自己テストコード
    - CI とリファクタリングの前提条件
  - CI
    - リファクタリングの前提条件
    - ソフトウェアがいつでもリリース可能な状態であること
  - リファクタリング
- コアプラクティスがもたらすもの
  - リリースを素早くできる
  - リリースのリスクを減らせる
  - リリースの技術的制約が減る
  - アイディアを最速で顧客に届けられる
  - ソフトウェアの信頼性を高める
  - 修正に時間のかかるバグを減らせる
  - Yagni を実践できる
- アジャイル開発の必要条件
  - コアプラクティスが全て実践されていること
  - メンバーが：
    - リファクタリングの技能を持つこと
    - リファクタリングに熱心に取り組む人たちであること
    - リファクタリングを通常の作業に含めることに当然のように合意できること

### リファクタリングとパフォーマンス

パフォーマンス最適化には 3 つの方法がある

- 実行スケジューリングする方法
  - 実行時間やメモリ使用量の制約を与えたうえで開発する
  - ハードリアルタイムシステム向き
- パフォーマンスを**常に**気にしながら開発する方法
  - この方法はあまりうまくいかない。なぜなら：
    - パフォーマンス問題はごく一部のコードが引き起こすので、均等に努力しても大半は無駄に終わる
    - パフォーマンス最適化のためのコードが至るところに散らばる
    - コードがわかりにくくなる
- きれいに作って**後で**チューニングする方法
  - まずはプログラムをきれいにつくる
    - この際パフォーマンスは気にしない
  - チューニングの段階まできたら以下を行う
    - プロファイラによる計測をする
    - 最も悪影響を及ぼしている箇所から順に最適化していく
    - この際、なるべく小さくステップを積み重ねること（コンパイル->テスト->計測）
  - 短期的にはパフォーマンス悪化があるかもしれないが、チューニング段階からは加速し、最終的には最短で目的を達成できる方法である

## コードの不吉な匂い

- リファクタを「いつ」始めるべきか？
  - 美意識といった曖昧な感覚ではなく匂いで判定しろ。以下、匂いのリスト。

### 不可思議な名前

- 名前付けの対象
  - 関数名
  - 変数名
  - フィールド名
- 適切な名前付けは：
  - 明快なコードにするために最も重要
  - 難しい
  - リファクタリングに置いて最も多く行われる作業
- 適切な名前付けがでできれば：
  - コードがずっとシンプルになる
  - 将来の時間を大きく節約できる
- 適切な名前付けができないときは問題を理解できていない兆候

### 重複したコード

- 似ているけど違う部分はないかという間違い探しを毎回やる羽目になる
- `関数の抽出 p112`
  - 複数メソッドに同じ式がある時
- `ステートメントのスライド p231`
  - 似ているけど完全に同一ではないときに、似た箇所を寄せておく。せめて。
- `メソッドの引き上げ p358`
  - サブクラスに重複したコードがある時

### 長い関数

- 小さな関数の寿命は最も長い。なぜなら以下が高いから。
  - 自己記述性
  - 共有性
  - 選択可能性
- 関数の分割をすると読むときのオーバーヘッドが増えないか？
  - 関数名をわかりやすくすれば増えない
    - そうすれば中身を読まずに読み進められる
    - コードが何をするのかという「意図」を表す名前をつける
    - コードが長くなっても意図が明確になれば良し
- やること
  - `関数の抽出 p112` (コレが 99%)
    - 重複コード、まとめられるコード、コメントがあるコード（≒ わかりにくいコード）を抽出する
      - わかりやすい名前をつけていくこと
      - 例えコードが 1 行でも必要なら抽出を躊躇しないこと
    - 巨大な switch 文の分岐後の処理を抽出する
    - ループ部分とループ内部を抽出する
      - 抽出した関数にうまく名前がつけられないときは`ループの分離 p236`が必要かも
  - `問い合わせによる一時変数の置き換え p185`
    - 一時関数が多すぎる場合
  - 引数が多すぎる場合は、後述の「長いパラメータリスト」を参照
  - `コマンドによる関数の置き換え p345`
    - 前述の全てをやっても、それでも一時変数やパラメータが残る場合
  - `条件記述の分解 p268`
    - 条件分岐やループの記述が複雑なとき
  - `ポリモーフィズムによる条件記述の置き換え p279`
    - 同じような構造の swtch 文が複数あるとき
  - `ループの分離 p236`
    - ループ内で異なる別のことをやっている場合

### 長いパラメータリスト

- `問い合わせによるパラメータの置き換え p332`
- `オブジェクトそのものの受け渡し p327`
- `パラメータオブジェクトの導入 p146`
- `フラグパラメータの削除 p322`
  - フラグパラメータは悪
- `関数群のクラスへの集約 p150`
  - これは関数型プログラミングでいうと部分適用された一連の関数群の作成にあたる
  - カリー化、部分適用については[こちら](https://qiita.com/nouka/items/d9f29db7b6a69baa650a)がわかりやすい

### グローバルなデータ

- どこからでも変更できる、どこで変更したか知るすべもないデータ
- `変数のカプセル化 p138`により、どこで参照・変更されているのか把握した上で、範囲を狭めていく

### 変更可能なデータ

- `変数のカプセル化 p138`
  - 監視して改良する
- `変数の分離 p248`
  - 変数に複数の意味が持たされているとき
- `ステートメントのスライド p231`と`関数の抽出 p112`
  - 副作用のある処理（データの変更）のコードと、それ以外のコードに分けておく
- `問い合わせと更新の分離 p314`
  - 本当に必要なときだけ副作用のある処理（データの変更）を行うようにする。API での話。
- `setterの削除 p339`
  - 変数のスコープを特定したうえで狭める
- `問い合わせによる導出変数の置き換え p256`
  - いつでも計算で導出できるのに変更可能なデータをなくす
- `関数群のクラスへの集約 p150`や`関数群の変換への集約 p155`
  - 変数の値を変更しなければならない箇所を減らす
- `参照から値への変更 p260`
  - 部分的に内部の値を修正せずに、まるっと入れ替える