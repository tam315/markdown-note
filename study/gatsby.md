---
pageClass: study-notes-class
---

# Gatsby

## 基本

### 初期設定

```sh
npm install --global gatsby-cli

gatsby new tutorial-part-one
https://github.com/gatsbyjs/gatsby-starter-hello-world

cd tutorial-part-one

gatsby develop
```

### フォルダ構成

- `layout/index.js` おおもとになるレイアウト
- `pages/***.js` このフォルダに作成した js ファイルが、自動的に個別ページになる。
- `gatsby-config.js` 設定ファイル

### リンクを張る

```js
import Link from 'gatsby-link';
<Link to="/page-2/">jump to page2</Link>;
```

### プラグインの利用

```sh
yarn add gatsby-plugin-typography
```

gatsby-config.js に利用するプラグインを記載

### Typography.js

https://www.gatsbyjs.org/tutorial/part-two/\#typographyjs

- グローバルな CSS のルールを設定するためのツール。
- プラグインとして利用する。
- React や Gatsby とうまく動くように作られている。
- 美しい表示を簡単に実現できる。例えば、rhythm という概念を使って Line-Height をそろえることなどが簡単にできる。また、既製のテーマもいくつか用意されている。

```jsx
// gatsby-config.js
const plugins = [
  {
    resolve: `gatsby-plugin-typography`,
    options: {
      pathToConfigModule: `src/utils/typography.js`,
    },
  },
];
```

```js
// typography.js;
import Typography from 'typography';
import bootstrapTheme from 'typography-theme-bootstrap';

const typography = new Typography(bootstrapTheme);
// or const typography = new Typography({ baseFontSize: "18px" });

export default typography;
```

### CSS

#### 1. CSS-in-JS

JS の中に CSS を書くこと。例えば Glamor プラグインを使うと、`css`属性を指定してやるだけで Style 属性と同じように CSS を設定できる。この際、Style 属性と違い、すべての CSS（疑似クラス・疑似要素・メディアクエリを含む）を使うことができる。

#### 2. CSS モジュール

https://www.gatsbyjs.org/tutorial/part-two/#css-modules

Gatsby は標準で CSS モジュールに対応している。拡張子を「.module.css」とした CSS ファイルを作成し、JS ファイルにおいて import することで利用できる。

外部ファイルとして用意した CSS を import すると、自動的に重複しないセレクタ名をつけ、クラス名を参照するためのオブジェクトを生成し、グローバルな CSS に組み込むところまでやってくれる。

オブジェクトを className 属性に指定することで CSS を設定する。

### レイアウトコンポーネント

Layout components are sections of your site that you want to share across multiple pages. e.g.) header, footer

`src/layouts/index.js` がレイアウトの基本ファイルになる。なお通常の props.children と違い、**invoke が必要**なので注意。

```js
export default ({ children }) => (
  <div>
    <h3>MySweetSite</h3>
    {children()}
  </div>
);
```

## GraphQL

### データ

データとは、"everything that lives outside a React component".

Gatsby では、データの取得に Facebook の開発した GraphQL を使う。

### メタデータ

サイトタイトルなどのメタデータは、gatsby-config.js に保持しておくとよい。あとから GraphQL で取り出せる。

```js
module.exports = {
  siteMetadata: {
    title: `Blah Blah Fake Title`,
  },
};
```

### 基本的な使い方

クエリ結果は `props.data`に渡される。例えば、メタデータを呼び出す場合の例は下記の通り。なお、`graphql`は gatsby が自動でパースするので、手動で import する必要はない。クエリ名は何でも OK っぽい。

```js
// gatsby-config.js
module.exports = {
  siteMetadata: {
    title: 'Pandas Eating Lots',
  },
};
```

```js
// index.js
export default ({ data }) => (
  <div>
    <h1>About {data.site.siteMetadata.title}</h1>
  </div>
);

export const query = graphql`
  query LayoutQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
```

### GraphiQL

GraphiQL is the GraphQL integrated development environment (IDE). It's a powerful (and all-around awesome) tool you'll use often while building Gatsby websites.

http://localhost:8000/___graphql　でアクセスできる。

- 主要コマンド
  - Ctrl+Space オートコンプリート
  - Ctrl+Enter クエリ実行

### Source Plugins

GraphQL でデータを取得するためには、取得先に応じたプラグインを使用する。

(note) source plugins can live reload data. E.g.
gatsby-source-filesystem is always scanning for new files to be added
and when they are, re-runs your queries.

(note) what is 'node'? =\> node is a fancy name for an object in a
"graph"

例えば gatsby-source-filesystem を使うと、ローカルファイルの情報を GraphQL で取得できるようになる。

```js
// gatsby-config.js;
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'src',
        path: `${__dirname}/src/`,
      },
    },
  ],
};
```

```js
// src/pages/index.js
import React from 'react';

export default ({ data }) => {
  return (
    <div>
      {data.allFile.edges.map(({ node }, index) => (
        <tr>
          <td>{node.relativePath}</td>
          <td>{node.prettySize}</td>
          <td>{node.extension}</td>
          <td>{node.birthtime}</td>
        </tr>
      ))}
    </div>
  );
};

