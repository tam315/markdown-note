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

生の HTML を返す

```php
Route::get('/hello', function() {
  return '<h1>Some HTML!</h1>';
});
```

テンプレートを指定する

```php
// routes/web.php

Route::get('/', function() {
  return view('welcome');
});
// => `resources/views/welcome.blade.php`がレンダリングされる。
```

コントローラを指定する

```php
Route::get('/hello', 'HelloController@index');
Route::get('/hello', 'HelloController'); // シングルアクションコントローラの場合
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

- アクション＝コントローラに用意される処理のこと
- 名前を変えることで、複数設定できる
- インスタンスメソッドとして実装する
- アクションは、HTML もしくはリクエストオブジェクトを Return する

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
// routes/web.php
Route::get('/hello/{id?}/{pass?}', 'HelloController@index');
```

```php
// controller
class HelloController extends Controller
{
    public function index($id='defualtId', $pass='defaultPass') { /* do something */}
}
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
- `$request->QUERY_NAME` クエリを取得する（クエリ名が id なら、`$request->id`）
- `$response->status()` ステータスコードを返す
- `$response->content()` コンテンツを取得
- `$response->setContent()` コンテンツを設定

なお、Laravel では、下記のデータが全てリクエストオブジェクトにぶっこまれる（Express のように、req.params や req.query などはなく、いきなり req.propertyName の形で追加される）。

- params
- query string
- form data (input の name 属性)
- ミドルウェアから渡された値（`$request->merge(配列)`など）

## ビューとテンプレート

### PHP テンプレートの利用

PHP テンプレートを使うには、`view(フォルダ名.ファイル名)`を呼ぶことで、テンプレートから Response インスタンスを作成する。

```php
Route::get('/hello', function(){
    // resources/views/hello/index.phpというテンプレートを基にする
    // view()はResponseインスタンスを生成する
    return view('hello.index');
});
```

上記は、ルーティング設定に直接テンプレートを指定している。
ルーティングにはコントローラを指定し、その中でテンプレートを使いたいときは次にようにする。

```php
class HelloController extends Controller
{
    public function index() {
        return view('hello.index');
    }
}
```

テンプレートにデータを渡したいときは、view の第二引数に Array を渡す。

```php
// controller
class HelloController extends Controller
{
    public function index() {
        $data = [
            'msg1' => 'msg1です',
            'msg2' => 'msg2です',
        ];
        return view('hello.index', $data);
    }
}
```

```php
// template
<h1><?php echo $msg1 ?></h1>
<h1><?php echo $msg2 ?></h1>
```

### Blade テンプレートの利用

blade テンプレートを利用するには、`FILENAME.blade.php`の形式でテンプレートを作成する。
PHP テンプレートと Blade テンプレートが両方存在する場合は blade が優先される。

#### Form を実装してみる

input 要素の name 属性が、そのまま`$request`のプロパティとして取り出せるようになる。

```php
// template
<form method="POST" action="/hello">
    {{ csrf_field() }} // 外部サイトからのフォーム送信を防ぐため、認証データを挿入
    <input type="text" name="myname">
    <input type="submit">
</form>
```

```php
// routing
Route::post('/hello', 'HelloController@post');
```

```php
// controller
class HelloController extends Controller
{
    public function post(Request $request) {
        // $request->myname に入力した値が入っている
    }
}
```

### Blade の構文

#### 値の表示

```php
{{ 値など }}
{{!! 値など !!}} // エスケープしたくない場合
```

#### 条件分岐

```php
@if()
@elseif ()
@else
@endif

@unless()
@else
@endunless

@empty()
@else
@endempty

@isset()
@else
@endisset
```

#### 繰り返し

```php
@for (i=1; i<10; i++)
@endfor

@foreach ($array as $value)
@endforeach

// foreach-else
@forelse ($array as $value)
// 配列がある場合の処理
@empty
// 配列が空の場合の処理
@endforelse

@while ()
@endwhile

@break // 繰り返しを終了
@continue // 次のループへ
```

繰り返しの中では`$loop`という特殊なオブジェクトを使える。

- `$loop->index` インデックス（0 スタート）
- `$loop->iteration` 繰り返し数（1 スタート）
- `$loop->remaining` 残り回数(このループを含まず)
- `$loop->count` 繰り返しの元配列の要素数
- `$loop->first` 最初のループかどうか
- `$loop->last` 最後のループかどうか
- `$loop->depth` 繰り返しのネスト数(1 スタート)
- `$loop->parent` ネストしている場合に、親のループ変数を返す

```php
@foreach ([1,2,3] as $value)
    {{$loop->index}}
