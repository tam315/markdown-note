# Code Complete

[[toc]]

## 変数の使用

### 変数宣言・初期化のベストプラクティス

- 暗黙の宣言は無効にし、すべての変数を明示的に宣言する
- 宣言は使用場所の近くで行う
- 宣言時に初期化も行い、難しい場合はなるべく使用場所の近くで行う
- できるだけ final / const を使う
- カウンタ等、再初期化の必要がないか確認する

### スコープ

- スコープ = 変数の知名度
- 持続間隔 = 変数を利用する箇所の間隔
- 寿命 = 変数を宣言した場所から、最後に利用した場所までの距離

スコープを最小限にすることで下記の効果がある

- 一度に覚える必要のある情報が減り、読みやすくなる
- エラーが入りこむ余地が減る
- リファクタリングしやすくなる

#### スコープを小さくする方法

- 関連するステートメントをまとめる、あるいは別ルーチンに切り出す

```js
// Bad
show(OldData);
show(newData);
delete oldData;
delete newData;

// Good
show(OldData);
delete oldData;

show(newData);
delete newData;
```

- はじめは最も狭いスコープ（private など）にしておく

### 永続性

変数の永続性（賞味期限）を勘違いすると事故が起こる。対策は次の通り。

- 重要な変数に正しい値がセットされているか定期的に確認して、不正なら警告を出す
- 使い終えた変数に意味のない値を設定しておく
- データが永続的でないことを前提にコードを書く（変数はすべて使用直前に宣言する、そうでない変数には警戒する、など）

### バインディングタイム

変数に値を設定する時期のこと。数字が大きいほど柔軟性が高いが、複雑でエラーが起こりやすくなる相反関係にあるため、適当なところで折り合いをつける。

1. ハードコーディング
1. 定数でコーディング(ハードコーディングよりは常にマシ)
1. プログラムのロード時に環境変数などから読み込む
1. インスタンス生成時（ウィンドウ作成時など）
1. ジャストインタイム（ウィンドウ移動時など）

### 1 つの目的に 1 つの変数

- 変数を再利用しない
  - 例えば`temp`を同じスコープで、違う目的で回使わないこと。そうなった場合は、より具体的な 2 つの名前につけ直すこと。
- 変数に 2 つの意味や隠れた意味を持たせない（ハイブリッド結合しない）
  - 例えば、通常は人口（Integer）を表すが、-1 の場合はエラー(Boolean)を示す変数など。

## 変数名の力

変数名以外にも、クラス、パッケージ、ファイルなどにも適用可能。

### 良い名前にするための Tips

#### 名前はなるべく具体的にする

なにを表す変数なのか考える必要がない程度の具体的な名前にする。

- Good
  - runningTotal
  - trainVelocity
  - currentDate
  - linesPerPage
- Bad
  - ct
  - velt
  - x
  - lpp
  - lines
  - date

#### 問題を表す名前にする

- Good
  - employeeData
  - printerReady
- Bad
  - inputRecord
  - bitFlag

#### 最適な長さにする

8 文字～ 20 文字くらいが最もデバッグしやすいという研究がある

- 長すぎ => `numberOfPeopleOnTheUsOlympicTeam`
- 短すぎ => `n`
- ちょうどいい => `numTeamMembers`

#### 合計・平均・最大などを表す名前は変数名の最後につける

`Total`, `Sum`, `Average`, `Max`, `Min`, `Record`, `String`, `Pointer`など、計算した値を保持する変数には、その修飾子を最後につける。

例）

- revenueTotal
- expenceAverage
- expenceMax

ただし、`num`は例外なので要注意

- `numCustomers` => 顧客総数（'s'に注目）
- `customerNum` => 顧客番号

可能であれば`num`は使わずに下記のようにしたほうが良い。

- `customerTotal` => 顧客総数
- `customerIndex` => 顧客番号

#### わかりやすい反意語を使う

- begin / end
- first / last
- locked / unlocked
- min / max
- next / previous
- old / new
- opened / closed
- visible / invisible
- source / target
- source / destination
- up / down

### 特殊なデータの命名

#### ループ変数

ごく単純で、ネストされず、ループが 3 行以内で、ループの内部でのみ使用されるインデックスには、`i`,`j`,`k`といった名前を使っても良い。それ以外の場合は、通常と同じく、より具体的な名前をつける。

#### 状態変数

いわゆる「フラグ」のこと。意味のある名前をつける。必要に応じて定数も使う。

```txt
# BAD

flag = 0x1;
statusFlag = 0x80;
pringFlag = 16;

# GOOD

dataReady = true;
reportType = REPORT_TYPE_ANNUAL;
recalcNeeded = false;
```

#### 一時変数

`temp`や`x`などのこと。そもそも全ての変数は一時的なものである。`temp`という名前をつけたくなったときは、プログラマが問題を理解できていない可能性もある。より具体的な名前がつけられないか、よく検討すること。

#### ブール変数

- 有名どころを使う
  - done
  - error
  - found
  - success / ok
- true or false になる名前をつける
  - status => statusOK
  - sourceFile => sourceFileAvailable / sourceFileFound
- 頭に`is`をつけると正しい名前を矯正されるが、やや読みにくい
- 肯定的な名前を使う
  - notFound => found
  - notDone => done
  - notSuccessful => successful

#### 列挙型

`Color_Red`, `Color_Blue`のように、カテゴリを表すプレフィックスを付ける

### 命名規則の力

#### 命名規則を作る理由

どのような規約でも無いよりはまし

- 考えなくて済む
- 覚えたルールを他で活かせる
- 早く理解できる
- 名前の増殖を防ぐ
- プログラミング言語の弱点を補う

#### いつ命名規則が必要か

- 複数のプログラマがいる
- 誰かに引き継ぐことがある
- プロジェクトが大きい
- プロジェクトが長い　などの場合

#### どれくらい正式にするか

短小プロジェクトではゆるく、長大プロジェクトではきつく

### 短くて読みやすい名前

無理に省略するのは昔のなごりである。それでも省略したいなら、ガイドラインをまとめてプロジェクト内に周知しておくこと。

#### ガイドライン

変数が 8 文字～ 20 文字程度になるまで下記の作業を繰り返す

- 標準的な略記を使う
- 母音を削除する
  - computer => cmpter
  - screen => scrn
- and, or, the などを削除する
- '-ing', '-ed'などを削除する
- 名前の中で重要な単語を最大で 3 つ使用する
- 省略するなら 2 文字以上省略する
- 変数の意味を変えないように注意する

#### 省略するときの注意

- 省略法は一貫する
- 発音できる名前にする(xPos -> good, xPstn -> bad)
- 読み間違えなどを招く名前を避ける(bEnd -> good, bend -> bad)
- 書き手よりも読み手を大事にする。読み手に優しくない省略法は使うな。

### ダメな名前

- 意味が似た名前をいくつも使うな
  - `input` / `inputValue`
  - `recordNum` / `numRecord`
- 見分けにくい名前を使うな
  - bad => `clientRecs`/ `clientReps`
  - good => `clientRecords` / `clientReports`
- 名前に数字を使うな
- 綴りを勝手に変えない
  - bad => `hilite`
  - good => `highlight`
- 綴りを間違えやすい単語を使わない
  - `absence`
  - `accumulate`
  - `receipt`
