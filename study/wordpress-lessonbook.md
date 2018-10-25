# Wordpress - [レッスンブック](https://www.amazon.co.jp/WordPressレッスンブックHTML5-CSS3準拠-エビスコム-ebook/dp/B07B2RNCZ1)

[[toc]]

## 下準備

1. WP Multibyte Patch プラグインは入れておいたほうがいい
1. `htdocs/wp-content/themes`の中に任意の名前のフォルダを作成し、下記のファイルを配置する
   - index.php
   - style.css (メタデータも記載しておく)
   - screenshot.jpg (管理画面のサムネイル用)

## 基本的なブログサイトの作成

### 基本部分

#### html, head

下記の項目について設定する

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

#### body

- `body_class()` で WP が生成したクラスをインジェクトする。ページを区別するクラス名、ユーザがログイン中かどうかを示すクラス名、プラグインが使用するクラス名などが出力される

```php
<body <?php body_class() ?>>
```

#### コンテンツ

- `have_posts()`と`the_post()`を組み合わせてループを作る。`the_post()`は、何回処理したかをカウントしたり、1 つずつ取り出したデータをテンプレートタグできちんと扱えるようにしたりする処理を行っている
- `post_class()`で、WP が生成したクラスを記事ごとにインジェクトする。ID・カテゴリなどの情報や、プラグインが使うクラス名が出力される。
- `the_title()`や`the_content()`を使ってコンテンツを描写する。これらは基本的にループ内でしか使えない。

```php
<?php if (have_posts()): while (have_posts()): the_post(); ?>
    <article <?php post_class() ?>>
        <h1><?php the_title() ?></h1>
        <?php the_content() ?>
    </article>
<?php endwhile; endif; ?>
```
