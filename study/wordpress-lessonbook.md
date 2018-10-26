# Wordpress - [レッスンブック](https://www.amazon.co.jp/WordPressレッスンブックHTML5-CSS3準拠-エビスコム-ebook/dp/B07B2RNCZ1)

[[toc]]

## 基本設定

### ヘッダ等

#### 下準備

`htdocs/wp-content/themes`の中に任意の名前のフォルダを作成し、下記のファイルを配置する

- index.php
- style.css (メタデータも記載しておく)
- screenshot.jpg (管理画面のサムネイル用)

#### ヘッダを構築する

```php
<!DOCTYPE html>
<html <?php language_attributes() ?>>
<head>
<meta charset="<?php bloginfo('charset') ?>">
<meta name="description" content="<?php bloginfo('description'); ?>"/>
<title>
    <?php bloginfo('name'); ?><?php wp_title(); ?>
</title>
</head>
```

- `language_attributes()`
  - html タグの lang 属性を出力する
- `bloginfo('charset')`
  - meta タグの charset 属性を出力する
- `bloginfo('name');`
  - サイト名を出力
- `bloginfo('description');`
  - サイトの説明を出力
- `wp_title()`
  - 生成された「ページ」に応じて最適なタイトルを出力
  - 引数で、区切り文字の設定が可能

#### 自動生成されたクラスを BODY にインジェクト

```php
<body <?php body_class() ?>>
```

- `body_class()`
  - WP が自動生成したクラスをインジェクトする。
  - ページを区別するクラス名、ユーザがログイン中かどうかを示すクラス名、プラグインが使用するクラス名などが出力される
  - `body_class('my-class')`のように引数を指定するとすると、自動生成されたクラスの一番最後に指定したクラス（`my-class`）を追加してくれる

### コンテンツを表示する

```php
<?php if (have_posts()): while (have_posts()): the_post(); ?>
    <article <?php post_class() ?>>
        <h1><?php the_title() ?></h1>
        <?php the_content() ?>
    </article>
<?php endwhile; endif; ?>
```

#### ループの作成

- `have_posts()`と`the_post()`を組み合わせる
- `the_post()`は、何回処理したかをカウントしたり、1 つずつ取り出したデータをテンプレートタグできちんと扱えるようにしたりする処理を行っている

#### 自動生成されたクラスを投稿にインジェクト

- `post_class()`
  - WP が生成したクラスを記事ごとにインジェクトする。
  - ID・カテゴリなどの情報や、プラグインが使うクラス名が出力される。
  - `post_class('my-class')`のように引数を指定すると、自動生成されたクラスの一番最後に`my-class`を追加してくれる

#### コンテンツの表示

- `the_title()`や`the_content()`を使ってコンテンツを描写する。
- これらは基本的にループ内でしか使えない。

### CSS

メインの CSS を読み込む。

```php
<link rel="stylesheet" href="<?php echo get_stylesheet_uri(); ?>">
```

CSS の先頭には`charset`を記載しておく

```css
@charset "UTF-8";
```

### 投稿日・カテゴリの表示

```php
<div>
    <time datetime="<?php echo get_the_date('Y-m-d'); ?>">
        <?php echo get_the_date(); ?>
    </time>
    <span>
        <?php the_category(', ') ?>
    </span>
</div>
```

下記はいずれもループの中で使用可能。

- `get_the_date('形式')`
  - 投稿日時を出力する
  - 指定した形式で出力する
- `the_time()`
  - 投稿時間を出力する。
  - 「設定＞一般」の時刻フォーマットで出力する
- `the_category('区切り文字')`
  - カテゴリを出力する。
  - 区切り文字を省略すると`<ul>`,`<li>`として出力される。

### 前後記事へのリンクを表示

```php
previous_post_link(
    '<< %link >>',
    '[[ %title ]]',
)
// => << [[ title ]] >>  ただしリンクは[[ title ]]の部分のみ有効
```

`previous_post_link()`と`next_post_link()`を使う。
第一引数はリンクの周りの出力要素、第二引数はタイトルの周りの出力要素を指定できる。

### トップページの作成

#### 個別ページの場合のみ行う処理

```php
<?php if(is_single()): ?>
    // 現在のページが、単一の投稿を表示するページの場合の処理
<?php else: ?>
    // 現在のページが、複数の投稿を表示するページの場合の処理
<?php endif; ?>
```

#### 記事へのリンクを貼る

ループの中でのみ有効

```php
<a href="<?php the_permalink(); ?>"></a>
```

#### 1 ページに投稿が収まるかの判定

