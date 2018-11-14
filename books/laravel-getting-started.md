# Laravel 入門

[[toc]]

## 準備

### セットアップ手順

- Composer をインストール
- `C:/Users/Shota/AppData/Roaming/Composer/vendor/bin`にパスを通す
- `composer global require "laravel/installer=~1.1"`

### 基本

```bash
laravel new ${myProjectName}
php artisan serve # テスト専用コマンドのため、本番環境では使えない
```

### 本番環境のセットアップ（XAMPP の例）

例えば`htdocs`に`my-app`というプロジェクトを放り込んだとすると、`https://some.com/my-app/public`というアドレスでアプリケーションにアクセスできる。

`/my-app/public`を`/`にマップしたい（エイリアスを作りたい）場合は、本書 P20 に記載の設定を Apache の `httpd.conf` に入れること。

## ルーティングとコントローラ

### ルーティング

#### ファイル構成

| name                             | description                                 |
| -------------------------------- | ------------------------------------------- |
| `.env`, `.env.example`           | DB の認証情報など、動作に関する設定ファイル |
| `artisan`                        | `php artisan serve`で使う                   |
| `composer.json`, `composer.lock` | composer がつかう                           |
| `phpunit.xml`                    | ユニットテストに関するファイル              |
| `server.php`                     | サーバ本体                                  |
| `webpack.min.js`                 | webpack の設定ファイル                      |

#### フォルダ構成

`*`マークはよく使うフォルダ。

| name        | description                   |
| ----------- | ----------------------------- |
| `app`       | \* アプリケーションの本体     |
| `bootstrap` | 起動時の処理                  |
| `config`    | 設定                          |
| `database`  | \* DB 関係                    |
| `public`    | そのまま公開するファイル群    |
| `resources` | \* テンプレートなどのリソース |
| `routes`    | \* ルーティング情報           |
| `storage`   | ログなどのファイルの保存場所  |
| `tests`     | ユニットテスト関係            |
| `vendor`    | Laravel 本体のプログラム      |

#### app フォルダ

| name         | description                                                    |
| ------------ | -------------------------------------------------------------- |
| `Console`    | コンソールプログラム                                           |
| `Exceptions` | 例外処理                                                       |
| `Http`       | Web アプリケーションにアクセスしたときの処理。**一番良く使う** |
| `Providers`  | プロバイダ？                                                   |
| `User.php`   | ユーザ認証に関するプログラム                                   |

#### routes フォルダ

| name           | description                                                               |
| -------------- | ------------------------------------------------------------------------- |
| `api.php`      | API の機能を特定のアドレスに割り当てたい時に使う                          |
| `channels.php` | ブロードキャストチャンネルのためのルーティング？                          |
| `console.php`  | コンソールプログラムのためのルーティング？                                |
| `web.php`      | 一般的な Web ページとしてアクセスするときのルーティング。**一番良く使う** |

#### ルーティング設定

テンプレートを使う。下記のように`view`でテンプレートを指定すると、`resources/views/welcome.blade.php`がレンダリングされる。

```php
// routes/web.php

Route::get('/', function() {
  return view('welcome');
});
```

生の HTML を返す

```php
Route::get('/hello', function() {
  return '<h1>Some HTML!</h1>';
});
```

params を受け取る。任意の param には`?`をつける。任意の項目にはデフォルト値をセットしておくと良い。

```php
Route::get('/hello/{msg}/{id}', function($msg, $id){ // 順に渡されるので名前は違ってもOK
    return "<h1>Hello! $msg2 $id</h1>";
});

Route::get('/hello/{msg?}/{id?}', function($msg='a', $id='b'){
    return "<h1>Hello! $msg $id</h1>";
});
```
