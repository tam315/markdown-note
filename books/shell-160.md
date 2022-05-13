# シェル・ワンライナー 160 本ノック

Tags: Linux, Shell

## 1.2.a 端末を使う

- プロンプト - `$`マークのこと
- コマンド - `echo $0`のようなもの
- シェル - ソフトウェアのこと
  - プロンプトを出したり、コマンドを受け取ったりしている
  - bash はシェルの名前
- 端末 | terminal
  - 遠くにあるコンピュータと接続して作業するのに使う機械のこと
  - 元々は本当に機械だった
    - データをコンピュータに送信し、返ってきたデータを印字出力するなど
  - 今はエミュレータ

## 1.2.b コマンドの止め方

- `Ctrl + C` - 強制終了。非常によく使う。
- `Ctrl + D` - 端末にこれ以上ユーザが入力するものがないことを伝える。次点としておぼえておけば OK。

## 1.2.c 計算

```bash
echo '1+1' | bc
```

- `|` - パイプ。左の結果を右に渡す。
- 以下の通り、コマンド関連の用語はあいまいである
  - コマンド
    - 1 単語の場合はコマンドとして用いられるソフトウェアのこと
      - e.g. `bc`、`echo`
    - 2 単語以上の場合はシェルの受け付ける命令のこと
      - e.g. `echo $0`
  - ワンライナー - コマンドを 2 つ以上組み合わせたもの
  - パイプライン - パイプにコマンドがつながったもの
  - コマンドライン - 打ち込んだ 1 行分の命令

## 1.2.d ファイルへの保存

```bash
echo '1+1' | bc > result.txt
```

- `>`は、リダイレクト記号という

## 1.2.e ファイルとディレクトリの操作

```bash
echo あいうえお > somefile
mkdir tmp
mv somefile tmp/
# tmpフォルダの内容を一覧
ls -l tmp/
rm tmp/somefile
rmdir tmp/
```

## 1.2.f ファイルのパーミッション

```bash
chmod -r somefile
chmod +r somefile
```

- パーミッション
  - ファイルの所有者
  - ファイルの所有グループ
  - それ以外
- `sudo`を毎回するのが面倒なときは`sudo -s`

## 1.2.g コマンドの調査

man は章立てになっている。たいていは 1 章に求めるものが書いてある。

```bash
man some_command

# 5章を見る
man 5 some_command
```

該当行とその次の１行を出力する

```bash
man ls | grep -A 1 '^  *-a'
```

## 1.3.a sed による置き換え

一回だけ置き換える

```bash
echo あいうえおあいうえお | sed 's/あ/か/'
# かいうえおあいうえお
```

何回も置き換える(`g`)

```bash
echo あいうえおあいうえお | sed 's/あ/か/g'
# かいうえおかいうえお
```

検索対象の文字を使う(`&`)

```bash
echo クロロエチルエーテル | sed 's/エチル/&&/'
# クロロエチルエチルエーテル
```

後方参照(`\1`や`\2`など)

- `-E`は拡張正規表現を有効にするために必要
  - 基本正規表現だけ使えればいいなら不要
  - 無駄にエスケープ文字を入れなくて済むようになる
  - `-r`でも同じ意味

```bash
echo クロロエチルメチルエーテル | sed -E 's/(エチル)(メチル)/\2\1/g'

# 以下のようにもかける
echo クロロエチルメチルエーテル | sed -E 's/(エ..)(...)/\2\1/g'
```

## 1.3.b grep による検索

- `xargs` は出力を横に並べるためのコマンド
- 入力は 1 行ごとでも、スペース区切りでも OK

```bash
# 0を含むもの
seq 100 | grep "0" | xargs

# 8で始まるもの
seq 100 | grep "^8" | xargs

# 8で終わるもの
seq 100 | grep "8$" | xargs

# 80台
seq 100 | grep "8." | xargs

# 1, 10, 100, ...
seq 100 | grep "^10*$" | xargs

# 偶数
seq 100 | grep "[02468]$" | xargs

# 奇数
seq 100 | grep "[^02468]$" | xargs
```

## 1.3.c grep による検索＆切り出し

- `-o`オプション
  - マッチした部分のみが出力される
  - 複数行で出力される

```bash
# 山田と上田
echo 中村 山田 田代 上田 | grep -o '[^ ]田'
```

- メタ文字とは
  - `&`、`.`、`^`、`$`、`\n`などの特殊な意味を持つ文字

## 1.3.d awk による検索と計算

