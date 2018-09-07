# Hugo

[[toc]]

## Quick Start

```bash
hugo new site ${PROJECT_NAME}

cd ${PROJECT_NAME}
git init

# テーマの追加
git submodule add ${GIT_REPO_OF_THEME} themes/${THEME_NAME}

# configファイルで使用するテーマを指定する
echo 'theme = "ananke"' >> config.toml

# コンテンツの作成
hugo new posts/my-first-post.md

# サーバを起動
hugo server -D
```

`hugo new` で記事を作成するとドラフト記事として作成される（fontmatter の`draft`が `true` になる）。
ドラフト記事は、`hugo server`で`-D` オプションをつけないと表示されないので注意する。

## Go Template

[こちら](https://qiita.com/lanevok/items/dbf591a3916070fcba0d)を参照

## Config

```toml
baseURL = "https://yoursite.example.com/"
footnoteReturnLinkContents = "↩"
title = "My Hugo Site"

[params]
  AuthorName = "Jon Doe"
  GitHubUser = "spf13"
  ListOfFoo = ["foo1", "foo2"]
  SidebarRecentLimit = 5
  Subtitle = "Hugo is Absurdly Fast!"

[permalinks]
  post = "/:year/:month/:title/"
```

詳細は[公式ドキュメント](https://gohugo.io/getting-started/configuration/)を参照

### params

params の内容は、`.Site.Params`としてテンプレート内から利用できる。

### 日付の調整

日付、最終編集日、公開開始日、公開終了日をどのように設定するかをカスタマイズできる。詳細は[ドキュメント](https://gohugo.io/getting-started/configuration/#configure-dates)を参照

### Blackfriday

デフォルトの Markdown パーサーである Blackfriday の調整ができる。詳細は[ドキュメント](https://gohugo.io/getting-started/configuration/#configure-blackfriday)を参照

### 環境変数で Config を設定する

```bash
env HUGO_TITLE="My Hugo Site" hugo
```

## CLI

### hugo

プロジェクトをビルドし`public`フォルダに出力する。

Hugo は`public`フォルダ内のファイルを削除しないので、ビルドの前に手動で`public`フォルダを削除しておくこと。

下記に該当するコンテンツはビルドされないので注意する。
この挙動を変更したい場合は[ドキュメント](https://gohugo.io/getting-started/usage/#draft-future-and-expired-content)を参照すること。

- front matter に`publishdate`が設定されている
- front matter に`expirydate`が設定されている
- front matter の`draft`が`true`に設定されている

```bash
hugo
```

### hugo server

開発用のサーバを`http://localhsot:1313`で立ち上げる。

```bash
hugo server -D
```

## Directory Structure

### archetypes

`hugo new post/***`を実行した際の Front Matter の雛形を管理する。

### assets

Hugo Pipes で処理する必要のあるファイルを管理する。`.Permalink`又は`.RelPermalink`が使われているファイルのみ、`public`ディレクトリに出力される？？

### config.toml

Hugo の Config ファイル

### content

全てのコンテンツを管理する。

好きなだけネストさせるこができる。ただし、`content`フォルダ直下は特別で、配置できるファイルは次の通り。

- \_index.md （トップページになる）と関連する画像ファイルなど
- フォルダ

`content`直下のフォルダは、`conetnt section`として認識される。例えば、`blog`,`articles`, `tutorials`というセクションを作りたい場合は、その名前のついたフォルダを`content`フォルダ直下に作成する。

デフォルトでは、各セクションの配下に作成された記事には、セクションの名前（`blog`など）が`Content Type`として自動的に設定される。`Content Type`は、どのレイアウトの選択等に使用される。

### data

コンテンツの中で、json, yaml, toml といったデータを扱う場合、ここで管理する。
**Data templates**を使えば、動的にデータを取得することもできる。

### layouts

テンプレートを管理する。テンプレートの形式は HTML であり、下記の種類がある。

- list page templates
- homepage templates
- taxonomy templates
- partial templates
- single page templates
- ...and more

### static

images, CSS, Javascript といった静的コンテンツを管理する。
そのまま`public`フォルダのルートに配置される。

## Resources

### Resouces とは

- `content`フォルダ内の全てのファイルは`Resources`になる。Hugo が MIME type を認識できる限り。
- `content`フォルダ直下が`section`になる

### 全ての Resources を一覧表示

```html
{{ range .Resources }}
<li><a href="{{ .RelPermalink }}">{{ .ResourceType }}</a></li>
{{ end }}
```

絶対パスが必要なら`.Permalink`をつかうこと。

### Type を指定して一覧表示

タイプ名は、ページの場合は`page`、その他の場合は `image`や`json`などの MIME タイプで指定する。

```html
{{ range .Resources.ByType "image" }}
  {{ .ResourceType }}
{{ end }}
```

### 特定の条件にあてはまる Resouces を表示

例：ファイル名が`logo`で始まるリソースを表示する

```html
<!-- 当てはまるもの全てを取得 -->
{{ range .Resources.GetMatch "logo*" }}
  {{ . }}
{{ end }}

<!-- 当てはまる最初の一つのみを取得 -->
{{ $logo = .Resources.Match "logo*" }}
{{ $logo.ResourceType }}
```

### コンテンツを表示

Page Resources = カレントページから見た他の page, images, pdfs, etc...

```html
{{ range .Resources.ByType "image" }}
  {{ .Content }}
{{ end }}
```

## Themes

- [テーマの一覧](https://themes.gohugo.io/)
- テーマごとに設定方法が異なるため、README.md をよく読むこと

### インストール方法

git の submodule 機能を使ってインストールするとよい。

```bash
git submodule add ${GIT_REPO_OF_THEME} themes/${THEME_NAME}
echo 'theme = "THEME_NAME"' >> config.toml
```

### テーマの Config

テーマ自身も`config.toml`を持つことができる。ただし、設定できる項目は下記だけ。

- `params` (global and per language)
- `menu` (global and per language)
- `outputformats` and `mediatypes`

### 複数のテーマを使う

- 複数のテーマを指定した場合は、マージされる。左側が優先される。
  - `i18n`, `data`, `config.toml`は deep merge される。
  - `static`, `layouts`, `archetypes`はファイルベースで merge される。

```toml
theme = ["my-shortcodes", "base-theme", "hyde"]
```

## Content Management

### Page Bundles

Page Resources を管理する方法のこと。下記の赤い枠が Page Bundles を表す。

![page bundles](https://d33wubrfki0l68.cloudfront.net/9d9313498c287a3dc722f4202a8f4eddee46f4bf/8f7e9/content-management/organization/1-featured-content-bundles_hu3e3ae7839b071119f32acaa20f204198_63640_300x0_resize_catmullrom_2.png)

#### Leaf Bundle

- `content`フォルダ内の`index.md`を含むフォルダのこと
- `single`レイアウトが使用される
- ネストできない
- レイアウトファイルにおいて、page, non-page(images, PDFs, etc...) のどちらもリソースとして使用できる。

#### Branch Bundle

- `content`フォルダ内の`_index.md`を含むフォルダのこと
- `list`レイアウトが使用される
- 他のコンテンツを列挙したい時に使う
- レイアウトファイルにおいて、page はリソースとして使用できない。

### Front Matter

#### Pre-defined

[一覧](https://gohugo.io/content-management/front-matter/#front-matter-variables)

特に`weight`は並び替えによく使う。

#### User-defined

ユーザ定義の Front Matter を記述することもできる。その場合、テンプレートから`.Params.some_frontmatter_name`でアクセスできる。

### Page Resources

カレントページから利用できる、画像、他のページ、PDF 等ドキュメントのこと。
`.Resources`でリソースの配列を取得できる。

#### Properties

- ResourceType
- Name
- Title
- Permalink
- RelPermalink
- Content

#### Methods

- ByType
- Match
- GetMatch(`match`と同じだが、最初のひとつだけを取得する点が異なる)

### Image Processing

画像処理には`Resize`, `Fit`, `Fill`の 3 種類がある。オプションについては[ドキュメント](https://gohugo.io/about/new-in-032/#image-processing-options)を参照すること。

#### Resize

```html
{{ $logo.Resize "200x" }} // アスペクト比は維持される
{{ $logo.Resize "200x100" }} // アスペクト比は変更される
```

#### Fit

指定したサイズで、かつサイズ内に収まるように画像を縮小する。アスペクト比は維持される。

```html
{{ $logo.Fit "200x100" }}
```

#### Fill

指定したサイズで、かつサイズ全体が埋まるように画像を切り出す。アスペクト比は維持される。

```html
{{ $logo.Fill "200x100" }} // 真ん中を基準にして切り出し
{{ $logo.Fill "200x100 right" }} // 右端を基準にして切り出し
{{ $logo.Fill "200x100 left" }} // 左端を基準にして切り出し
```

#### 画像の表示

```html
<img src="{{$logo.RelPermalink }}" />
```

#### 処理後の画像の取扱い

処理された画像は`/resources`フォルダに格納される。
Hugo のパフォーマンスが向上するため、このフォルダは、git の管理対象としたほうがよい。

### Shortcode

Markdown の中で使えるスニペット。2 つの呼び出し方がある。

```html
<!-- 中のコンテンツがMarkdownの場合 -->
{{% mdshortcode %}} **something** {{% /mdshortcode %}}

<!-- 中のコンテンツの処理が必要ない場合 -->
{{< highlight go >}} somethin {{< /highlight >}}
```

#### Built-in Shortcode

[一覧](https://gohugo.io/content-management/shortcodes/#use-hugo-s-built-in-shortcodes)

- figure
- gist
- highlight(コードハイライト)
- instagram
- ref, relref(リンクの作成)
- tweet
- vimeo
- youtube

### Sections

- `content`フォルダ内のフォルダが section になる
- 第一階層のフォルダが **root sections** になる
- section は branch bundles である必要があるため、フォルダ内に`_index.md`を作成すること。`index.md`を作成した場合は、leaf bundles になる。
- section は、入れ子にできる。この際、最下層の section は必ず`_index.md`を持たなければならない。
- section は、front matter で上書きできない

#### Section Page で使える Variables

- `.CurrentSection` 現在のページのカレントセクションを取得する。現在のページがセクションページやホームページだった場合、自分自身を返す。
- `.InSection $anogherPage` あるページが現在のセクションに属するか判定する
- `.IsAncestor $anotherPage` あるページが現在のセクションの祖先に当たるか判定する
- `.IsDescendant $anotherPage` 現在のページが有るページの子孫に当たるか判定する
- `.Parent` 現在のページが属する root section を取得する
- `.Sections` 現在のセクションに属する子セクションを取得する

### Content Type

#### どのように決まるか

デフォルトでは、セクション名が自動的に Content Type として設定される。
例えば、posts セクションの Content Type は`posts`になる。
front matter で上書きすることもできる。

#### Type が使われる場面（archetypes）

Content Type は archetype の判定に使用されている。
例えば、`hugo new posts/my-first-post.md`を実行したとき、archetype は下記の順で使用される。

- archetypes/posts.md
- archetypes/default.md
- themes/my-theme/archetypes/posts.md
- themes/my-theme/archetypes/default.md

#### Type が使われる場面（レイアウト）

Content Type により、使用されるレイアウトファイルが決まる。
例えば、`content/events/my-first-event.md`で使われるレイアウトは下記の順で決定される。

- layouts/event/single.html (singular name が優先される)
- layouts/events/single.html
- layouts/\_default/single.html

### Taxonomies

デフォルトで、`tags`,`categories`による分類ができるようになっている。
Taxonomies の指定は、front matter で行う。

```yaml
tags:
  - nginx
  - kubernetes
categories:
  - development
```

カスタム Taxonomies を追加する場合は、下記のように config を設定する。
左側は単数形で記載すること。

```toml
[taxonomies]
  category = "categories"
  tag = "tags"
  mytag = "mytags"
```

taxonomy templates が存在する場合、Hugo は下記のページを生成する。例えば、categories の場合。

- `example.com/categories/` カテゴリの一覧
- `example.com/categories/nginx` 特定カテゴリに該当する記事の一覧

### Content Summaries

`.Summary`でページの要約を取得できる。記事の最初の 70 ワードが要約として作成される。
日本語で使う場合は`hasCJKLanguage`オプションを有効にすること。

[カスタマイズ](https://gohugo.io/content-management/summaries/#user-defined-manual-summary-splitting)も可能。

```html
{{ range first 10 .Pages }}
  <div>{{ .Summary }}</div>

  {{ if .Truncated }}
    <div>Read More…</div>
  {{ end }}
{{ end }}
```

- `.Pages` ページの一覧を取得
- `.Summary` 要約を取得
- `.Truncated` 続きがあるか

### Links

`ref`又は`relref`というショートコードを使うことで、Markdown ファイル内でリンクを作成できる。

```md
{{< ref "document.md#anchor" >}}
{{< relref "document.md#anchor" >}}

<!-- 他言語バージョンへのリンク -->

{{< relref path="document.md" lang="jp" >}}

<!-- 出力形式の指定 -->

{{< relref path="document.md" outputFormat="rss" >}}
```

### URL

#### Permalinks

Permalink の形式を帰る場合は、Config に下記の通り記載する。
section 又は taxonomies ごとに指定する。

```toml
[permalinks]
  post = "/:year/:month/:title/"
```

[使用できる変数の一覧](https://gohugo.io/content-management/urls/#permalink-configuration-values)

#### Aliases

古いページから新しいページにリダイレクトさせたいときに使う。
新しいページ側の front matter に下記の通り記述する。

```yaml
# /posts/post2に下記の通り記載すると、post1=>post2にリダイレクトされる
aliases:
  - /posts/post1
```

#### Pretty URL & Ugly URL

URL の形式を config や front matter で設定できる。

```txt
# Pretty
example.com/posts/
example.com/posts/post-1/

# Ugly
example.com/posts.html
example.com/posts/post-1.html
```

### Menu

- `.Site.Menu`でアクセスできる。
- メニューの定義は front matter もしくは Config に記載する。
- Menu Templates の定義も必要となる。
- 入れ子にしたい場合は`parent`フィールドで親を指定する。

```toml
[menu]

  [[menu.main]]
    identifier = "about"
    name = "about hugo"
    pre = "<i class='fa fa-heart'></i>"
    url = "/about/"
    weight = -110

  [[menu.main]]
    name = "getting started"
    pre = "<i class='fa fa-road'></i>"
    url = "/getting-started/"
    weight = -100
```

### Multilingual Mode

#### 多言語環境のセットアップ

多言語対応を有効にする、もしくは言語ごとに Config の設定を変えたいときには、Config に`languages`セクションを記載する。

```yaml
DefaultContentLanguage: en
languages:
  en:
    params:
      linkedin: https://linkedin.com/whoever
    title: My blog
    weight: 1
  fr:
    params:
      linkedin: https://linkedin.com/fr/whoever
      navigation:
        help: Aide
    title: Mon blogue
    weight: 2
params:
  navigation:
    help: Help
```

`languages`ブロックに記載のないものは、グローバルの値にフォールバックされる。
デフォルト言語のパスは`/posts/post-1`、その他の言語のパスは`/ja/posts/post-1/`のようにマップされる。

言語ごとのコンテンツの作成方法は、ファイルで分ける方法とフォルダで分ける方法がある。
対応言語が 2 言語くらいなら、ファイルで分けたほうが楽でよい。
この方法は、マークダウン以外にも、画像ファイルや PDF ファイルにも適用できる。

- `/content/about.en.md` => `example.com/about/`
- `/content/about.ja.md` => `example.com/about/ja/`

#### 変数

- `.IsTranslated` 現在の記事が翻訳されたものか
- `.Lang` 現在のページの言語を取得
- `.Translations` 現在の記事の他の言語のページ一覧を取得
- `.AllTranslations` 現在の記事の全ての言語のページ一覧を取得（自身含む）

#### 単語の翻訳

プロジェクトのルートに`i18n`フォルダを作り、`en.toml`, `ja.toml`などのファイルを作る。

`other`と`one`が使えるが、いまいち意味がよく分からない。

```toml
[home]
  other = "Home"
[wordCount]
  other = "This article has {{ .WordCount }} words."
```

テンプレートの中で、下記のようにして使う。

```html
{{ i18n "home" }}
{{ i18n "wordcount" . }} <!-- コンテキスト「.」を渡している点に注目 -->
```

#### 日時の翻訳

[こちら](https://gohugo.io/content-management/multilingual/#customize-dates)を参照

### Menu の翻訳

`languages`セクションの下に、各言語ごとのメニューを定義する。
定義の方法は通常と同じ。

```toml
defaultContentLanguage = "en"

[languages.en]
weight = 0
languageName = "English"

  [[languages.en.menu.main]]
  url    = "/"
  name   = "Home"
  weight = 0

[languages.de]
weight = 10
languageName = "Deutsch"

  [[languages.de.menu.main]]
  url    = "/"
  name   = "Startseite"
  weight = 0
```

`.Site.Menus`で、現在の言語のメニューを取得できる。
リンクを作成するときは`absLangURL`or`relLangUrl`ファンクションを使わないと、デフォルト言語にリンクされてしまうので注意。

```html
{{ range .Site.Menus.main }}
  <a href="{{ .URL | absLangURL }}">{{ .Name }}</a>
{{ end }}

<!-- もしくは -->
<a href="{{ $.Site.LanguagePrefix }}/*****"></a>
```

### Syntax Highlighting

Hugo は Chroma をシンタックスハイライターとして使用している。
ハイライトしたいときは`highlight`ショートコードを使う。

```html
{{< highlight go "linenos=table,hl_lines=8 15-17,linenostart=199" >}}
  <!-- ... code -->
{{< / highlight >}}
```

- `linenos` 行番号の表示有無。inline か table が選べる。
- `hl_lines` ハイライトしたい行の番号
- `linenostart` 行の開始番号

なお、ショートコードではなく通常のコードブロックを自動的にハイライトしたい場合は、[オプションを指定](https://gohugo.io/content-management/syntax-highlighting/#highlight-in-code-fences)する。

```yaml
pygmentscodefences: true
```

## Templates

### Go Templates の基本的な使い方

#### 概要

Go Templates は、HTML, variables, functions から構成される。
variables と functions は `{{}}` の中で使用することができる。

```html
{{ .Title }} <!-- predefined variable -->
{{ .$mykey }} <!-- custom variable -->
{{ FUNCTION ARG1 ARG2 ..... }} <!-- function -->
```

メソッドやフィールドには、ドットでアクセスする。

```html
{{ .Params.bar }}
```

`()`は要素をグルーピングする時に使う

```html
{{ if or (isset .Params "alt") (isset .Params "caption") }} Caption {{ end }}
```

#### Variables

テンプレートは必ず[Page variable](https://gohugo.io/variables/page/)を`.`として受け取る。

```html
{{ .Title }}
```

Custom Variable は下記のように使う。`$`が必ず必要。

```html
{{ $address := "123 Main St." }}
{{ $address }}
```

#### Functions

```html
{{ add 1 2 }}
{{ lt 1 2 }} <!-- 1 less than 2 ? -->
```

#### Partials

partials を使うときの記法。

```html
<!-- `layouts/partials/header.html`を取り込みたい場合 -->
{{ partial "header.html" . }}
```

#### Template

[internal templates](https://github.com/gohugoio/hugo/tree/master/tpl/tplimpl/embedded/templates)を使うときの記法。

```html
{{ template "_internal/opengraph.html" . }}
```

#### 繰り返し

```html
<!-- コンテキストを使う場合 -->
{{ range $array }}
    {{ . }} <!-- . は$arrayの中にある各要素を指す -->
{{ end }}

<!-- カスタム変数を使う場合 -->
{{ range $elem_val := $array }}
    {{ $elem_val }}
{{ end }}

<!-- インデックスも使いたい場合 -->
{{ range $elem_index, $elem_val := $array }}
   {{ $elem_index }} -- {{ $elem_val }}
{{ end }}

<!-- マップのkey-valueペアを使いたい場合 -->
{{ range $elem_key, $elem_val := $map }}
   {{ $elem_key }} -- {{ $elem_val }}
{{ end }}
```

#### 条件分岐

`if`, `else`, `with`, `or`, `and` などがある。

::: tip
Go Templates が false と判定するもの

- `false`
- `0`
- 長さが 0 の`array`,`slice`,`map`,`string`
  :::

#### with

要素が存在する場合に処理を行う。内部の`.`は、渡したパラメータにバインドされる（`range`と一緒）。

```html
{{ with .Params.title }}
  <h4>{{ . }}</h4>
{{ else }}
  <h4>no data!</h4>
{{ end }}
```

#### if

with より細かい制御ができる。with と異なり、`.`はパラメータとバインドされない。

```html
{{ if (isset .Params "description") }}
    {{ .Params.description }}
{{ else if (isset .Params "summary") }}
    {{ .Params.summary }}
{{ else }}
    {{ .Params.something }}
{{ end }}
```

#### and, or

```html
{{ if (and (or (isset .Params "title") (isset .Params "caption")) (isset .Params "attr")) }}
```

#### Pipes

```html
<!-- シャッフル -->
{{ (seq 1 5) | shuffle }}

<!-- htmlへのパース -->
{{ index .Params "disqus_url" | html }}

<!-- 条件文を簡単に書く -->
{{ if isset .Params "caption" | or isset .Params "title" | or isset .Params "attr" }}
{{ end }}
```

#### Context(`.`のこと)

`.`は Current Context である。
Current Context とは、現在のページに関連するデータのことである。

range ブロックの中などでグローバルコンテキストにアクセスしたいときは、下記の 2 種類の方法がある。

```html
<!-- グローバルコンテキストをカスタム変数に保存しておく -->
{{ $title := .Site.Title }}

<!-- $.をつかう -->
{{ $.Site.Title }}
```

#### White Space

ビルド時に`{{}}`の周りにホワイトスペースや改行を作りたくないときは、下記のようにする。

```html
<div>
  {{- .Title -}}
</div>

<!-- 上記のコードは下記のHTMLに変換される -->

<div>Hello, World!</div>
```

#### Comments

```html
{{ /* comment */ }}

<!-- htmlコメントを出力したいとき -->
{{ printf "<!-- Our website is named: %s -->" .Site.Title | safeHTML }}
```

なお、HTML コメントの中に Go template は書いちゃだめ。

#### Parameters

config の`params`に記載した key-value => サイトレベルのパラメータ。`.Site.Params`でアクセスする。

front matter に記載した key-value => ページレベルのパラメータ。`.Params`でアクセスする。

### Layout ファイルの選定

Hugoga が、各ページに対応する Layout ファイルを選定する際には、下記の条件を全て考慮したうえで決定される。
わりと複雑なので、詳細は[こちらのページ](https://gohugo.io/templates/lookup-order/)を参照。

#### `Kind`

ページの種類。single page なら`_default/single.html`, list page なら`_default/list.html`が使われる。

#### `Output Format`

name (e.g. rss, amp, html) と suffix (e.g. xml, html)。例えば`index.amp.html`なら、よりマッチするテンプレートが使われる。

#### `Language`

例えば`index.ja.md`など。Output Format と混合して使う場合は、`index.fr.amp.html`のようにしないと適切なテンプレートが選ばれないので注意する。

#### `Layout`

front matter の`layout`に設定されている値

#### `Type`

Type(=Section Name, もしくは front matter で指定した Type)

#### `Section`

Section 名

### Base Template

ベースとなるテンプレートのこと。`block`と`define`を組み合わせて使う。Base Template は複数作成できる。

```html
<!-- layouts/_default/baseof.html -->

{{ block "main" . }}
  <h1>baseof page main!</h1>
{{ end }}

{{ block "footer" . }}
  <h1>baseof page footer</h1>
{{ end }}
```

```html
<!-- layouts/_default/single.html -->

{{ define "main" }}
  <h1>hello from single page</h1>
{{ end }}
```

出力結果

```html
<h1>hello from single page</h1><!-- 上書きされている -->
<h1>baseof page footer</h1>
```

### List Page Template

homepage, section page, taxonomy list, taxonomy terms で使用されるレイアウト。

![構成](https://d33wubrfki0l68.cloudfront.net/e3428363f0d3688d9c701cb40df92458b1fbe3e2/b6695/images/site-hierarchy.svg =500x)

#### `_index.md`について

セクションごとのページ、例えば`example.com/posts/`は、`_index.md`の有無にかかわらず、
list templates を使って自動的に作成される。
`_index.md`が存在しなかった場合は、`.Title`にセクション名をセットしただけのコンテキストが、テンプレートに渡される。

#### 並べ替え

デフォルトでは、Weight > Date > LinkTitle > FilePath の順で並ぶ。
カスタムするには下記のプロパティを使う。

- `.Pages.ByWeight`
- `.Pages.Date`
- `.Pages.ByPublishDate`
- `.Pages.ByExpiryDate`
- `.Pages.ByLastmod`
- `.Pages.ByLength`
- `.Pages.ByTitle`
- `.Pages.ByLinkTitle` linktitle がなければ title が使われる
- `.Pages.ByParam "rating"`
- `.Pages.Pages.ByDate.Reverse` 逆順

#### グルーピング

```html
{{ range .Pages.GroupBy "Section" }}
  {{ .Key }} <!-- セクション名 -->

  {{ range .Pages }}
    {{ . }}<!-- セクションごとの個別ページ -->
  {{ end }}
{{ end }}
```

- `.Pages.GroupBy "Section"`
- `.Pages.GroupByDate "2006-01"` 2006-01 部分はフォーマットを指定しているだけで実際に使われる値ではないので注意
- `.Pages.GroupByPublishDate "2006-01"`
- `.Pages.GroupByParam "param_key"`
- `.Pages.GroupByParamDate "param_key" "2006-01"`

#### where

3 つの引数を取る。

1. `array` or `slice of maps or structs`
1. `key` or `field name`
1. `match value`

```html
{{ range where .Pages "Section" "post" }
```

#### first

```html
{{ range first 10 .Pages }}
```

#### 合わせ技

```html
{{ range first 5 (where .Pages "Section" "post").ByTitle }}
```

### Homepage Template

ホームページ（`content/_index.md`）にだけ別のレイアウトを適用したい時に使う。`layouts/index.html`に配置する。

Homepate Template では、サイト内の全てのページを`.Pages`で取得できる

### Section Template

homepage, page, section, taxonomy, taxonomyTerm で使われる。`.Pages`で配下のコンテンツを取得できる。

Hugo の全てのページは、ページの種類を表す`.Kind`変数を持っている。
`home`,`page`,`section`,`taxonomy`,`taxonomyTerm`のいずれか。
特定の Kind の中の、特定の値のページを抜き出すときは`.Site.GetPage`を使う。

```html
{{ .Site.GetPage "section" "posts" }}
{{ .Site.GetPage "page" "search" }}
```

### Taxonomy Templates

taxonomy では下記の 3 つのテンプレートが使われる。

- taxonomy list template
- taxonomy terms template
- single page template

#### taxonomy list template

list templates と一緒。

`.Data.Terms`で terms を取得できる。terms で使えるメソッドは以下の通り。

- `.Get(term)`
- `.Count(term)`
- `.Alphabetical`
- `.ByCount`
- `.Reverse`

#### taxonomy terms template

- `.Term` 現在のページの term を取得
- `.WeightedPages` 現在のページの term に当てはまる(weight つきの)ページ一覧
- `.Count` 現在のページの term に当てはまるページ数
- `.Pages` 現在のページの term に当てはまるページ一覧

#### single page template

- `.Params.tags` 設定されている term の一覧を取得

#### その他

taxonomy の切り出し方など、詳細は[ドキュメント](https://gohugo.io/templates/taxonomy-templates/)を参照

### Single Page Templates

page variables と site variables が使える。以上。

### Content View Templates

コンテンツを変形して表示させたい時に使う。`.Render`という特別なメソッドを使う。
Content View Template には、呼び出し元の`.`が自動的に渡される。

```txt
▾ layouts/
  ▾ post/
      li.html       <= content view template
      list.html
      summary.html  <= content view template
```

```html
<!-- list.html -->

<h1 id="title">{{ .Title }}</h1>

{{ range .Pages }}
  {{ .Render "summary"}}
{{ end }}

<!-- summary.html -->
<article class="post">
  {{ .Title }} - {{ .Summary }}
</article>
```

### Data Templates

`data`フォルダに配置した yaml, json, toml は、テンプレートから`.Data[.path].filename.keyname`でアクセスできる。

動的に JSON や CSV を取得することもできる。ただし、認証は使えず、Method も GET のみ。

```html
{{ $data := getJSON "url" }}
{{ $data := getCSV "separator" "url" }}
```

### Partial Templates

レイアウトの一部分を担うテンプレートである。`layouts/partials`に配置する。
partial は、コンテキストが引数として渡されていない限り、いかなるコンテキストにもアクセスできないので注意する。

```html
<!-- 呼び出し元テンプレート -->

{{ partial "path/filename.html" . }}
<!-- or -->
{{ partial "path/filename.html" (dict "key1" "value1" "key2" "value2") }}
```

```html
<!-- partial -->
<h1>{{ .Title }}</h1>
```

### Shortcode Templates

**Markdown ファイルの中**で使うためのテンプレート。`layouts/shortcodes/`に配置する。

#### named args

```html
<!-- markdown -->
{{< mycode color="red">}}

<!-- short code -->
<p style="color:{{ .Get color }}" />
```

#### positional args

```html
<!-- markdown -->
{{< mycode red>}}

<!-- short code -->
<p style="color:{{ .Get 0 }}" />
```

#### Inner

```html
<!-- markdown -->
{{< mycode >}}
  some contents
{{< /mycode >}}

<!-- markdown(処理が必要な場合) -->
{{% mycode %}}
  **some contents**
{{% /mycode %}}

<!-- short code -->
<p>{{ .Inner }}</p>
```

#### shortcodes の中で使える変数

- `$.Params` shortcode に渡された値
- `$.Page.Params` shortcode の呼び出し元マークダウンの front matter を取得
- `$.Page.Site.Params` サイトレベルの Par

### Local File Templates

ローカルファイルやフォルダからデータを取得できる。必要になった時に[ドキュメント](https://gohugo.io/templates/files/)を読む。

### 404 Page

カスタムしたい場合は`layouts/404.html`を作成する。

### Menu Templates

メニューは`partials`を使って作成することが多い。項目は Config で設定することが多い。
下記の変数を組み合わせて作成する。詳細は[ドキュメント](https://gohugo.io/templates/menu-templates/)参照。

- `.Site.Menus.main`
- `.Site.Menus.main.HasChildren`
- `.HasMenuCurrent`
- `.IsMenuCurrent`

なお、多言語対応環境でリンクを作成するときは、`absLangURL` or `relLangUrl`を使うこと。

### Pagination

config で下記のように設定する。

```yaml
paginate: 10 # デフォルト
paginatePath: page # デフォルト　post/1/ など
```

`Paginator`を使う簡単な方法と、`Paginate`を使う詳細な方法の、二通りある。

```html
<!-- Paginator -->
{{ range .Paginator.Pages }}
{{ range (.Paginator 20).Pages }} <!-- 上限数は上書きできる -->

<!-- Paginate -->
{{ range (.Paginate ( .Pages.ByTitle )).Pages }}
{{ range (.Paginate ( .Pages.ByTitle ) 20).Pages }} <!-- 上限数は上書きできる -->
```

テンプレートの書き方。ビルトインテンプレートを使う。
自身で作る場合は[ドキュメント](https://gohugo.io/templates/pagination/#build-the-navigation)を読んで頑張る。

```html
{{ template "_internal/pagination.html" . }}

{{ range .Paginator.Pages }}
   {{ .Title }}
{{ end }}
```

### RSS Templates

デフォルトで RSS は自動的に生成される。`example.com/index.xml`, `example.com/posts/index.xml`など。

[ドキュメント](https://gohugo.io/templates/rss/)

### Sitemap Templates

デフォルトで サイトマップ は`example.com/sitemap.xml`に自動的に生成される。

[ドキュメント](https://gohugo.io/templates/sitemap-template/)

### Robots.txt

作成する場合は`layouts/robots.txt`を作成する。

### Internal Templates

ビルトインのテンプレートがあるので、適宜利用する。

- `_internal/disqus.html`
- `_internal/google_news.html`
- `_internal/google_analytics.html`
- `_internal/google_analytics_async.html`
- `_internal/opengraph.html`
- `_internal/pagination.html`
- `_internal/schema.html`
- `_internal/twitter_cards.html`

### デバッグ

下記のようにすると情報が詳細に把握できる。

```html
{{ printf "%#v" . }}
```

## Variables

- [.Site](https://gohugo.io/variables/site/)
- [.Page](https://gohugo.io/variables/page/)
- [Shortcode](https://gohugo.io/variables/shortcodes/)
- [Taxonomy](https://gohugo.io/variables/taxonomy/)
- [Menu](https://gohugo.io/variables/menus/)
