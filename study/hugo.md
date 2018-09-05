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
hugo server
```

## Directory Structure

### archetypes

`hugo new post/***`を実行した際にの雛形を管理する。

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

![structure](https://d33wubrfki0l68.cloudfront.net/4c06428897df426b60d300c8f6de175b37d7fdde/637cb/images/hugo-content-bundles.png =300x)

- `content`フォルダ内の全てのファイルは`Resources`になる。Hugo が MIME type を認識できる限り。
- `content`フォルダ直下が`section`になる
- 赤い枠は上から順に
  - home page
  - section page
  - article with a folder
  - regular standalone pages(`posts`フォルダ)

### 全ての Resources を一覧表示

```jsx
{{ range .Resources }}
<li><a href="{{ .RelPermalink }}">{{ .ResourceType }}</a></li>
{{ end }}
```

絶対パスが必要なら`.Permalink`をつかうこと。

### Type を指定して一覧表示

タイプ名は、ページの場合は`page`、その他の場合は `image`や`json`などの MIME タイプで指定する。

```jsx
{{ range .Resources.ByType "image" }}
  {{ .ResourceType }}
{{ end }}
```

### 特定の条件にあてはまる Resouces を一覧表示

例：ファイル名が`logo`で始まるリソースの一覧を表示する

```jsx
{{ $logo := .Resources.GetByPrefix "logo" }}
{{ with $logo }}
{{ end }}
```

### Page Resources のコンテンツを表示

Page Resources = カレントページから見た他の page, images, pdfs, etc...

```jsx
{{ with .Resources.ByType "page" }}
{{ range . }}
<h3>{{ .Title }}</h3>
{{ .Content }}
{{ end }}
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
- `single`レイアウトになる
- ネストできない
- レイアウトファイルにおいて、page, non-page(images, PDFs, etc...) のどちらもリソースとして使用できる。

#### Branch Bundle

- `content`フォルダ内の`_index.md`を含むフォルダのこと
- `list`レイアウトになる
- 他のコンテンツを列挙したい時に使う
- レイアウトファイルにおいて、pageはリソースとして使用できない。

### Front Matter

#### Pre-defined

[一覧](https://gohugo.io/content-management/front-matter/#front-matter-variables)

特に`weight`は並び替えによく使う。

#### User-defined

ユーザ定義の Front Matter を記述することもできる。その場合、テンプレートから`.Params.some_frontmatter_name`でアクセスできる。

### Page Resources

カレントページから利用できる、画像、他のページ、PDF等ドキュメントのこと。
`.Resources`でリソースの配列を取得できる。

#### Properties

- ResourceType
- Name
- Title
- Permalink
- RelPermalink

#### Methods

- ByType
- Match

### Image Processing

画像処理には`Resize`, `Fit`, `Fill`の 3 種類がある。オプションについては[ドキュメント](https://gohugo.io/about/new-in-032/#image-processing-options)を参照すること。

#### Resize

```jsx
{{ $logo.Resize "200x" }} // アスペクト比は維持される
{{ $logo.Resize "200x100" }} // アスペクト比は変更される
```

#### Fit

指定したサイズで、かつサイズ内に収まるように画像を縮小する。アスペクト比は維持される。

```jsx
{{ $logo.Fit "200x100" }}
```

#### Fill

指定したサイズで、かつサイズ全体が埋まるように画像を切り出す。アスペクト比は維持される。

```jsx
{{ $logo.Fill "200x100" }} // 真ん中を基準にして切り出し
{{ $logo.Fill "200x100 right" }} // 右端を基準にして切り出し
{{ $logo.Fill "200x100 left" }} // 左端を基準にして切り出し
```

#### 処理後の画像の取扱い

処理された画像は`/resources`フォルダに格納される。
Hugo のパフォーマンスが向上するため、このフォルダは、git の管理対象としたほうがよい。

### Shortcode

Markdownの中で使えるスニペット。2つの呼び出し方がある。

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