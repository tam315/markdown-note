# Jest

[[toc]]

## セットアップ

- デフォルトの設定では、同時に複数のテストを実行する。DB 操作を伴うテスト等では失敗の原因になるので、`--runInBand`(or `-i`)オプションをつけて、1 つずつテストを実行すること。

- テストのセットアップファイルの指定は、`package.json` の`setupTestFrameworkScriptFile` で行う。

### babel 関係

```bash
yarn add babel-core babel-jest babel-preset-env regenerator-runtime
```

.babelrc

```json
{
  "presets": ["env"]
}
```

## コンポーネントのモック

```jsx
// Auto Mock
// (インポートしたクラスのすべてのファンクションが自動的にモックされ
//  undefinedを返すようになる)
jest.mock('../PageViewPostsGrid');

// コンポーネントがClassではなくFunctionの場合は、renderメソッドのMockが必要
beforeAll(() => {
  PageViewPostsGrid.mockImplementation(() => ({
    render: () => <div>mock</div>,
  }));
});
```

## setImmediate 等

setImmediate, setTimeout, process.nextTick を使うときは、必ず done()を併用すること。さもないと、テストが落ちたり、expect の挙動もおかしくなった。

## Enzyme

[Shallow Rendering 参考記事](https://brewhouse.io/2016/03/18/accelerate-your-react-testing-with-enzyme.html)
