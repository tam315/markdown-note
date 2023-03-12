# Playwright

## Get Started

### Installation

- Playwright は E2E テストのためのツール
- とにかくマルチ
  - マルチブラウザ(含むモバイル)
  - マルチ OS
  - マルチ環境(Local or CI)
  - ヘッドレス or ヘッドフル、
- 初め方 `yarn create playwright`
- テストの実行 `npx playwright test`
- HTML レポートの生成 `npx playwright show-report`

### Writing Tests

- テストは以下の 2 つから構成される
  - アクションの実行
  - アサーションの実行
- アクションを行う際、何かを待つ必要はない
  - [actionability checks](https://playwright.dev/docs/actionability) のおかげ
- レースコンディションを気にする必要もない
  - 理想的な結果を宣言的に記述できるため
- async/await を多用しながらテストを書いていく
- アクションの種類
  - ナビゲーション
    - まずはこれがないと始まらない
    - デフォルトでは次のアクションが実行される前にページがロード状態になるまで自動で待ってくれる
    - ```ts
      await page.goto('https://playwright.dev/');
      ```
  - インタラクション
    - Locators API を使って要素を取得し、その要素に対してアクションを実行する
    - 手順としては、`getByRole` や `getByText` などで要素を取得した後、クリック、チェック、ホバー、Input File のセットなどを実行する
    - ```ts
      await page.getByRole('link', { name: 'Get started' }).click();
      ```
- アサーション
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
