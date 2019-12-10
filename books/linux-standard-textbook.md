# Linux 標準教科書

[[toc]]

## Linux とは

- UNIX --- AT&T, Ken Tompthon, System-V, BSD
- Linux --- UNIX と似て非なる GPL の OS
- カーネル --- OS の中核。ハードとソフトの橋渡しをする。
- ユーザランド --- OS のカーネル以外の部分。コマンドはここで動作する。
- シェル --- 対話型コマンド入力環境。コマンドの受付、シェルスクリプトの実行が 2 つの大きな役割。

## 基本的なコマンド

### `ls`

- `-t` 最終更新時間で並べ替え
- `-r` 逆順
- `ls *.conf` ワイルドカード
- `ls ???.conf` 文字数指定のワイルドカード

### `cp`

- `-i` interactive
- `-r` recursive フォルダも
- `-p` 所有者、属性、更新日時などを消さずに保持する

### `mv`

- `-i`
- `-f` force 強制的に

### `rm`

- `-i`
- `-f`
- `-r`

### `pwd`

### `mkdir`

- `-p` 上位フォルダもあわせて作成

### `cat`

- `-n` 行番号を指定

### `less`

- `スペース` 進む
- `b` 戻る
- `/` 検索
- `q` 終了

### `find`

`find PATH -name FILENAME`

### `man`

コマンドのみならず、システムファイルやカーネルなど様々なもののマニュアルを表示できる

- `man passwd`
- `man 5 passwd` ジャンルを指定して検索

## 正規表現とパイプ

### 標準入出力

- 標準入力 - デフォルトでキーボード
- 標準出力 - デフォルトでディスプレイ
- 標準エラー出力 - デフォルトでディスプレイ

### リダイレクト

標準入出力の向き先を変えること。

- `1>`は標準出力をリダイレクト(`1`は省略可)
- `2>`は標準エラー出力をリダイレクト
- `&>`は標準出力及び標準エラー出力をリダイレクト
- `>&1`は標準出力「への」リダイレクト（`&1`は省略可）
- `>&2`は標準エラー出力「への」リダイレクト

```sh
# 入力
command < file   # ファイルの内容をコマンドの標準入力に渡す

#-----------------------------------------------------------
# 出力
command >&2      # 標準出力を標準エラー出力にリダイレクト

command > file   # 標準出力をリダイレクト
command >> file  # 標準出力をリダイレクト（追記）
command 2> file  # 標準エラー出力をリダイレクト

command &> file      # 標準出力/エラー出力を同一ファイルにリダイレクト
command &>> file     # 標準出力/エラー出力を同一ファイルにリダイレクト（追記）

command > file 2>&1  # 同上
command >> file 2>&1 # 同上

command > file1 2> file2   # 標準出力,エラー出力を別々のファイルにリダイレクト
command >> file1 2>> file2 # 標準出力,エラー出力を別々のファイルに追加書き込み
```

### grep

- ファイルの中からデータを探す。`grep ".*\.png$" FILENAME`
- 標準入力からのデータを検索対象にすることもできる。
- regex が使える
- `-e` or 検索をしたいときに使う `grep -e ".*\.png$" -e "my.*\.jpg$" FILENAME`
- `-i` 大文字小文字の違いを無視する
- `-v` マッチしない行を選択する

## 基本的なコマンド 2

### touch

- 最終更新日時を変更する
- ファイルが存在しない場合は新規に作成する（こちらの目的で使われることが多い）

### head, tail

- `-n` 先頭|末尾から n 行分を表示
- `-c` 先頭|末尾から c バイト分を表示

`tail`には特別なオブション`-f`がある。これを使うとそのファイルをウォッチ（読み込み続けること）できる。ログを読む際などに使う。

### sort

テキストファイルの中身をソートする。

- `-r` 逆順でソートする
- `-k n` n 列目のデータを使ってソートする（列はスペース区切りで判定される）
- `-n` 数値として認識してソートする

### uniq

`uniq FILENAME`
前の行と重複している行を出力しない

### tr

