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

#### 特定の単語の翻訳

プロジェクトのルートに`i18n`フォルダを作り、`en.toml`, `ja.toml`などのファイルを作る。

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
