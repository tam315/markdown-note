# Playwright

## Installation

- Playwright は E2E テストのためのツール
- とにかくマルチ
  - マルチブラウザ(含むモバイル)
  - マルチ OS
  - マルチ環境(Local or CI)
  - ヘッドレス or ヘッドフル
- 基本コマンド
  - `yarn create playwright` 初める
  - `npx playwright test` テストの実行
  - `npx playwright show-report` HTML レポートの生成

## Writing Tests

- テストは以下の 2 つから構成される
  - アクションの実行
  - アサーションの実行
- アクションを行う際、何かを待つ必要はない
  - [actionability checks](https://playwright.dev/docs/actionability) のおかげ
- レースコンディションを気にする必要もない
  - 理想的な結果を宣言的に記述できるため
- async/await を多用しながらテストを書いていく

### Actions

- ナビゲーション
  - まずはこれがないと始まらない
  - デフォルトでは次のアクションが実行される前にページがロード状態になるまで自動で待ってくれる
  - ```ts
    await page.goto('https://playwright.dev/');
    ```
- インタラクション
  - Locators API を使うことで、要素の取得と、取得した要素に対してのアクション実行を行う
  - 手順としては、`getByRole` や `getByText` などで要素を取得した後、クリック、チェック、ホバー、Input File のセットなどを実行する
  - ```ts
    await page.getByRole('link', { name: 'Get started' }).click();
    ```

### Assersions

- アサーションの種類
  - sync matchers `expect(success).toBeTruthy();`
  - async matchers `await expect(page).toHaveTitle('Playwright');`
    - async matchers はテストを堅牢にし、フレーキーになることを防ぐために重要
- テストの独立性
  - テストごとに独自のブラウザインスタンスを使用し、独自のページを開き、独自のステートを保持するため、異なるテスト間で状態が共有されないようになっている
- Test Hooks が色々ある
  - `test.describe`
  - `test.beforeEach`
  - `test.afterEach`
  - `test.beforeAll`
  - `test.afterAll`

## Running Tests

- 1 つのテスト or いくつかのテスト or 全てのテストを実行できる
- 一つのブラウザ or 複数のブラウザでテストできる
- デフォルトではヘッドレスモードで実行される
  - (ブラウザのウィンドウを開かず CLI で完結するモード)
- VSCode Extension を使うことで Breakpoint などを活用しながらテストができる

### CLI

```sh
# 全てのテスト
npx playwright test

# 1 つのテスト
npx playwright test some.spec.ts

# いくつかのテスト
npx playwright test tests/todo-page/ tests/landing-page/

# ファイル名にlogin又はlandingを含むテスト
npx playwright test login landing

# テストのタイトルが特定の文字列を含むテスト
npx playwright test -g "add a todo item"

# headedモードで実行
npx playwright test some.spec.ts --headed

# 特定のプロジェクト
npx playwright landing-page.ts --project=chromium
```

### Debugging

- デバッグの方法
  - console.log
  - VSCode Extension
  - Playwright Inspector
    - Playwright API コールのステップ実行、デバッグログの表示、ロケータの探索

```sh
# デバッグする
npx playwright test --debug
npx playwright test some.spec.ts --debug

# 特定の行からデバッグする
npx playwright test some.spec.ts:10 --debug
```

### Test Reports

- HTML レポートを生成することができる。レポートは以下の情報を含む。
  - テストの名前
  - テストファイルの名前
  - 行番号
  - ステップごとのテストの実行時間
  - ブラウザ名
- フィルタリングができる
  - 失敗したテスト、スキップしたテスト、Flaky なテスト
  - ブラウザの種類
- Search Bar での検索ができる
- テストが失敗すると自動的にレポートが開かれる。手動で開くには`npx playwright show-report`を実行する。

## Test Generator

- Playwright にはテストを自動生成する機能が備わっている
- イメージ的には Excel の「マクロ記録」みたいなもの
- 2 つのウィンドウを使いながらテストを書いていく
  - 1 つ目はブラウザウィンドウ
    - テストしたい Web サイトを実際に操作する
  - 2 つ目は Playwright Inspector
    - テストの記録、クリップボードへのコピー、クリアなどを行う

動画：
https://user-images.githubusercontent.com/13063165/197979804-c4fa3347-8fab-4526-a728-c1b2fbd079b4.mp4

## Trace Viewer

- 記録した Playwright Trace を探索するための GUI tool
- 各アクションの間を行ったり来たりしながら、各アクションの間で何が起こったのかを視覚的に確認することができる

### Recording a Trace

- Trace File は`trace.zip`という名前で保存される
- デフォルトでは以下の設定になっている
  - 任意のテストが失敗したのち、1 回目の再試行時に Trace が作成される(`on-first-retry`)、2 回目以降では作成されない
  - リトライは CI では 2 回、ローカルでは 0 回行う
- Trace の作成は通常はデフォルトでは CI で行われるが、ローカルでも実行したい際には以下のようにする
  - ```sh
    npx playwright test --trace on
    ```

### Trace を見るには

- HTML レポートの詳細画面から'Traces'を開いたのち、アクションをクリックするかタイムラインをホバーする
- 各ステップごとに以下を確認できる
  - そのステップが完了したときの DOM の状態
    - DOM スナップショットが復元されるため、インスペクタを開けば DOM の状態を完全に確認することができる（コレマジゴイスー）
  - コンソール出力
  - テストファイルのソースの該当行
  - 行われたネットワーク通信

## CI

### Github Actions の設定

- [サンプルの CI ファイル](https://playwright.dev/docs/ci-intro#github-actions)が用意されている
- テストを実行したのち`playwright-report` フォルダに出力されたログを、Artifact として残す設定になっている

### CI で出力された HTML Report をローカルで見るには

- Github Actions の Artifacts のセクションから`playwright-report`をダウンロードして任意の場所に解凍する。該当の Git のローカルリポジトリに置くのがおすすめ。
- 以下のコマンドで HTML レポートを開く
- ```sh
  npx playwright show-report path/to/extracted-playwright-report
  ```

## VSCode

VSCode に Playwright を使うための拡張機能を入れておくと色々と便利

### テストの実行

- テストタブやテストファイルの左側に表示される三角ボタンから実行できる

### デバッグ

- エラー発生時には、期待と実際の差分と、コールスタックが表示される
- ライブデバッグ
  - `Show Browser`オプションを有効にした状態でテストを終えると、コード上のロケータをクリックした際に、ブラウザ上にそれがハイライト表示される
- デバッグモード
  - 三角ボタンを右クリックして`Debug Test`を選択すると、デバッグモードでテストが実行される
  - ブレークポイントを使用して 1 ステップずつ画面を確認しながらテストを実行することができる
- ライブデバッグとデバッグモードを組み合わせると最強