1 ページあたりの投稿の表示上限数は管理画面から設定できる。
総ページ数を`max_num_pages`で取得できるので、これが 1 以上かどうかで判定する。

```php
<?php if($wp_query->max_num_pages > 1): ?>
    // ページネーションの表示など
<?php endif; ?>
```

#### ページネーションを表示する

`post`ではなく、`posts`なので注意。引数を省略すると、「次のページ」などの文言が自動で設定される。

```php
<?php next_posts_link('古い記事') ?>
<?php previous_posts_link('新しい記事') ?>
```

#### ホームページの設定

ホームページの設定は、「設定＞表示設定＞ホームページの表示」から行う。2 つのモードが有る。

1. ルートパスにアクセスした際、投稿を一覧で表示するモード（テンプレートは`front-page.php`）
2. ルートパスにアクセスした際、固定ページを表示（テンプレートは`front-page.php`）し、投稿の一覧表示は別の固定ページ（テンプレートは`home.php`）で行うモード

### 特定のページの判定

- `is_singular()` 下記のいずれか
  - `is_single()`　投稿の個別ページ
  - `is_page()` 固定ページ
- `is_home()` ホームページの表示設定が「固定ページ」になっている場合における「投稿ページ」であるかどうか
- `is_front_page()` ルートパスで表示されるページかどうか
- `is_archive()` 以下のいずれか
  - `is_category()` カテゴリページか
  - `is_month()` 月別ページか

`is_single`, `is_page`, `is_category`では、引数を指定することでより詳細な絞り込みを行える。

```php
// '臨時休業のお知らせ'というタイトルのページにのみ
<?php if(is_single('臨時休業のお知らせ')): ?><?php endif; ?>

// 'Development'というカテゴリにのみ
<?php if(is_category('Development')): ?><?php endif; ?>
```

個別ページのうち、特定の条件のものを抜き出すには`has_***()`を使う。

- `has_category()`
- `has_tag()`
- `has_post_thumbnail()`

```php
<?php if(is_single() && has_category('Development')): ?>
```

### ヘッダとフッタ

```php
<header>
    <h1><a href="<?php echo home_url(); ?>"><?php bloginfo('name'); ?></a></h1>
    <p><?php bloginfo('description'); ?></p>
</header>
```

- `echo home_url();`
  - サイトのトップページ URL を出力
  - 引数で、付加したいパスを指定することが可能

### `wp_head()`と`wp_footer()`

- WordPress のテーマでは、`wp_head()`と`wp_footer()`は必ず付加する決まりになっている。
- `wp_head()`は`</head>`の直前に入れる
- `wp_footer()`は`</body>`の直前に入れる（`</footer>`の直前ではないので注意）

## 画像

- 画像をアップロードすると、3 種類の画像（サムネイル、中サイズ、大サイズ）が作成される。このサイズは、管理画面で設定可能。
- キャプションは下記のような形で画像の下に出力される。

  ```html
  <p class="wp-caption-text">キャプションです。</p>
  ```

- 画像の配置位置を「右、左、中央」などにしても、標準では見た目は変わらない。`aligncenter`、`alignright`、`alignleft`というクラスが設定されるので、これを使って、手動で CSS を設定すること。

## Menu

### ウィジェットの登録と表示

ウィジェットはサイドバーに表示されるので、まずはサイドバーを設置する。
その後、管理画面から配置するウィジェットを選択する。

```php
// function.php
<?php register_sidebar(); ?>

// index.php
<ul><?php dynamic_sidebar(); ?></ul>
```

複数のサイドバーを登録したいときは下記の通り。

```php
// function.php
<?php
register_sidebar();
register_sidebar();
?>

// index.php
<ul><?php dynamic_sidebar(1); ?></ul>
<ul><?php dynamic_sidebar(2); ?></ul>
```

### カテゴリページ用テンプレート

```php
<?php if(is_category()): ?>
    <h1>"<?php single_cat_title(); ?>"に関する記事</h1>
<?php endif; ?>
```

- `single_cat_title();`
  - カテゴリ名を出力

### 月別ページ用テンプレート

```php
<?php if(is_month()): ?>
    <h1><?php echo get_the_date('Y年n月'); ?>に投稿した記事</h1>
<?php endif; ?>
```

## RSS

```php
// functions.php
<?php
add_theme_support('automatic-feed-links');
```

```php
// index.php
<a href="<?php bloginfo('rss2_url'); ?>">RSS Feed</a>
```

- `add_theme_support(automatic-feed-links)`
  - head タグ内に RSS へのリンクを自動で埋め込む（通常のフィード＋コメントフィード）