標準入力からの文字列を置き換える(translate する)

`cat SOMEFILE | tr 文字列1 文字列2`

例えば

```txt
Android
iPhone
Windows Phone
```

を`tr on ON`すると

```txt
ANdrOid
iPhONe
WiNdOws PhONe
```

になる

#### diff

差分を出力する。2 つのファイルを比べたり、パッチを作ったりする時に使う。

- `-c` context diff 形式で出力
- `-u` unified diff 形式で出力（git と一緒）

## vi エディタ

## コマンド

- `:q` 終了
- `:w` 保存
- `:wq` 保存して終了
- `:q!` 保存せずに終了

### 移動

- `w|b` ワード送り
- `0` 行頭
- `$` 行末
- `Ctrl-D|U` 半ページ送り
- `Ctrl-F|B` ページ送り
- `gg` 文書頭
- `G` 文書末
- `H|M|L` ページの上部・中部・下部へカーソルを移動
- `:123` 指定行へ移動

### 編集

- `dd|yy` カット、コピー
- `5dd|5yy` 複数行カット・コピー
- `p|P` 現在の行の後ろ or 前にペースト
- `u` カット、ペーストを取り消し

### 検索

- `/文字列` 検索
- `n|N` 前後の検索結果に移動

### 置換

s は sed の s

- `:123s/old/new` 123 行目の最初の old を new に置き換え
- `:123s/old/new/g` 123 行目の全ての old を new に置き換え
- `:%s/old/new` ファイル全体の最初 old を new に置き換え
- `:%s/old/new/g` ファイル全体の全ての old を new に置き換え
- `:%s/old/new/gc` ファイル全体の全ての old を new に置き換え(確認つき)

## 管理者の仕事

### グループとユーザ

- `/etc/passwd` ユーザの定義を記述するファイル
- `/etc/group` グループの定義を記述するファイル
- `/etc/shadow` パスワードを記録するファイル

これらのファイルの中身の読み方は本書のセクション 7 を参照すること。

#### `useradd`

ユーザを作成する

- `-c` コメントを加える
- `-g` プライマリグループを指定
- `-G` 補助グループを指定
- `-d` ホームディレクトリを指定
- `-s` シェルを指定　ログインしないユーザには`nologin`を指定する
- `-u` ユーザ ID を指定

#### `usermod`

ユーザを変更する。`useradd`のオプションは全て使える。

- `-l` ユーザ名を変更する

#### `userdel`

ユーザを削除する

- `-r` ホームディレクトリを削除

#### `groupadd`

グループを追加

- `-g` グループ ID を指定する

#### `groupmod`

グループを編集

- `-n` グループ名を変更
- `-g` グループ ID を変更

#### `groupdel`

グループを削除

### パスワード

昔は`/etc/passwd`に記録、今は`/etc/shadow`に記録される。
`passwd ユーザ名`で設定する。
パスワードがセットされていないユーザはログインできない。

### `su`コマンド

一時的に他のユーザになる。ユーザを指定しなければ root になる。

- `su` ユーザ切替（カレントディレクトリを変えずに）
- `su -`又は`su - root` ユーザ切替（カレントディレクトリを root のホームディレクトリにする）

### `sudo`コマンド

一時的に他のユーザ権限でコマンドを実行する。

- `-u`オプションでユーザを指定しなければ root になる。
- `sudo`できるユーザグループを`visudo`コマンドで明示的に指定しておく必要がある。

## ユーザ権限とアクセス権

### 所有者と所有グループ

ファイルの作成者が所有者・所有グループになる。

#### `chown`

所有者を変更する

- `-R` ディレクトリ内の全てを再帰的に変更する

#### `chgrp`

所有グループを変更する

- `-R` ディレクトリ内の全てを再帰的に変更する

### アクセス権

#### `chmod`

アクセス権を変更する。

```sh
# u --- user, g---group, o---other
chmod u+rw-x,go+r-wx SOMEFILE

chmod 600 SOMEFILE
```

#### seduid ビット

