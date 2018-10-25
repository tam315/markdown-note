# Wordpress - [レッスンブック](https://www.amazon.co.jp/WordPressレッスンブックHTML5-CSS3準拠-エビスコム-ebook/dp/B07B2RNCZ1)

[[toc]]

## 下準備

1. WP Multibyte Patch プラグインは入れておいたほうがいい
1. `htdocs/wp-content/themes`の中に任意の名前のフォルダを作成し、下記のファイルを配置する
   - index.php
   - style.css (メタデータも記載しておく)
   - screenshot.jpg (管理画面のサムネイル用)

## 基本的なブログサイトの作成

### 基本設定

#### ヘッダを構築する

- html タグの lang 属性
- meta タグの charset 属性
- title タグ

```php
<!DOCTYPE html>
<html <?php language_attributes() ?>>
<head>
<meta charset="<?php bloginfo('charset') ?>">
<title>ページタイトル</title>
</head>
```

#### 自動生成されたクラスを BODY にインジェクト

- `body_class()` で WP が生成したクラスをインジェクトする。ページを区別するクラス名、ユーザがログイン中かどうかを示すクラス名、プラグインが使用するクラス名などが出力される
- `body_class('my-class')`とすると、クラスの一番最後に`my-class`を追加してくれる

```php
<body <?php body_class() ?>>
```

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

- `post_class()`で、WP が生成したクラスを記事ごとにインジェクトする。
- ID・カテゴリなどの情報や、プラグインが使うクラス名が出力される。
- `post_class('my-class')`とすると、クラスの一番最後に`my-class`を追加してくれる

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

### 前後記事へのリンクを表示

`previous_post_link()`と`next_post_link()`を使う。
第一引数はリンクの周りの出力要素、第二引数はタイトルの周りの出力要素を指定できる。

```php
previous_post_link(
    '<< %link >>',
    '[[ %title ]]',
)
// => << [[ title ]] >>  ただしリンクは[[ title ]]の部分のみ有効
```

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
