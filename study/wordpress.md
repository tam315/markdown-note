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

## Theme の作成

### 概要

- テーマファイルは`htdocs/wp-content/themes`にあり、下記の 3 つから構成される
  - Stylesheet（`style.css`）
  - Template files
  - Functions file(`functions.php`)

### Stylesheet

- 通常の CSS ファイルである
- テーマのメタ情報を一番上に記載する。Wordpress はこの情報を使ってテーマを識別しているため、名前の重複などは許されない。

```css
/*
Theme Name: Twenty Thirteen
Theme URI: http://wordpress.org/themes/twentythirteen
Author: the WordPress team
......
*/
```

### Function File

`functions.php`はプラグインのようにふるまう。単一のテーマ内で使う機能は`functions.php`が適しているが、複数のテーマで共通して使う機能は Plugins として作成するほうがよい。

[使用できるファンクション一覧](https://codex.wordpress.org/Function_Reference)

このファイルの目的は下記の通り。

- css ファイルや js ファイルを Enqueue(`wp_enqueue_scripts`)する時に使う
- 下記の機能を有効にする時に使う
  - Sidebars
  - Navigation Menus
  - Post Thumbnails
  - Post Formats
  - Custom Headers
  - Custom Backgrounds
- 複数のテンプレートファイルで共通して使う機能を定義する
- サイトオーナーがオプション設定するときの、カスタマイズメニューの設定に使う

### Themplate Files

テンプレートファイルは、HTML, PHP, [Worspress Template Tag](https://codex.wordpress.org/Template_Tags)からなる。

極端な例では、一つの`index.php`にすべてを記載することもできるが、分けて作成することで様々なカスタマイズが可能になる。

下記のファイル名は予約済みであり、特別な役割を果たす。

<!-- prettier-ignore -->
name | desc
--- | ---
`style.css` | メインの stylesheet。テーマのメタ情報をヘッダとして含める必要がある。
`rtl.css` | RTL 環境で採用される CSS。このファイルは RTLer plugin を使って作成できる。
`index.php` | メインのテンプレート。必須。投稿一覧、カテゴリ一覧、タグ一覧、検索結果一覧など一覧と名の付くものすべてを表示するためのテンプレートとして扱うとよい。
`comments.php` | コメントのテンプレート
`front-page.php` | フロントページのテンプレート
`home.php` | フロントページの表示方法が「最新の投稿を表示」になっていた場合にのみ、`front-page.php`に変わってこれが採用される。フロントページの表示方法が「固定ページを表示」になっている場合は`front-page.php`が採用される。
`single.php` | 個別投稿のテンプレート。
`single-{post-type}.php` | カスタム投稿タイプごとの、個別投稿のテンプレート。
`page.php` | 固定ページ用テンプレート
`category.php` | カテゴリ*
`tag.php` | タグ*
`taxonomy.php` | タクソノミ*
`author.php` | Author*
`date.php` | 日時・時間用*
`archive.php` | アーカイブ用テンプレート。上記*がない場合に採用される。
`search.php` | 検索結果用
`attachment.php` | 単一の添付ファイルを閲覧する用のテンプレート
`image.php` | 単一の画像ファイル用のテンプレート。なければ`attachment.php`が採用される。
`404.php` | 404

### テンプレートの優先順位

![テンプレートの優先順位](//wpdocs.osdn.jp/wiki/images/wp-template-hierarchy.jpg)

### テンプレートに取り込めるパーツ

テンプレート内では、下記のファンクションを使って、ヘッダやフッタを取り込むことができる。

- get_header()
- get_sidebar()
- get_footer()
- get_search_form()
- comments_template()

### 固定ページ用テンプレート（page template）

themes フォルダ内に、下記のようなファイルを作成する。ファイル名は何でも OK。
Template Name に指定した名前が、固定ページ編集時のテンプレート選択ドロップダウンの表示名になる。

```php
<?php
/*
Template Name: Snarfer
*/
?>
```

### クエリベースのテンプレート

クエリタイプによってテンプレートを切り替えるには、テンプレートヒエラルキーを使う方法と、The Loop の中で Conditional Tags を使う方法の 2 つがある。

#### テンプレートヒエラルキーを使う

前述の[テンプレートの優先順位](#テンプレートの優先順位)を利用して、テンプレートを切り替える方法。例えば、`category-6.php`というファイルが有れば、ID が 6 であるカテゴリのテンプレートには、`index.php`の代わりにそのファイルが使われる。

#### Conditional Tags を使う

テンプレート内で、条件分岐により表示するテンプレートを切り替える方法。

[Conditional Tags の一覧](https://codex.wordpress.org/Conditional_Tags)

```php
<?php
if ( is_category( '9' ) ) {
    get_template_part( 'single2' ); // looking for posts in category with ID of '9'
} else {
    get_template_part( 'single1' ); // put this on every other category post
}
?>
```

### カスタムテンプレートの定義

Plugins や`functions.php`を用いて、`template_include`という action hook で表示するテンプレートを切り替える方法。

```php
function custom_template_include($template)
{
    if (is_single() && in_category('news')) {
        $new_template = locate_template(array( 'single-news.php' ));
        if ('' != $new_template) {
            return $new_template ;
        }
    }

    return $template;
}
add_filter('template_include', 'custom_template_include', 99);
```

### テンプレートファイルの Include

`get_template_part()`で任意のテンプレートパーツを読み込むことができる。

```php
get_template_part('my-template/content');
// => my-template/content.php

get_template_part('my-template/content', 'single');
// => my-template/content-single.php
```

### テンプレート内でファイルを参照する

テンプレート内から、他のファイルの URI(url) や絶対パスを取得する際は、ハードコーディングはせずに、下記の関数を使うこと。

```php
echo get_theme_file_uri( 'images/logo.png' ); // => 'http://...'
echo get_theme_file_path( 'images/logo.png' ); // => '/opt/bitnami/...'
echo get_parent_theme_file_uri( 'images/logo.png' );
echo get_parent_theme_file_path( 'images/logo.png' );
```

なお、css ファイル内は相対参照になる。

```css
h1 {
  background-image: url(images/my-background.jpg);
}
```

### Plugin API Hooks

テーマを作成するときは、他のプラグインが機能をインジェクトできるように、最低限でも下記の Plugin API をテーマ内に含めておく必要がある。

- `wp_enqueue_scripts`
  - functions.php の中に記載する。プラグインが、外部の JS/CSS ファイルを読み込む時に使う。
- `wp_head()`
  - header.php の中に記載する。プラグインが JS コードをインジェクトするとき等に使う。
- `wp_footer()`
  - footer.php の終了 BODY タグの直前に記載する。プラグインが、一番最後で良い処理、例えば Analytics コードのインジェクトをする際などに使う。
- `wp_meta()`
  - sidebar.php に記載する。プラグインが広告やタグクラウドを挿入する時に使う。
- `comment_form()`
  - comments.php の最後の`</div>`の直前に記載する。プラグインがコメントプレビューを挿入する際などに使う。

### Theme Customization API

サイト管理者にテーマをカスタマイズさせるための API。TODO:詳細は要調査。
https://codex.wordpress.org/Theme_Customization_API

### Untrusted Data のサニタイズ

動的なデータは、下記のファンクションで適宜サニタイズすること。

- HTML 属性 => `esc_attr()`
- HTML => `esc_html()`
- URL => `esc_url()`

### i18n

TODO:要調査
https://codex.wordpress.org/I18n_for_WordPress_Developers

### WordPress-generated class

WordPress が自動生成した様々なクラスを挿入するには、下記の関数を使う。

- `body_class()`
- `post_class()`
- `comment_class()`

```html
<!-- 例 -->
<article <?php post_class(); ?> />
```

### テーマ開発の流れ

1. PHP / WordPress のエラーを修正する。この際、`wp-config.php`に`define('WP_DEBUG', true)`を追記して行うと良い。
1. [チェックリスト](https://codex.wordpress.org/Theme_Development#Template_File_Checklist)でチェックを行う
1. [Unit Test](https://codex.wordpress.org/Theme_Unit_Test)を行う
1. [Validation](https://codex.wordpress.org/Validating_a_Website)を行う
1. JS のエラーを修正する
1. 複数のブラウザでテストを行う
1. 不要な comment、デバッグ設定、TODO を消す

## Child Theme

- `style.css`と画像だけを含む。
