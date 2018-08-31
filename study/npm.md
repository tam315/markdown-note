# npm

[[toc]]

## Publish の方法

### webpack

#### output

ライブラリターゲットは commonjs2 にする。（umd でも可）

```js
const output = {
  path: path.resolve(__dirname, 'dist'),
  filename: 'bundle.js',
  libraryTarget: 'commonjs2',
  publicPath: '/dist/',
};
```

#### externals

バンドルしないファイルを記載する。特に react 関係は必ず外すこと。

```js
const externals = {
  // Don't bundle external libraries
  react: {
    commonjs: 'react',
    commonjs2: 'react',
    amd: 'React',
    root: 'React',
  },
  'react-dom': {
    commonjs: 'react-dom',
    commonjs2: 'react-dom',
    amd: 'ReactDOM',
    root: 'ReactDOM',
  },
  emotion: {
    commonjs: 'emotion',
    commonjs2: 'emotion',
  },
};
```

### .npmignore

yarn add したときに、node_modules に入る必要のないファイルを記載する。
なお、下記のファイルには ignore が効かず、強制的にインストールされる。

- package.json
- README.md
- LICENSE

### package.json

#### scripts

npm に publish する前に必要なコマンドを記載する。

```json
"prepublish": "del-cli dist/**/* && npm run build"
```

#### main

npm package の default export になるべきファイルを記載する。

```json
"main": "dist/bundle.js",
```

#### peerDepenencies

警告表示のみで実際にインストールはしないものを記載（react はこちら）

#### dependencies

実際にインストールするものを記載（絶対に必要なパッケージはこちら）

### npm への publish

```sh
npm login
npm publish
```

### 参考

[React コンポーネントを NPM で公開する方法](https://itnext.io/how-to-package-your-react-component-for-distribution-via-npm-d32d4bf71b4f)

[AMD, CommonJS, and UMD の違い](https://www.davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/)
