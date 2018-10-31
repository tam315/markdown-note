# Wordpress

[[toc]]

## Lightsail

### セットアップ

[手順](https://lightsail.aws.amazon.com/ls/docs/ja/articles/amazon-lightsail-quick-start-guide-wordpress)

1. Wordpress インスタンスを作成する
1. 静的 IP を取得しインスタンスにアタッチする（アタッチされている限りは無料）
1. DNS の設定を行う
1. web コンソールでインスタンスに SSH 接続する
1. `cat bitnami_application_password`してパスワードを取得
1. `http://PUBLIC_IP/wp-admin/`にアクセスし、`user` + 先程のパスワードでログインする。
1. 後は好きにする。

#### SSL の設定

```bash
# Let's Encryptのセットアップ
cd /tmp
git clone https://github.com/letsencrypt/letsencrypt
cd letsencrypt
./letsencrypt-auto

# 証明書の取得
./letsencrypt-auto certonly --webroot -w /opt/bitnami/apps/wordpress/htdocs/ -d ${ドメイン名}

# 取得した証明書をApacheに読み込ませて再起動
sudo cp /etc/letsencrypt/live/${ドメイン名}/fullchain.pem /opt/bitnami/apache2/conf/server.crt
sudo cp /etc/letsencrypt/live/${ドメイン名}/privkey.pem /opt/bitnami/apache2/conf/server.key
sudo /opt/bitnami/ctlscript.sh restart apache
```

#### 証明書の自動更新

`/home/bitnami/update_cert.sh`として、下記のファイルを作成しておく。

```sh
#!/bin/sh
/tmp/letsencrypt/letsencrypt-auto renew
cp /etc/letsencrypt/live/${ドメイン名}/privkey.pem /opt/bitnami/apache2/conf/server.key
cp /etc/letsencrypt/live/${ドメイン名}/fullchain.pem /opt/bitnami/apache2/conf/server.crt
/opt/bitnami/ctlscript.sh restart apache
```

実行権限を与える

```sh
chmod +x /home/bitnami/update_cert.sh
```

cron の設定を行うため、`sudo crontab -e`を実行して下記の行を追記する。
（毎月 1 日の 1 時 1 分に処理を行う。かつ、ログを残す。）

```txt
1 1 1 * * /home/bitnami/update_cert.sh >> /home/bitnami/letsencrypt.log
```

#### phpmyadmin の許可 IP 設定

デフォルトでは localhost 以外からアクセスできないので、`/opt/bitnami/apps/phpmyadmin/conf/httpd-app.conf`に許可する IP を追記する

```txt
<IfVersion >= 2.3>
Require local
Require ip ▲.▲.▲.▲ # <=この行を追加
```

#### 右下の Bitnami のロゴを消す

```bash
sudo /opt/bitnami/apps/wordpress/bnconfig --disable_banner 1
sudo /opt/bitnami/ctlscript.sh restart apache
```

### SSH での接続

`/home/bitnami/.ssh/authorized_keys`に自身の公開鍵を追記したのち、下記で接続する。（コンソールから公開鍵をアップロードする方法ではうまく動かなかった）

```bash
ssh　bitnami@${lightsailのIP}
```

## おすすめプラグイン

- WP Multibyte Patch
  - 日本語環境での不具合を修正する
- Advanced Custom Fileds
  - 投稿にカスタムフィールドを作ることができる
  - Pro 版を使えば表形式にも対応

## パス

- `domain/wp-admin` wordpress 管理画面
- `domain/wp-json/wp/v2/posts` REST API
- `domain/phpmyadmin` phpMyAdmin 管理画面

## Tips

- `sudo su -`で root user に切り替えられる

## REST API

- `/wp-json/wp/v2/posts` posts の一覧
- `/wp-json/wp/v2/pages` pages の一覧
- `/wp-json/wp/v2/media` media の一覧
- `/wp-json/wp/v2/types` types の一覧。デフォルトは下記のとおり。適用する Taxonomies はここで指定できる？
  - post
  - page
  - attachment(media)
- `/wp-json/wp/v2/statuses` 記事の状態の一覧？
  - publish
- `/wp-json/wp/v2/taxonomies` taxonomies の一覧。デフォルトは下記のとおり。
  - category
  - post_tag
- `/wp-json/wp/v2/categories` カテゴリの一覧
- `/wp-json/wp/v2/tags` タグの一覧

## 設定ファイル等

`htdocs/wp-config.php`　データベースの認証情報などを管理。セットアップ時以外で触ることはなさそう。

## サイト制作において考慮する事柄

- 何をするのか
- 誰が読むのか
- どんな情報を載せるか
- なぜやるのか
- 誰のためにやるのか
- どのくらいの頻度で情報を更新するか

## データベースについて

page(固定ページ)、post(投稿)、custom-post(カスタム投稿)、attatchment(メディア)のデータは、すべて`wp_posts`という一つのテーブルで管理されている。