- grep にプログラム機能を加えたもの。奥が深いよ。
- `awk '/正規表現/'`が`grep '正規表現'` と同じ
- `$0`は行全体を表す
- `$1`は「行の１列目の文字列 or 数値」を表す
  - データの n 列目を「第 n フィールド」と呼ぶ
  - `$1`は第 1 フィールドを表す変数と言える
- `print`は自動的に間のスペースと行末の改行を入れてくれる。awk ではよく使う。
- 構成要素
  - パターン - 抽出条件のこと。正規表現 or 計算式。 (e.g. `$1%2==0`, `/[a..b]/`
  - アクション - 処理のこと。`{}`で囲まれている (e.g. `{print(...)}`
  - ルール - パターンとアクションの組み合わせのこと
- パターンだけ、アクションだけでも実行可能

```bash
# 正規表現で抜き出す
seq 5 | awk '/[24]/'

# 計算で抜き出す
seq 5 | awk '$1%2==2'

# マッチした行に処理を加える(以下の２つは等価）
seq 5 | awk '$1%2==0{printf("%s 偶数\n", $1)}'
seq 5 | awk '$1%2==0{print($1,"偶数")}'

# 2つ以上のルールを使う
seq 5 | awk '$1%2==0{print($1,"偶数")}$1%2==1{print($1,"奇数")}'

# 三項演算子を使う
seq 5 | awk '{print($1%2==0 ? "奇数" : "偶数")}'
```

- BEGIN パターンは最初の行の処理前に実行される
- END パターンは最終行の処理後に実行される
- 無名のパターンは全ての行で実行される

```bash
seq 5 | awk 'BEGIN{a=0}$1%2==0{print($1,"偶数")}$1%2==1{print($1,"奇数")}{a+=$1}END{print "合計",a}'
```

## 1.3.e sort, uniq による集計

- データの中に何がいくつあるのか数えるときは、「sort で並び替えて uniq で数える」のが鉄板
- なぜ sort が必要なのか？
  - uniq に与えられるデータはソートされていることが前提のため（一つのことだけやる。プログラムを簡素にする。UNIX 的な思想。）

```bash
seq 5 | awk '{print($1%2==0 ? "奇数" : "偶数")}' | sort | uniq -c
```

```sh
# 2列目から2列目を使って辞書順でソート(10 then 1)
sort -k2,2

# 2列目から2列目を使って数値順でソート(1 then 10)
sort -k2,2n
```

`for in`を使えば連想配列からキーを取り出せる。これを使って awk だけで集計することもできるが、見にくい。

```sh
seq 5 \
| awk '{print($1%2==0 ? "奇数" : "偶数")}' \
| awk '{acc[$1]++}END{for (key in acc)print(key, acc[key])}'
```

ちなみに`for`には以下の書き方もある。

```sh
awk 'BEGIN{for(i=0;i<5;i++)print(i)}'
```

## 1.3.f xargs による一括処理

xargs は次のときに使われる。

- 入力を横に並べて、出力する
  - デフォルトでは`echo`が指定されたものとみなされる
- 入力を横に並べて、コマンドに **引数(入力ではない)** として渡したうえ実行してもらう
  - 本来の使い方

```sh
seq 4 | xargs mkdir # => `mkdir 1 2 3 4`になる
seq 4 | xargs rmdir # => `rmdir 1 2 3 4`になる

# 2つずつコマンドに渡していく(`mv 1 2`と`mv 3 4`になる)
seq 4 | xargs -n2 mv

# 入力を改変してコマンドに渡す(@マークは別の文字に変えてもOK)
seq 4 | xargs -I@ mkdir dir_@

# 下記のように５つずつ表示するのにも使えるが、セキュリティには注意すること
seq 10 | xargs -n5
```

## 1.3.g bash によるメタプログラミング

```sh
seq 4 | awk '{print "mkdir " ($1%2==0 ? "even_" : "odd_") $1 }' | bash

# 以下の４つのフォルダが作られる
# mkdir odd_1
# mkdir even_2
# mkdir odd_3
# mkdir even_4
```

- シェルスクリプトとは
  - シェルにやってもらいたいことを順番に書いたファイル
  - `bash ./somefile`で実行できる
- シェルスクリプトをコマンドとして使うには
  - １行目に shebang(`#!/bin/bash`)を入れる
    - OS が shebang に書いたコマンドを呼び出し、そのコマンドが 2 行目以降を読み込むよう手配される
  - ファイルに`chmod +x`で実行権限を与える
  - これで`./somefile`で実行できるようになる

## Q1 ファイル名の検索

テキストファイルからの抽出の例：

```sh
# 王道
cat ./qdata/1/files.txt | grep '\.exe$'
cat ./qdata/1/files.txt | awk '/\.exe$/'

# - `-n`は各行を自動的に出力しない
# - `/正規表現/p`でマッチする行だけ出力する
cat ./qdata/1/files.txt | sed -n '/\.exe$/p'
```

## Q2 画像ファイルの一括変換

あるフォルダ内にある png ファイルを全て jpg 形式に変換する方法

```sh
# 私の回答
ls *.png \
| sed -E 's/(.*)\.png$/\1/g' \
| awk '{print "convert " $1".png " $1".jpg"}'
| bash

# 鮮やかな回答
ls *.png | sed 's/\.png//' | xargs -I@ convert @.png @.jpg
```

- ファイルの内容を調べる - `file some_image.jpg`
- 実行時間を計測する - `time ワンライナー`
- 並列実行する - `xargs -P4 コマンド`
- コマンド置き換え - `$(コマンド)`
  - コマンドの実行結果を引数として使うことができる

```sh
# 以上を踏まえた発展型(時間計測と、並列実行による高速化)
time ls *.png | sed 's/\.png//' | xargs -P$(nproc) -I@ convert @.png @.jpg
```

## Q3 ファイル名の一括変更

`1`から`10000`までのファイルがあるとして、0 埋めにファイル名を変更せよ

```sh
seq 1000 | xargs -P2 touch

ls | awk '{printf("%d %04d ",$1,$1)}' | xargs -n2 mv
```

## Q4 特定の内容のファイルを探す

```sh
grep -l -R SOME_PATTERN | xargs rm
```

- `ls -U` - ファイル名等で並べ替えない。結果が大量にある場合は速度的に有利。
- `grep -l` - 一致した部分ではなくファイル名を表示する
- `grep -R` - ディレクトリ内のファイルを再帰的に読み込む
- `grep some_pattern ./*` - ディレクトリ内のファイル内容を検索

## Q5 設定ファイルからの情報抽出

- awk はパターンだけ、アクションだけでも実行可能

```sh
# 私の回答
cat ntp.conf | awk '/^pool/{print $2}'

# 模範解答
cat qdata/5/ntp.conf | awk '$1=="pool"' | awk '{print $2}'
```

## Q6 端末に模様を書く

- awk の一つのパターン内で２つのコマンドを実行したいときは`;`で区切る。
- seq に第二引数を与えると降順で値を出力することもできる(from,to の意)

```sh
# 回答例１
seq 5 | awk '{for(i=1;i<$1;i++)printf(" ");print "x"}' | sort

# 回答例２
seq 4 0 | awk '{for(i=$1;i>0;i--)printf(" ");printf("x\n")}'
```

## Q7 消費税

```txt
20190901 ゼロカップ大関 10000
20190902 *キャベツ二郎 130
20191105 外食 13000
20191106 ストロングワン 13000
20191106 *ねるねるねるねる 30
20190912 外食 13000
```

```sh
cat qdata/7/kakeibo.txt | \
awk '{tax=($1<"20191001"||$2~/^あ/)?1.08:1.1;print $0,tax}' | \
awk '{print int($3*$4)}' |
awk '{sum+=$1}END{print sum}'
```

- awk
  - 列の値の大小を調べる
    - 1 列目が 20191001 より小さいか
    - `$1<"20191001"`
  - 列の値が Regex に適合するか調べる
    - ２列目が`あ`で始まるか
    - `$2~/^あ/`
  - or は`||`

## Q8 ログの集計

```txt
183.YY.129.XX - - [07/Nov/2017:22:37:38 +0900]
192.Y.220.XXX - - [08/Nov/2017:02:17:16 +0900]
66.YYY.79.XXX - - [07/Nov/2017:14:42:48 +0900]
::1 - - [07/Nov/2017:13:37:54 +0900]
133.YY.23.XX - - [07/Nov/2017:09:41:48 +0900]
```

```sh
cat qdata/8/access.log | \
awk -F: '{print $(NF-2)}' | \
awk '{print ($1<12?"午前":"午後")}' | \
sort | \
uniq -c

# awkのところの別解。こっちが直感的かも。
grep -o "....:.." | sed s/....://
```

- awk
  - `$変数`や`$計算式`も使える
  - `NF`は Number of field で、`$NF`は最終列を表す
  - `-F`オプションは、区切り文字を変更するときに使う。デフォルトはスペース。