@endforeach
// => 0,1,2
```

#### php ディレクティブ

`@php`を使うと、blade テンプレートの中に php を記載できる。
基本的にテンプレートの中にロジックを書くのはバッドプラクティスなので、
あくまでビューに関する利用にとどめること。

```php
@php
    $counter = 0;
@endphp

@while($counter < 3);
    {{ $counter }}
    @php
        $counter += 1;
    @endphp
@endwhile
```

### レイアウトの作成

#### ベースレイアウトと継承レイアウト

ベース側において、`@yield()`, `@section() - @show`を使って場所を用意しておき、
継承側で`@section()`, `@section()-@endsection`を使うことで内容を埋めていく方法。

ベースレイアウト

```php
// resourses/views/layouts/helloapp.blade.php (layoutsというフォルダ名は変えてもいい)
<body>
    <h1>@yield('title')</h1>
    @yield('content')
    @section('menubar')
        <p>メニュー</p>
    @show
    @yield('footer')
</body>
```

継承レイアウト

```php
// resourses/views/hello.blade.php
@extends('layouts.helloapp')

@section('title', 'My Title')

@section('content')
    <p>ここが本文です。</p>
@endsection

@section('menubar')
    @parent // ベースレイアウトの中身を継承したい時に使う
    メニュー項目など
@endsection

@section('footer')
    <p>copyright 2018</p>
@endsection
```

#### コンポーネントの作成

- ヘッダ、フッタなど、パーツごとに作成する方法
- コンポーネントの作成方法は通常のテンプレートと全く同じ

```php
// resources/views/components/message.blade.php (componentsというフォルダ名は変えてもいい)
<p>これはコンポーネントです</p>
<p>{{ $msg_title }}</p>
<p>{{ $msg_content }}</p>
```

#### コンポーネントの利用その 1(`@component`）

- 値は`@slot()`で渡す
- 親テンプレートの変数スコープは、コンポーネントに引き継がれない。

```php
// resources/views/hello/index.blade.php

@component('components.message')

@slot('msg_title','タイトルやで')

@slot('msg_content')
コンテンツです
@endslot

@endcomponent
```

#### コンポーネントの利用その 2（`@include`=サブビュー）

- 値を渡すときは Array で渡す
- 親テンプレートの変数スコープは、コンポーネントに引き継がれる。親テンプレートで利用できる変数は、何もせずに読み込んだコンポーネント内で利用できる。まさに、そこにテンプレートを継ぎ足したような挙動をするということ。

```php
@include('components.message',[
    'msg_title' => 'タイトルです',
    'msg_content' => '本文です'
])
```

#### コレクションビュー(`@each`)

- 繰り返しデータをコンポーネントで表示する方法
- `@each(読み込むコンポーネント, 渡す変数, コンポーネント内にマップする変数名)`

```php
// テンプレート側　$dataは現実のアプリではコントローラ等から受け取ることになる
@php
$data = [
    ['name' =>'john', 'mail' => 'john@test.com'],
    ['name' => 'jack', 'mail' => 'jack@test.com']
]
@endphp

@each('components.item', $data, 'item')
```

```php
// コンポーネント側　resources/views/components/item.blade.php
<li>{{ $item['name'] }} - {{ $item['mail'] }}</li>
```

### ビューコンポーザー

コントローラから、ビューに関するロジックを分離するために使う。
特定のビューを表示する際に必要となる処理を実行し、結果などの情報をテンプレートに渡す役割を持つ。

```txt
Client <-> Controller <-Rendering <-- View Template
                            ^
                            └----- View Composer
```

#### サービスプロバイダの作成と登録

- ビューコンポーザのセットアップは、サービスプロバイダという仕組みを使って行う。
- サービスプロバイダを使うと、アプリケーション開始時に必要な処理を行うことができる。
- まずは空のサービスプロバイダを登録する。

```bash
php artisan make:provider HelloServiceProvider
```

```php
// app/Providers/HelloServiceProvider.php
namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class HelloServiceProvider extends ServiceProvider
{
    public function boot(){
      // アプリケーションの起動時に行われる処理
    }
}
```

```php
// config/app.php
'providers' => [
    // 下記の行を追加する
    App\Providers\HelloServiceProvider::class,
],
```

#### 無名関数を使用してセットアップ

```php
// app/Providers/HelloServiceProvider.php
namespace App\Providers;