- `bloginfo('rss2_url')`
  - RSS ファイルへのリンクを出力する

## コメント

### コメントフォームの設置

```php
// comments.php
<?php
comment_form('format=html5');
```

```php
// index.php
<?php
<?php comments_template(); ?>
```

- `comment_form()`
  - コメントフォームを読み込む
  - 通常のテンプレートにベタ打ちしても動作するが、その場合、すべてのページでコメントフォームを表示してしまって都合が悪いので、`comments_template()`と組み合わせて使うとよい。
- `comments_template()`
  - コメントテンプレート（`comments.php`）を読み込む
  - 個別ページ、固定ページの場合にのみ作動する。一覧ページでは作動しない。

### コメントの表示

```php
// comments.php
<?php if(have_comments()): ?>
    <h3>コメント</h3>

    <ul>
    <?php wp_list_comments(); ?>
    </ul>
<?php endif; ?>
```

- `have_comments()`
  - もし書き込まれたコメントが存在する場合
- `wp_list_comments()`
  - コメントリストを描写する
  - 引数によりオプションを指定できる。アバターのサイズ、階層の深さ、HTML5 での出力など。

### コメント数の表示

```php
<a href="<?php comments_link(); ?>">
    <?php comments_number('コメントなし','コメント1件','コメント%件') ?>
</a>
```

- `comments_number()`
  - コメントの統計情報を出力する
  - 引数は順に、コメント 0 件、コメント 1 件、コメント複数件のときの出力を指定できる
- `comments_link()`
  - コメントへのリンクを生成する。実際はカレント URL に`#comments`を加えただけのもの。

### トラックバック

```php
Trackback URL: <?php trackback_url() ?>
```

- `trackback_url()`
  - トラックバック URL を出力する

## 固定ページの作成

### テンプレート

固定ページのテンプレートは下記の順で選択される。

1. カスタムテンプレート
1. `page.php`
1. `index.php`

カスタムテンプレートは下記のようにして作成する。管理画面で、固定ページごとにテンプレートを手動選択できる。

```php
// my-template.php

<?php
/*
Template Name: マイテンプレート1
*/
?>
```

### パーツテンプレート

| テンプレートタグ         | 読み込まれるファイル | 備考                              |
| ------------------------ | -------------------- | --------------------------------- |
| `get_header()`           | `header.php`         |
| `get_footer()`           | `footer.php`         |
| `get_sidebar()`          | `sidebar.php`        |
| `comments_template()`    | `comments.php`       | `is_single()`の場合は読み込まない |
| `get_serarch_form()`     | `searchform.php`     |
| `get_template_part('*')` | `*.php`              | 任意のファイルを読み込む          |

例えばヘッダをパーツテンプレートとして切り出す場合、`header.php`を作成したうえで、`index.php`で下記のようにする。

```php
// index.phpなど
<?php get_header(); ?>
```

### ナビゲーションメニューの作成

ロケーションを登録する。各ロケーションには 1 つのメニューを表示することができる。

```php
// functions.php
register_nav_menu('navigation', 'ナビゲーション');
register_nav_menu('navigation2', 'ナビゲーション2'); // ロケーションを2つ作る場合
```

テンプレートに、ロケーションを示すテンプレートタグを記載する。

```php
<?php wp_nav_menu('theme_location=navigation'); ?>
```

管理画面でメニューを作成する。その際、メニューをどこのロケーションに表示するか選択する。

なお、ナビゲーションメニューはそのままウィジェットとしても使うことができる。

### お問い合わせフォームの配置

Contact Form 7 というプラグインを使えば、ショートコードを貼り付けるだけで OK。ただしメールサーバの設定が必要。

## その他

### テンプレートフォルダのアセットにアクセスする

- `get_template_directory_uri()`
  - テーマフォルダの URI を取得する

### カスタムヘッダー

カスタムヘッダとは、複数のヘッダ画像を管理できる機能である。

機能を有効にする

```php
// functions.php
add_theme_support('custom-header');
```

ヘッダ画像があれば、出力する

```php
<?php if(get_header_image()): ?>
    <img src="<?php header_image(); ?>" />
<?php endif; ?>
```

画像のアップロードや設定は管理画面の「外観＞ヘッダ」から行う。

- `add_theme_support('custom-header')`
  - カスタムヘッダを有効にする
- `get_header_image()`
  - 画像の URI を返す
- `header_image()`
  - 画像の URI を echo 出力する

### カスタム背景

背景画像を指定できる機能。

```php
// functions.php
add_theme_support('custom-background');
```

画像のアップロードや設定は管理画面の「外観＞背景」から行う。
