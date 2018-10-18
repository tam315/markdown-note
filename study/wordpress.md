# Wordpress

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

### Tips

- `sudo su -`で root user に切り替えられる

### SSH での接続

- コンソールの、アカウント →SSH キーから、デフォルトのキーをダウンロードしておく
- 下記コマンドを実行する

  ```bash
  ssh -i ${ダウンロードしたkey} bitnami@${lightsailのIP}
  ```

### パス

- `domain/wp-admin` wordpress 管理画面
- `domain/phpmyadmin` phpMyAdmin 管理画面
