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
php artisan serve # テスト専用コマンドである。本番環境では使うな。
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
| `artisan`                        | `php artisan ***`のようにして使う           |
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
| `Console`    | コンソールプログラム？                                         |
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

### コントローラ

#### MVC

```txt
User <-> Controller <-┬-> View  <-> Templates
                      │
                      └-> Model <-> Database
```

#### コントローラの作成

```bash
php artisan make:controller HelloController
```

これで下記のコントローラが作成される

```php
// app/Http/Controllers/HelloController.php

namespace App\Http\Controllers; // 名前空間の指定

use Illuminate\Http\Request; // Requestオブジェクトを使えるよう設定

class HelloController extends Controller {}; // コントローラ本体
```

#### アクションの追加

アクション＝コントローラに用意される処理のこと。名前を変えることで、複数設定できる。インスタンスメソッドとして実装する。

```php
// controller

class HelloController extends Controller
{
    public function index() {
        return <<<EOF
<h1>ID: $id</h1>
<h1>Pass: $pass</h1>
EOF;
    }
}
```

コントローラをルーティング設定に記載する。

```php
// routes/web.php

Route::get('/hello', 'HelloController@index');
```

#### シングルアクションコントローラ

一つしかアクションを持たないクラスの場合、`__invoke()`メソッドを実装することで記載を簡略化できる。

```php
// controller

class HelloController extends Controller
{
    public function __invoke() {
        return '<h1>something</h1>';
    }
}
```

ルーティング設定ではメソッド名を省略する。

```php
// routes/web.php
Route::get('/hello', 'HelloController');
```

#### アクションで params を受け取る

```php
// controller

class HelloController extends Controller
{
    public function index($id='defualtId', $pass='defaultPass') { /* do something */}
}
```

```php
// routes/web.php
Route::get('/hello/{id?}/{pass?}', 'HelloController@index');
```

#### Request, Response の利用

```php
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class HelloController extends Controller
{
    public function index(Request $request, Response $response) {
        $html = <<<EOF
<h1>Request</h1>
<pre>$request</pre>
<h1>Response</h1>
<pre>$response</pre>
EOF;
        $response->setContent($html);
        return $response;
    }
}
```

主なメソッド

- `$request->url()` クエリを含まない URL を返す
- `$request->fullUrl()` クエリを含む URL を返す
- `$request->path()` ドメインより下のパス部分だけを返す
- `$response->status()` ステータスコードを返す
- `$response->content()` コンテンツを取得
- `$response->setContent()` コンテンツを設定