これが設定されている場合は、他者が実行したとしても、ファイル所有者の権限で実行される。

```sh
chmod u+s SOMEFILE
# -rwSr--r-- 1 root root 0 Nov 19 00:43 idbitfile

# 実行権限も付与されている場合は小文字表記になる
# -rwsr--r-- 1 root root 0 Nov 19 00:43 idbitfile
```

#### setgid ビット

これが設定されている場合は、他者が実行したとしても、ファイル所有グループの権限で実行される。

```sh
chmod g+s SOMEFILE
# -rw-r-Sr-- 1 root root 0 Nov 19 00:43 SOMEFILE

# 実行権限も付与されている場合は小文字表記になる
# -rw-r-sr-- 1 root root 0 Nov 19 00:43 SOMEFILE
```

#### sticky ビット

これが設定されているディレクトリ内のファイルは所有者以外は削除できない。

```sh
chmod +t SOMEFILE
# -rw-r--r-T 1 root root 0 Nov 19 00:43 SOMEFILE

# 実行権限も付与されている場合は小文字表記になる
# -rw-r--r-t 1 root root 0 Nov 19 00:43 SOMEFILE
```

#### `umask`

マスク値を表示したり、設定したりする。

デフォルトの値からマスク値を引いた値が、ファイルの権限になる。

例えば、touch は 666 の権限でファイルを作成しようとする。
しかし、マスク値が 022 なので、実際には 644 の権限で作成される。

```sh
# 現在のマスク値を表示
umask
# => 0022

touch SOMEFILE1
# -rw-r--r--   1 root  root     0 Nov 19 00:58 SOMEFILE1

# マスク値を000にする。シェル内でのみ有効。
umask 000
touch SOMEFILE2
# -rw-rw-rw-   1 root  root     0 Nov 19 00:58 SOMEFILE2
```

## シェルスクリプト

### シェルスクリプト

#### シェルの指定

1 行目に`#!/bin/bash`などで使用するシェルを指定する。
2 行目以降にコマンドを記述する。

#### `echo`

引数として与えた文字列を標準出力に出力する。

- `-n` 改行を出力しない

#### 変数

代入は`=`、参照は`$`

```sh
abc=123
echo $abc
# =>123
```

配列への代入は`[]`をつけて行う。参照は`${}`で行う。

```sh
arr[0]=5
arr[1]=6
echo ${arr[1]}
# =>6
```

#### シェル変数

- シェル変数（通常の変数）は、そのシェルスクリプトの内部でのみ有効。
- `set`で一覧表示、`unset`で削除する。

#### 環境変数

- 環境変数は、その後に実行した全てのコマンドで有効。
- `env`で一覧表示、`unset`で削除する。
- `export`で設定する。

```sh
export abc # シェル変数abcを環境変数にする
export abc=123 # 環境変数abcを作成し123を代入する
```

#### `read`

標準入力からデータを読み込んで変数に代入する。

```sh
read abc
# 'hello'と入力
echo $abc
# => hello
```

#### 引用符

- シングルクォート --- 変数を展開せずに文字列になる。
- ダブルクォート --- 変数を展開したうえで文字列になる。
- バッククォート --- 変数を展開したうえで、コマンドとして即時に実行した結果が文字列になる。

#### 引数

`$`のあとに番号や記号を指定することで引数を取得できる。

```sh
./args.sh aaa bbb ccc
# $0 => ./args.sh
# $1 => aaa
# $2 => bbb
# $3 => ccc

# 引数の数を取得する
# $# => 3
```

#### `shift`

`$2`を`$1`に、`$3`を`$2`というふうに、引数の位置を手前に 1 つずつずらす。

#### エスケープシーケンス

直後の 1 文字の扱いを変更する。

```sh
echo "I am a cat. \
As yet I have no name."
# => 改行は無効にして出力しない

echo "My name \"IS\" John"
# => 引用符を無効にしてただの文字列として扱う

echo -e "My name \t is \n John"
# => タブや改行を挿入する
#    (`echo`でエスケープ文字を利用するには`-e`オプションの指定が必要)
```