export const query = graphql`
  query MyFileQuery {
    allFile {
      edges {
        node {
          relativePath
          prettySize
          extension
          birthtime
        }
      }
    }
  }
`;
```

### Transformer plugins

Source plugins bring data into Gatsby's data system and **transformer plugins** transform raw content brought by source plugins.

E.g. Markdown =\> HTML

The combination of source plugins and transformer plugins can handle all data sourcing and data transformation you might need when building a Gatsby site.

```js
// gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-transformer-remark',
    },
  ],
};
```

これだけで、先ほどの gatsby-source-filesystem と連携して、md ファイルを HTML で取り出すことができるようになる。

```js
# クエリ結果
{
  "data": {
    "markdownRemark" : {/* ... */}, // transformar added
    "allMarkdownRemark": { // transformar added
      "edges": [
        {
          "node": {
            "frontmatter": {
              "title": "Sweet Pandas Eating Sweets",
              "date": "2017-08-10",
              "_PARENT": "C:/Users/Shota/Desktop/tutorial-part-four/src/pages/sweet-pandas-eating-sweets.md absPath of file",
              "parent": "C:/Users/Shota/Desktop/tutorial-part-four/src/pages/sweet-pandas-eating-sweets.md absPath of file"
            },
            "html": "<p>Pandas are really sweet.</p>\n<p>Here's a video of a panda eating sweets.</p>\n<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/4n0xNbfJLR8\" frameborder=\"0\" allowfullscreen></iframe>",
            "id": "C:/Users/Shota/Desktop/tutorial-part-four/src/pages/sweet-pandas-eating-sweets.md absPath of file >>> MarkdownRemark"
          }
        }
      ]
    }
  }
}
```

### クエリオペレータ

クエリを実行する際、sort, filter, order, skip,
limit などのオペレータを使用できる。

```js
allMarkdownRemark(sort: {fields: [frontmatter___date], order: DESC}) {…}
```

### 動的にページを作る

Gatsby lets you use GraphQL to query your data and map the data to pages---all at **build time**

1.  ビルド時

    1.  ノード作成時の処理（onCreateNode）

        特定のノードタイプ（Markdown など）だったとき、slug をフィールドとして追加で埋め込む。

    2.  ページ作成の処理（createPages）

        クエリを実行して先ほどの slug の情報を取り出し、新しいページを作成する。

        - path を slug に設定する
        - どのテンプレートを使うか設定する
        - slug の情報をページクエリ時に使えるように`context`として埋め込む

2.  閲覧時

    context に埋め込まれた slug の情報を元にクエリを実行し、得た結果を画面上に表示する

```jsx
// gatsby-node.js
const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');

exports.onCreateNode = ({ node, getNode, boundActionCreators }) => {
  const { createNodeField } = boundActionCreators;

  if (node.internal.type === 'MarkdownRemark') {
    const slug = createFilePath({ node, getNode, basePath: 'pages' });

    createNodeField({
      node,
      name: 'slug',
      value: slug,
    });
  }
};

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators;

  return new Promise((resolve, reject) => {
    graphql(`
      {
        allMarkdownRemark {
          edges {
            node {
              fields {
                slug
              }
            }
          }
        }
      }
    `).then(result => {
      result.data.allMarkdownRemark.edges.forEach(({ node }) => {
        createPage({
          path: node.fields.slug,
          component: path.resolve(`./src/templates/blog-post.js`),
          context: {
            // Data passed to context is available in page queries as GraphQL variables.
            slug: node.fields.slug,
          },
        });
      });

      resolve();
    });
  });
};

module.exports = exports;
```

```jsx
// templates/blog-post.js
import React from 'react';

export default ({ data }) => {
  const post = data.markdownRemark;
  return (
    <div>
      <h1>{post.frontmatter.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </div>
  );
};

export const query = graphql`
  query BlogPostQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
    }
  }
`;
```

## NetlifyCMS

### セットアップ方法

セットアップ方法は下記に記載されている。

https://www.netlifycms.org/docs/add-to-your-site/

1.  **NetlifyCMS のための設定ファイル作成**\
    所定の設定を行うこと。All Netlify CMS files are contained in a
    static `admin` folder. E.g. as gatsby, static folder is
    `/static`

    - `/static/admin/index.html`
    - `/static/admin/config.ytml`

2.  **Netlify の初期設定**\
    Github に Gatsby のレポジトリをプッシュしたうえで、Netlify のコンソールから指示に従って設定を行うだけ。

3.  **Netlify の認証に関する設定**

    - 「Identity」のサービスを有効にする

    - 編集ユーザの設定\
       「Registration
      preferences」において、全ユーザにアクセスを許すか、特定のユーザにアクセスを許すか選択する。

    - 編集ユーザの認証に関する設定\
       Google 認証等が必要であれば、「External Providers」に追加する。

    - 「Git
      Gateway」を有効にする。（Netlify が Github リポジトリを扱うための認証に関する設定

    - Netlify コンソールの Identity タブからユーザを招待する。

4.  **Netlify Identity を使用するための JS ウィジェットを配置**\
    ソースコードに直接記載してもよいが、Netlify の「Script
    Injection」を使うと、自動的にすべてのページに挿入してくれるので非常に便利。

5.  **リダイレクト設定**\
    CMS のログイン後はホームページに移動してしまうので、CMS に移動するスクリプトを BODY タグの直前に記載しておく。