use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class HelloServiceProvider extends ServiceProvider
{
    public function boot()
    {
        View::composer('hello.index', function($view){
            $view->with('value_from_composer', 'this message is from view composer!');
        });
    }
}

```

```php
// resources/views/hello/index.blade.php
{{ $value_from_composer }} // => 'this message is from view composer!'
```

- サービスプロバイダ内で`View::composer()`を使って、ビューと対応する処理（無名関数 or クラス）を記載することでセットアップする。
- 上記の例では、`resources/views/hello/index.blade.php`が呼ばれた際に、無名関数内に記載した処理を行うように設定している。
- `$view`は View クラスのインスタンスで、これを使ってビューを操作する。上記例では、`$view->with()`を使ってビューに変数を追加している。

#### クラスを使用してセットアップ

先述の無名関数の部分をクラスとして実装する方法。
ビューコンポーザクラスは、何も継承していないただのクラスである。
`compose`というメソッドを実装してさえいれば OK。

```php
// app/Http/Composers/HelloComposer.php  Composerフォルダの名前は変えてもOK
namespace App\Http\Composers; // これを忘れると他のファイルから参照できない

use Illuminate\View\View;

class HelloComposer
{
    public function compose(View $view)
    {
        $view->with('value_from_composer',  'this message is from view composer!');
    }
}
```

クラスを作成したら、サービスプロバイダにおけるビューへの処理の割当を、クラスを使ったものに書き換える。

```php
// app/Providers/HelloServiceProvider.php
class HelloServiceProvider extends ServiceProvider
{
    // アプリケーションの起動時に行われる処理
    public function boot()
    {
        View::composer('hello.index', 'App\Http\Composers\HelloComposer');
    }
}
```

## リクエスト・レスポンスの補完

### ミドルウェア

- コントローラの前や後に割り込み、処理を行う
- ミドルウェアは、ルーティング情報を記載する際に指定できる

#### 雛形の作成

```bash
php artisan make:middleware HelloMiddleware
```

```php
// app/Http/Middleware/HelloMiddleware.php
namespace App\Http\Middleware;

use Closure; // 無名クラスを表すクラス？

class HelloMiddleware
{
    public function handle($request, Closure $next)
    {
        // $requestを使って、リクエストに割り込む処理をここに書く
        $response = $next($request);
        // $responseを使って、レスポンスに割り込む処理をここに書く
        return $response;
    }
}
```

```php
// ルーティング設定
Route::get('/hello', 'HelloController@index')
    ->middleware(HelloMiddleware::class)
    ->middleware(SomeOtherMiddleware::class);
```

- ユーザからのリクエストがあると、最初のミドルウェアの`handle()`が実行される。
- `handle()`の中の`$next`は下記のいずれかを呼ぶ。なお、下記はどちらもレスポンスオブジェクトを返す。
  - 次のミドルウェアの`handle()`メソッド
  - 次のミドルウェアが存在しない場合はコントローラのアクション
- `$next`が次々に呼ばれていくので、再帰的に処理が実行されていく
  - 最初のミドルウェアのリクエストに関する処理
  - n 番目のミドルウェアのリクエストに関する処理
  - コントローラのアクション
  - n 番目のミドルウェアのレスポンスに関する処理
  - 1 番目のミドルウェアのレスポンスに関する処理

#### ミドルウェアからコントローラにデータを渡す

`$request->merge(配列)`を使うと、リクエストオブジェクトにプロパティを追加できる。

```php
// ミドルウェア
class HelloMiddleware
{
    public function handle($request, Closure $next)
    {
        $additionalData = [
            ['name'=>'taro', 'mail'=>'taro@dot.com'],
            ['name'=>'hanako', 'mail'=>'hanako@dot.com'],
        ];
        $request->merge(['additionalData' => $additionalData]);
        return $next($request);
    }
}
```

```php
// コントローラ
class HelloController extends Controller
{
    public function index(Request $request) {
        return view('hello.index', ['mydata'=>$request->additionalData]);
    }
}
```
