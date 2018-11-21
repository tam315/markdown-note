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
| `phpunit.xml`                    | ユニットテストに関する設定ファイル          |
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
| `Providers`  | サービスプロバイダ　アプリ開始時の処理などを記述する           |
| `User.php`   | ユーザ認証に関するプログラム                                   |

#### routes フォルダ

| name           | description                                                               |
| -------------- | ------------------------------------------------------------------------- |
| `api.php`      | API の機能を特定のアドレスに割り当てたい時に使う                          |
| `channels.php` | ブロードキャストチャンネルのためのルーティング？                          |
| `console.php`  | コンソールプログラムのためのルーティング？                                |
| `web.php`      | 一般的な Web ページとしてアクセスするときのルーティング。**一番良く使う** |

#### ルーティング設定

ルーティングの設定は`routes/web.php`に記載する。

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

#### コンポーネントの利用その 1 (`@component`）

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

#### コンポーネントの利用その 3 (`@each`=コレクションビュー)

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

#### リクエストを修正する

リクエストオブジェクトを操作することで、リクエスト内容に手を加えることができる。例えば下記では、
`$request->merge(配列)`を使うことで、リクエストオブジェクトにプロパティを追加し、ミドルウェアからコントローラにデータを渡している。

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

#### レスポンスを修正する

レスポンスオブジェクトを操作することで、コントローラの作成したレスポンス内容に手を加えることができる。

```php
class HelloMiddleware
{
    public function handle($request, Closure $next)
    {
        $response = $next($request);
        $content = $response->content();
        $content = '<h1>some addition to the response</h1>'.$content;
        $response->setContent($content);
        return $response;
    }
}
```

#### グローバルミドルウェア

ミドルウェアを、個別のコントローラではなく、アプリケーション全体に適用する方法

```php
// app/Http/Kernel.php
protected $middleware = [
    \App\Http\Middleware\HelloMiddleware::class,
];
```

#### ミドルウェアグループ

複数のミドルウェアをまとめて扱う方法

```php
// app/Http/Kernel.php
protected $middlewareGroups = [
    'myMiddlewares' => [
        \App\Http\Middleware\HelloMiddleware1::class,
        \App\Http\Middleware\HelloMiddleware2::class,
    ],
];
```

```php
// routes/web.php
Route::get('/hello', 'HelloController@index')
    ->middleware('myMiddlewares');
```

### バリデーション

バリデーションの設定方法の前に、バリデーション関係で共通する事項を記載しておく。

#### エラーの表示

- `$error` バリデーションに失敗した時に、エラーが格納されるオブジェクト
- `$error->all()` すべてのエラーを配列にして受け取る

```php
// Template
@if (count($errors) > 0)
    @foreach($errors->all() as $error)
        <p>{{ $error }}</p>
    @endforeach
@endif
```

#### 特定項目のエラーを表示

- `$error->has(項目名)` 特定項目にエラーがあるかどうかを確認する
- `$error->first(項目名)` 特定項目の最初のエラーを文字列で取得
- `$error->get(項目名)` 特定項目のすべてのエラーを配列で取得

```php
@if($errors->has('email'))
    // 最初のエラーだけを取得
    <p>{{ $errors->first('email')}}</p>

    // 又は配列で取得
    @foreach($errors->get('email') as $error)
    <p>{{ $error }}</p>
    @endforeach
@endif
```

#### 入力値の保持

バリデーション後も値を保持しておくには、`old(項目名)`を value 属性に設定する。
なお、バリデーションが成功した場合には`old()`には何も値は入らない。

```php
// Template
name:<input type="text" name="name" value="{{old('name')}}">
mail:<input type="text" name="mail" value="{{old('mail')}}">
age:<input type="text" name="age" value="{{old('age')}}">
```

#### バリデーションルール

[公式ドキュメント](https://laravel.com/docs/5.7/validation#available-validation-rules)を参照

### バリデーション(コントローラの validate メソッドを使う方法)

#### 基本的なセットアップ

```php
// Template
<p>{{ $msg }}</p>
<form action="/hello" method="POST">
    name:<input type="text" name="name">
    mail:<input type="text" name="mail">
    age:<input type="text" name="age">
    <input type="submit" value="send">
</form>
```

```php
// Controller
class HelloController extends Controller
{
    public function index(Request $request) {
        return view('hello.index', ['msg'=>'フォームを入力：']);
    }

    public function post(Request $request) {
        $validate_rule = [
            'name' => 'required',
            'mail' => 'email',
            'age' => 'numeric|between:0,150',
        ];
        $this->validate($request, $validate_rule);
        return view('hello.index', ['msg'=>'正しく入力されています']);
    }
}
```

- POST に対応するアクション(`post()`)内で、`$this->validate(リクエスト,ルール)`を呼ぶことでバリデーションを行う。
- バリデーションに失敗した場合は自動的に GET に対応するアクション(`index()`)が呼ばれる。

### バリデーション(FormRequest を使う方法)

前述の方法はコントローラが直接バリデーション機能を呼び出しており、あまりスマートでない。Laravel には、FormRequest という Request クラスを継承したクラスがある。これを使うことにより、コントローラの前段で自動的にバリデーションを実行することができる。

```bash
php artisan make:request HelloRequest
```

```php
// app/Http/Requests/HelloRequest.php

namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;

class HelloRequest extends FormRequest
{
    // このFormRequestを利用できるパスを限定している
    public function authorize()
    {
        if($this->path() == 'hello') return true;
        return false;
    }

    public function rules()
    {
        return [
            'name' => 'required',
            'mail' => 'email',
            'age' => 'numeric|between:0,150',
        ];
    }
}
```

```php
// Controller
class HelloController extends Controller
{
    public function index(Request $request) {
        return view('hello.index', ['msg'=>'フォームを入力：']);
    }

    // RequestではなくHelloRequestにする
    public function post(HelloRequest $request) {
        return view('hello.index', ['msg'=>'正しく入力されています']);
    }
}
```

#### メッセージのカスタマイズ

FormRequest クラスの`messages()`メソッドをオーバーライドすることで、エラーメッセージをカスタマイズできる。

```php
class HelloRequest extends FormRequest
{
    public function messages()
    {
        return [
            'name.required' => '名前を入力してください',
            'mail.email' => 'メールアドレスの形式が正しくありません',
            'age.numeric' => '年齢は整数で入力してください',
            'age.between' => '年齢が正しくありません',
        ];
    }
}
```

### バリデーション(バリデータオブジェクトを作成する方法)

下記のことを行いたい場合は、バリデータオブジェクトを作成する。

- エラー時に GET ページにリダイレクトせず、別の処理を行いたい
- フォームの値以外でバリデーションしたい場合

```php
// Controller

use Validator;

class HelloController extends Controller
{
    public function post(Request $request) { // FormRequestではないので注意
        $rules = [
            'name' => 'required',
            'mail' => 'email',
            'age' => 'numeric|between:0,150',
        ];

        $messages = [
            'name.required' => '名前を入力してください',
            'mail.email' => 'メールアドレスの形式が正しくありません',
            'age.numeric' => '年齢は整数で入力してください',
            'age.between' => '年齢が正しくありません',
        ];

        // POSTデータを含む全てのデータ（$request->all() = 連想配列）を渡している
        $validator = Validator::make($request->all(), $rules, $messages);
        if($validator->fails()) {
            return redirect('/hello')
                ->withErrors($validator)
                ->withInput();
        }
        return view('hello.index', ['msg'=>'正しく入力されています']);
    }
}
```

- `Validator::make(チェックしたい値の配列, ルールの配列[, メッセージの配列])` validator を作成する
- `$validator->fails()` バリデーションが失敗かどうか
- `$validator->passes()` バリデーションが成功かどうか
- `redirect(リダイレクト先のパス)` リダイレクトする
- `->withErrors($validator)` エラーをリダイレクト先に引き継ぐ
- `->withInput()` 入力内容をリダイレクト先に引き継ぐ

#### クエリにバリデータを適用する

バリデータオブジェクトを応用すれば、クエリを検証することも可能。

```php
class HelloController extends Controller
{
    public function index(Request $request) {
        $validator = Validator::make($request->query(), [ // query（連想配列）を渡している
            'id' => 'required',
            'pass' => 'required',
        ]);
        /* do something */
    }
}
```

#### バリデータに動的にルールを追加する

フォームへの入力内容などによって動的にルールを変更したい場合は、下記を使う。
無名関数の返値が**false の場合に適用される**ので注意。

`$validator->sometimes(項目名, ルール, 適用するならfalseを返す無名関数)`

```php
class HelloController extends Controller
{
    public function post(Request $request) {
        $rules = [
            'name' => 'required',
            'mail' => 'email',
            'age' => 'numeric|between:0,150',
        ];

        $validator = Validator::make($request->all(), $rules);
        $validator->sometimes('age', 'min:0', function($input){
            return !is_int($input->age);
        });
        $validator->sometimes('age', 'max:150', function($input){
            return !is_int($input->age);
        });
        /* do something */
    }
}
```

### バリデーション(Validator クラス自体を上書きする方法)

オリジナルの検証ルールを作りたいときに使う方法。

１．オリジナルのバリデータークラスを作り、その中に検証ルールを作る

```php
// app/Http/Validators/HelloValidator.php (Validatorsのフォルダ名は何でもOK)

namespace App\Http\Validators;

use Illuminate\Validation\Validator;

class HelloValidator extends Validator
{
    // validate*** の *** の部分がルール名になる（この場合'hello'）
    public function validateHello($attribute, $value, $parameters)
    {
        return $value % 2 === 0;
    }
}
```

２．サービスプロバイダを使ってアプリ起動時にバリデータを上書きする

```php
// サービスプロバイダ

use Illuminate\Validation\Validator;
use App\Http\Validators\HelloValidator;

class HelloServiceProvider extends ServiceProvider
{
    // アプリケーションの起動時に行われる処理
    public function boot()
    {
        $validator = $this->app['validator'];
        $validator->resolver(function(...$args){
            return new HelloValidator(...$args);
        });
    }
}
```

３．検証ルールを設定する

```php
$rules = [
    'name' => 'required',
    'mail' => 'email',
    'age' => 'numeric|between:0,150|hello',
];
```

### オリジナルの検証ルール

オリジナルの検証ルールを作りたいが、Validator クラス自体を上書きするほどではないという場合は、
`Validator::extend(ルール名, 無名関数)`を使う。お手軽。

```php
// サービスプロバイダ

use Validator;

class HelloServiceProvider extends ServiceProvider
{
    public function boot()
    {
        Validator::extend('hello', function($attribute, $value, $parameters, $validator){
            return $value % 2 == 0;
        });
    }
}
```

### その他

#### CSRF 対策を無効にする

`Kernel.php`=>`$middlewareGroups`=>`web`の中から下記の行を削除

```txt
\App\Http\Middleware\VerifyCsrfToken::class,
```

#### CSRF 対策を一部のルートで無効にする

`app\Http\Middleware\VerifyCsrfToken.php`に下記を追加する。

```php
protected $except = [
    'hello', // somedomain.com/hello　で無効化
    'hello/*', // somedomain.com/hello/　このパス以下のすべてのページで無効化
];
```

#### クッキーの読み書き

- `$request->hasCookie(クッキー名)` 指定したクッキーの有無を取得する
- `$request->cookie(クッキー名)` 指定したクッキーを取得する
- `$response->cookie(クッキー名, 値, 保存期間)` 指定したクッキーをセットする

```php
class HelloController extends Controller
{
    // クッキーの取得
    public function index(Request $request) {
        if($request->hasCookie('my-cookie-name'))
        {
            $msg = $request->cookie('my-cookie-name');
        }
        /* do something */
    }

    // クッキーの保存
    public function post(HelloRequest $request) {
        // 一度、Responseインスタンスを生成する必要がある
        $response = new Response(view('hello.index'));
        $response->cookie('my-cookie-name', $request->someValue, 100);
        return $response;
    }
}
```

#### リダイレクト

- `redirect(パス)` => RedirectResponse というオブジェクトを返す
- `redirect()` => Redirector というオブジェクトを返す

RedirectResponse の使い方

- `->withInput()` フォームの値を付与したままリダイレクト
- `->withErrors(<MessageProvider>)` エラーメッセージを付与してリダイレクト
- `->withCookie(cookieの配列)` Cookie を付与してリダイレクト？

Redirector の使い方

- `->route(ルート名, 渡すデータの配列)` ルート名の部分は`/hello`など
- `->action(アクション, 渡すデータの配列)` アクションの部分は`'SomeController@index'`など
- `->view(ビュー名)` ビューを指定してリダイレクト
- `->json(テキスト)` JSON データを返す
- `->download(パス)` ファイルをダウンロード
- `->file(パス)` ファイルを表示

## データベース

Laravel のデータベース操作にはいくつかの方法がある。

- DB クラスを使う（SQL 直打ち）
- DB クラスを使う（クエリビルダ）
- Eloquent(Object-Relational Mapping)

### 準備

- sqlite のインストール（system32 フォルダにダウンロードした dll をぶちこむ）
- DB browser for sqlite のインストール

### DB との接続

接続の設定は`config/database.php`で行われる。しかし、設定項目の多くは`env()`ヘルパを使って環境変数から読み込まれ、環境変数がない場合だけデフォルト値（`env()`の第二引数）を指定する形式なっている。このため、実際の設定は`.env`ファイル又は環境変数において行うほうがよい。

例えば、sqlite の場合の設定は下記の通り

```txt
DB_CONNECTION=sqlite
# DB_HOST=127.0.0.1
# DB_PORT=3306
DB_DATABASE="C:\Users\SomeUser\Desktop\my-first-laravel\database\database.sqlite"
# DB_USERNAME=homestead
# DB_PASSWORD=secret
```

### DB クラス

#### select

```php
// コントローラ
use Illuminate\Support\Facades\DB;

class HelloController extends Controller
{
    public function index(Request $request) {
        $items = DB::select('select * from people');

        // or パラメータ結合を使う場合
        $params = ['id' => 1234];
        $items = DB::select('select * from people where id = :id', $params);
    }
}
```

#### insert

- `/hello/add`に GET でアクセスした場合は、フォームを表示
- `/hello/add`に POST でアクセスした場合は、DB にデータを追加してリダイレクト

```php
// ルーティング
Route::get('/hello/add', 'HelloController@showAddForm');
Route::post('/hello/add', 'HelloController@addNewData');
```

```php
// コントローラ
class HelloController extends Controller
{
    public function showAddForm(Request $request) {
        return view('hello.add');
    }

    public function addNewData(Request $request) {
        $param = [
            'name' => $request->name,
            'mail' => $request->mail,
            'age' => $request->age,
        ];
        DB::insert('insert into people (name, mail, age) values (:name, :mail, :age)', $param);
        return redirect('/hello');
    }
}
```

```html
<!-- テンプレート -->
<form action="/hello/edit" method="post">
  {{ csrf_field() }}

  <div>name:<input type="text" name="name" /></div>
  <div>mail:<input type="text" name="mail" /></div>
  <div>age:<input type="text" name="age" /></div>

  <input type="submit" value="send" />
</form>
```

#### update

- /hello/edit に GET でアクセスした場合は、データを取得したのち、フォームを表示
- /hello/edit に POST でアクセスした場合は、データを更新してリダイレクト

```php
// ルーティング
Route::get('/hello/edit', 'HelloController@showEditForm');
Route::post('/hello/edit', 'HelloController@updateData');
```

```php
// コントローラ
class HelloController extends Controller
{
    public function showEditForm(Request $request) {
        $param = ['id' => $request->id];
        $item = DB::select('select * from people where id = :id', $param);
        return view('hello.edit', ['form' => $item[0]]);
    }

    public function updateData(Request $request) {
        $param = [
            'id' => $request->id,
            'name' => $request->name,
            'mail' => $request->mail,
            'age' => $request->age,
        ];
        DB::update('update people set name = :name, mail = :mail, age = :age where id = :id', $param);
        return redirect('/hello');
    }
}
```

```html
<!-- テンプレート -->
<form action="/hello/edit" method="post">
  {{ csrf_field() }}

  <!-- IDを保持しておく必要あり -->
  <input type="hidden" name="id" value="{{$form->id}}" />

  <div>name:<input type="text" name="name" value="{{$form->name}}" /></div>
  <div>mail:<input type="text" name="mail" value="{{$form->mail}}" /></div>
  <div>age:<input type="text" name="age" value="{{$form->age}}" /></div>

  <input type="submit" value="send" />
</form>
```

#### delete

- /hello/delete に GET でアクセスした場合は、データを取得したのち、フォームを表示
- /hello/delete に POST でアクセスした場合は、データを削除してリダイレクト

```php
// ルーティング
Route::get('/hello/delete', 'HelloController@showDeleteForm');
Route::post('/hello/delete', 'HelloController@removeData');
```

```php
// コントローラ
class HelloController extends Controller
{
    public function showDeleteForm(Request $request) {
        $param = ['id' => $request->id];
        $item = DB::select('select * from people where id = :id', $param);
        return view('hello.delete', ['form' => $item[0]]);
    }

    public function removeData(Request $request) {
        $param = [
            'id' => $request->id,
        ];
        DB::delete('delete from people where id = :id', $param);
        return redirect('/hello');
    }
}
```

```html
<!-- テンプレート -->
<form action="/hello/edit" method="post">
  {{ csrf_field() }}

  <!-- IDを保持しておく必要あり -->
  <input type="hidden" name="id" value="{{$form->id}}" />

  <div>name: {{$form->name}}</div>
  <div>mail: {{$form->mail}}</div>
  <div>age: {{$form->age}}</div>

  <input type="submit" value="send" />
</form>
```

### クエリビルダ

`DB::table()`は、`Illuminate\Database\Query\Builder`クラスを返す。
これを使うことでテーブルの操作を行える。

#### select

```php
// コントローラ

// 複数件を取得
$items=DB::table('people')->get();
$items=DB::table('people')->get(['id', 'name']); // カラムを指定する場合

// 最初の1件を取得
$items=DB::table('people')->first();

// 条件を指定して取得
$items=DB::table('people')->where('id', $request->id)->get();
$items=DB::table('people')->where('id', $request->id)->first();
$items=DB::table('people')->where('id', '<=', $request->id)->get();
$items=DB::table('people')->where('name', 'like', '%John%')->get();

// 条件指定（AND）
$items=DB::table('people')->where()->where()->get();

// 条件指定（or）
$items=DB::table('people')->where()->orWhere()->get();

// 条件指定(条件を配列で指定)
$items=DB::table('people')->whereRaw('age >= ? and age <= ?', [10, 20])->get();

// 並べ替え
$items=DB::table('people')->orderBy('name', 'desc')->get();

// ページネーションなど
$items=DB::table('people')->offset($page * 10)->limit(10)->get();
```

#### insert

```php
$param = [
    'name' => $request->name,
    'mail' => $request->mail,
    'age' => $request->age,
];
DB::table('people')->insert($param);
```

#### update

```php
$param = [
    'id' => $request->id,
    'name' => $request->name,
    'mail' => $request->mail,
    'age' => $request->age,
];
$item = DB::table('people')->where('id', $request->id)->update($param);
```

#### delete

```php
DB::table('people')->where('id', $request->id)->delete();
```

### マイグレーション

マイグレーション＝ DB のバージョン管理機能のこと。雛形に基づいて DB を作成したり、削除したりする。

使用できる Column については[公式ドキュメント](https://laravel.com/docs/5.7/migrations#columns)を参照

```bash
php artisan make:migration create_people_table # people がテーブル名になる
```

```php
// database/migration/****_create_people_table.php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePeopleTable extends Migration
{
    // テーブル生成の処理
    public function up()
    {
        Schema::create('people', function (Blueprint $table) {
            $table->increments('id'); // primary key
            $table->string('name');
            $table->string('mail');
            $table->integer('age');
            $table->timestamps(); // created_at, updated_at
        });
    }

    // テーブル削除の処理
    public function down()
    {
        Schema::dropIfExists('people');
    }
}
```

```bash
touch database/database.sqlite # 空のDBファイルを作成
php artisan migrate
```

### シーディング

シーディング＝シード（最初から用意しておくレコード）を作成する機能

```bash
php artisan make:seeder PeopleTableSeeder
```

```php
// database/seeds/PeopleTableSeeder

use Illuminate\Support\Facades\DB;

class PeopleTableSeeder extends Seeder
{
    public function run()
    {
        $param = [
            'name' => 'taro',
            'mail' => 'taro@taro.com',
            'age' => 18,
        ];
        DB::table('people')->insert($param);
        /* 必要に応じて更にデータを追加する */
    }
}
```

シーディングで実行されるファイルは`database/seeds/DatabaseSeeder.php`なので、ここに作成したシーダーを追記しておく。

```php
class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call(PeopleTableSeeder::class);
    }
}
```

```bash
php artisan db:seed
```

## Eloquent ORM

ORM ＝ DB のデータを、クラスやオブジェクトの形式で扱えるようにするために、PHP と DB を橋渡しする仕組み

### セットアップ、データの取得

```bash
php artisan make:model Person # 単数形
php artisan make:controller PersonController
```

```php
// ルーティング
Route::get('/person', 'PersonController@index');
```

```php
// コントローラ

use App\Person;

public function index(Request $request) {
    $items = Person::all();
    return view('person.index', ['items'=>$items]);
}
```

- `Person::all()`で全件取得できる。
- `Person::all()`は、`Illuminate\Database\Eloquent\Collection`クラスのインスタンスを返す。このクラスはイテラブルであり、配列と同じように扱うことができる。

#### モデルの雛形

- デフォルトでは、モデル名（person）の複数形（people）が自動的にテーブル名として設定される。
  テーブル名を手動で設定したい場合は、`$table`プロパティにテーブル名をもたせておく。
- Auto Increment な項目など、値をサーバ側で自動設定するプロパティには`$guarded`を設定しておく。
- モデルクラスのスタティックプロパティにバリデーションルールを持っておくと後々便利。
- ORM と DB クラスとの相違点は、データが単なる配列ではなく**Person クラスのインスタンス**である点である。このため、クラスを拡張すればインスタンスの振る舞いも拡張することができる。

```php
// app/Person.php
class Person extends Model
{
    // テーブル名を手動設定する場合は下記の行をコメントアウト
    // protected $table = 'people';

    // guard
    protected $guarded = ['id'];

    // validation rules
    public static $rules = [
        'name' => 'required',
        'mail' => 'email',
        'age' => 'integer|min:0|max:150',
    ];

    // クラスの拡張
    public function getData() {
        return $this->id.':'.$this->message.'('.$this->url.')';
    }
}
```

### 検索

#### find(ID 検索)

id フィールドが指定の値であるデータを 1 件だけ取得する。

なお、もし id フィールドの名前が`id`でない場合は、モデルクラスに`$primaryKey`というプロパティを用意し、これにフィールド名を設定すること。

```php
// コントローラ
$item = Person::find($request->id);
```

#### where

```php
$items = Person::where('name', 'John')->get();
$items = Person::where('name', 'John')->first();
```

`where()`は`Illuminate\Database\Eloquent\Builder`クラスのインスタンスを返す。DB クラスのビルダとは異なるものの、機能はほとんど同じ。

### スコープ

- スコープ＝予め設定しておいた検索条件の雛形。組み合わせて使うこともできる。
- グローバルスコープとローカルスコープがある

#### ローカルスコープ

`scope****`という名前で定義する。

```php
// モデル
class Person extends Model
{
    public function scopeNameEqual($query, $str) {
        return $query->where('name', $str);
    }

    public function scopeAgeGreaterThan($query, $age) {
        return $query->where('age', '>', $age);
    }

    public function scopeAgeLessThan($query, $age) {
        return $query->where('age', '<', $age);
    }
}
```

- 使うときは`scope`はつけない。
- 複数のスコープを組み合わせる場合は、チェーンして使う。

```php
// コントローラ
$item = Person::nameEqual('taro')
    ->ageGreaterThan(10)
    ->ageLessThan(20)
    ->where('mail', 'taro@taro.com')
    ->first();
```

#### グローバルスコープ(無名関数で指定)

特に指定しなくてもスコープを適用したい場合は、グローバルスコープを使う。
グローバルスコープは、モデルクラスの`boot()`という静的メソッド内部で定義する。

```php
// モデル

use Illuminate\Database\Eloquent\Builder;

class Person extends Model
{
    protected static function boot(){
        parent::boot();

        static::addGlobalScope('age', function (Builder $builder){
            $builder->where('age', '>', 17);
        });
    }
}
```

#### グローバルスコープ(スコープクラスで指定)

- 前項をスコープクラスで行う方法。
- Scope クラスは、`apply()`ファンクションをもつ`Scope`インターフェースを実装する。

```php
// app/Scopes/ScopePerson.php (Scopesのフォルダ名はなんでもOK)

namespace App\Scopes;

use Illuminate\Database\Eloquent\Scope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class ScopePerson implements Scope{
    public function apply(Builder $builder, Model $model) {
        $builder->where('age', '>', 10);
    }
}
```

```php
// モデル
class Person extends Model
{
    protected static function boot(){
        parent::boot();
        static::addGlobalScope(new ScopePerson());
    }
}
```

### データの追加・更新・削除

以下、Create, Update, Delete のやり方を記載。なお、テンプレートのコードは[DB クラスを使ったコード](#db-クラス)とほぼ同じなため記載省略。

#### 追加

```php
// ルーティング
Route::get('/person/add', 'PersonController@add');
Route::post('/person/add', 'PersonController@create');
```

```php
class PersonController extends Controller
{
    public function add(Request $request) {
        return view('person.add');
    }

    public function create(Request $request) {
        // バリデートする。失敗したらGETのルーティングにリダイレクトされる。
        $this->validate($request, Person::$rules);

        // インスタンスを作成
        $person = new Person();

        // 【方法1】リクエストにぶら下がっている値をインスタンスにセットし、DBに保存
        $postData = $request->all();
        $person->fill($postData)->save();

        // 【方法2】リクエストのデータをインスタンスに一つずつセットして、DBに保存
        $person->name = $request->name;
        $person->mail = $request->mail;
        $person->age = $request->age;
        $person->save();

        return redirect('/hello');
    }
}
```

#### 更新

```php
// ルーティング
Route::get('/person/edit', 'PersonController@edit');
Route::post('/person/edit', 'PersonController@update');
```

```php
// コントローラ
class PersonController extends Controller
{
    public function edit(Request $request) {
        $person = Person::find($request->id);
        return view('person.edit', ['form'=> $person]);
    }

    public function update(Request $request) {
        // バリデートする。失敗したらGETのルーティングにリダイレクトされる。
        $this->validate($request, Person::$rules);

        // インスタンスを作成
        $person = Person::find($request->id);

        // リクエストにぶら下がっている値をインスタンスにセットし、DBに保存
        $postData = $request->all();
        $person->fill($postData)->save();

        return redirect('/person');
    }
}
```

#### 削除

```php
// ルーティング
Route::get('/person/delete', 'PersonController@delete');
Route::post('/person/delete', 'PersonController@remove');
```

```php
// コントローラ
class PersonController extends Controller
{
    public function delete(Request $request) {
        $person = Person::find($request->id);
        return view('person.delete', ['form'=> $person]);
    }

    public function remove(Request $request) {
        $person = Person::find($request->id)->delete();
        return redirect('/person');
    }
}
```

### リレーション

- 主テーブル（キーを提供するテーブル。顧客マスタなど。）
- 従テーブル（キーを利用するテーブル。顧客訪問履歴など。）

#### hasOne

テーブルが 1:1 で結びつく関係。

例）person と board が 1:１で結びつく場合

```php
class Person extends Model
{
    // 単数形
    public function board() {
        return $this->hasOne('App\Board');
    }
}
```

```php
class Board extends Model
{
    protected $guarded = ['id'];

    public static $rules = [
        'person_id' => 'required', // 「テーブル名_id」というキーで自動的に結び付けられる
        'title' => 'required',
        'message' => 'required',
    ];
}
```

```php
// personインスタンスからは、`board()`ではなく`board`のようにプロパティでアクセスできる。
// hasOneの場合は、オブジェクトが返る。
echo $person->board->message;
```

#### hasMany

テーブルが 1:N で結びつく関係。

例）person と board が 1:N で結びつく場合

```php
class Person extends Model
{
    // 複数形
    public function boards() {
        return $this->hasMany('App\Board');
    }
}
```

```php
class Board extends Model
{
    protected $guarded = ['id'];

    public static $rules = [
        'person_id' => 'required', // 「テーブル名_id」というキーで自動的に結び付けられる
        'title' => 'required',
        'message' => 'required',
    ];
}
```

```php
// personインスタンスからは、`board()`ではなく`board`のようにプロパティでアクセスできる。
// hasManyの場合は、オブジェクトではなくイテラブルが返る。
@foreach ($person->boards as $board)
  echo $board->message;
@endforeach
```

#### belongsTo

従テーブルから主テーブルを取得する時に使う。hasOne や hasMany とは逆の方向。

例）board が person に所属する場合

```php
class Board extends Model
{
    public static $rules = [
        'person_id' => 'required', // このキーを基にルックアップする
        'title' => 'required',
        'message' => 'required',
    ];

    public function person() {
        return $this->belongsTo('App\Person');
    }

    public function getData() {
        // $this->personで主テーブルにアクセスできる
        return $this->id.': '.$this->title.'('.$this->person->name.')';
    }
}
```

#### リレーションの有無で検索する

例えば、person と board が 1:N で関連する場合、board（リレーション）を持つ person とそうでない person が生まれる。これを検索するための便利なメソッドとして、`has()`と`doesntHave()`がある。

```php
Person::has('boards')->get(); // => iterable
Person::doesntHave('boards')->get(); // => iterable
```

#### with による Eager ローディング

前述の例は、実はあまり効率的でない。たとえば、`Person::all()`とした時、「Person を取得、その後 Person1 件ごとに、関連付けられた Board を取得」という動作になっている。（N+1 問題）

これを、「Person を取得、その後、関連する Board を 1 回で取得」という方法にするには、`all()`の替わりに`with()`を使う。

```php
Person::with('boards')->get();
```

## その他

### RESTful

- リソースフルなコントローラを作成する（Resourceful = RESTful + データ追加用フォーム + データ編集用フォーム）
- 作成したコントローラを、`Route::resource`に渡してやる。
- これだけで CRUD の基本的な機能が自動作成・設定される。

```php
php artisan make:controller RestappController --resource
```

```php
Route::resource('/rest', 'RestappController');
```

| http method | route         | method name | REST |
| ----------- | ------------- | ----------- | :--: |
| GET         | /route        | index()     |  \*  |
| GET         | /route/create | create()    |      |
| POST        | /route        | store()     |  \*  |
| GET         | /route/1      | show()      |  \*  |
| GET         | /route/1/edit | edit()      |      |
| PUT/PATCH   | /route/1      | update()    |  \*  |
| DELETE      | /route/1      | #()         |  \*  |

#### データの取得

- laravel では、アクション内で配列を Return すると自動的に JSON に変換してクライアントに返してくれる。
- よって、単に DB を検索して、配列に変換して Return してやれば OK

```php
class RestappController extends Controller
{
    public function index()
    {
        $items = Restdata::all();
        return $items->toArray();
    }

    public function show($id)
    {
        $item = Restdata::find($id);
        return $item->toArray();
    }
}
```

#### データの追加

```php
class RestappController extends Controller
{
    public function create()
    {
        return view('rest.create');
    }

    public function store(Request $request)
    {
        $restdata = new Restdata();
        $postData = $request->all();
        $restdata->fill($postData)->save();
        return redirect('/rest');
    }
}
```

#### データの更新・削除

省略

### セッション

- クライアント側にセッション ID を、サーバ側に ID に紐づくデータを保存することで、ユーザを識別する方法
- サーバ側の保存手法には、ファイル利用（デフォルト。`storage/framework/sessions`）、メモリ利用、データベース利用などいくつかの方法がある。

```php
// 保存
$request->session()->put('msg', $msg);

// 取得
$request->session()->get('msg');
```

#### 保存先を DB にする

セッションの設定は`config/session.php`で行われる。多くの設定は env ヘルパにより環境変数から読み込まれるため、`.env`を編集する。

```php
// .env
SESSION_DRIVER=database
```

session 用のテーブルを作成する。手作業ではなく、マイグレーションを使用する。

```bash
php artisan session:table # マイグレーションファイルの作成
php artisan migrate # マイグレーションの実行
```

### ページネーション

`all()`や`with()`の替わりに、`simplePaginate()`を使うことで簡単にページネーションを実装できる。

```php
//コントローラ

// DBクラスの場合
$items=DB::table('people')->simplePaginate(5);
$items=DB::table('people')->orderBy('age')->simplePaginate(5);
// モデルの場合
$items=Person::simplePaginate(4);
$items=Person::orderBy('age')->simplePaginate(4);

return view('hello.index', ['items'=>$items]);
```

```php
// テンプレート

// 前後ページへのリンクを自動生成する
{{ $items->links() }}

// 前後ページへのリンクに対して追加のクエリを付与したい場合は、appends()を挟む
{{ $items->appends(['sort'=>$sort])->links() }} // => /some?sort=***&page=2
```

#### ページ番号のリンクを表示する

`simplePaginate()`の替わりに`paginate()`を使うと、自動生成されるリンクに、ページ番号も含まれる様になる。

#### カスタムレイアウト

- `links()`に引数を指定することで、ページネーションのレイアウトをカスタムできる。
- 下記コマンドで雛形を生成できるので、適宜利用する
- 詳細は本書 p.313 を確認

```bash
php artisan vendor:publish --tag=laravel-pagination
```

### CSS

- Laravel には標準で CSS が用意されている。この CSS は Bootstrap を内包している。
- Pagination などは、この CSS ファイルでスタイリングされている。

```html
<head>
  <link rel="stylesheet" href="/css/app.css" />
</head>
```

### ユーザ認証

#### セットアップ

```bash
php artisan make:auth
php artisan migrate
```

`Auth::user()` ユーザ情報の取得

```php
// コントローラ
use Illuminate\Support\Facades\Auth;

class HelloController extends Controller　{
  $user = Auth::user();
  return view('some.view', ['user' => $user]);
}
```

`Auth::check()` ユーザがログインしているかどうか

```php
// テンプレート
@if (Auth::check())
    <p>{{$user->name}}</p>
    <p>{{$user->email}}</p>
@else
    <p>ログインしていません</p>
    <a href="/login">ログイン</a>|
    <a href="/register">登録</a>
@endif
```

#### 既製のルーティング

- `/login` ログイン
- `/register` サインアップ
- `/home` アカウント管理画面

#### ログインの強制

`auth`というミドルウェアを使うことで、特定のルートを閲覧する際にログインを矯正できる。ログインしていない場合は`/login`にリダイレクトされる。

```php
Route::get('/hello', 'HelloController@index')
    ->middleware('auth');
```

#### ログインのマニュアル実装

```php
if(Auth::attempt(['email'=>$mail, 'password'=>$pass])){
  /* on success */
} else {
  /* on fail */
}
```

### ユニットテスト

テストは`TestCase`クラスを継承したクラスに対し、`test****()`というメソッドを実装することで行う。

#### 設定ファイル

テストに関する設定は`phpunit.xml`で行う。

```xml
<!-- テスト用のデータベースを指定 -->
<env name="DB_DATABASE" value="database\database_test.sqlite"/>
```

#### ダミーレコードの用意

テスト用のダミーデータを作成するには、`database/factories`の中にある Model Factories を使う。

```php
// database/factories/ModelFactory.php
$factory->define(App\Person::class, function (Faker $faker) {
    return [
        'name' => $faker->name,
        'email' => $faker->safeEmail,
        'age' => $faker->random_int(1,99),
    ];
});
```

#### テストファイルの作成と実行

```bash
php artisan make:test HelloTest
```

```php
// tests/Feature/HelloTest.php
class HelloTest extends TestCase
{
    public function testExample()
    {
        $this->assertTrue(true);

        $arr = [];
        $this->assertEmpty($arr);

        $msg = 'Hello';
        $this->assertEquals($msg, 'Hello');

        $number = random_int(0, 100);
        $this->assertLessThan(100, $number);
    }
}
```

```bash
vendor/bin/phpunit
```

#### ルーティングや認証をテストする

```php
class HelloTest extends TestCase
{
    use DatabaseMigrations;

    public function testExample()
    {
        // ルーティングのテスト
        $response = $this->get('/');
        $response->assertStatus(200);

        $response = $this->get('/hello');
        $response->assertStatus(302);

        $response = $this->get('/no_routes');
        $response->assertStatus(404);

        // 認証のテスト
        $user = factory(User::class)->create();
        $response = $this->actingAs($user)->get('/hello');
        $response->assertStatus(200);
    }
}
```

`factory(クラス名)->create()` ファクトリの設定を基にインスタンスを生成して DB に保存する

#### データベースのテスト

```php
class HelloTest extends TestCase
{
    // テスト開始前にマイグレーションを実行し、終了後にまっさらに戻す
    use DatabaseMigrations;

    public function testExample()
    {
        $dummyPerson = [
            'name' => 'XXX',
            'mail' => 'YYY@ZZZ.COM',
            'age' => 123,
        ];

        // ファクトリの設定を一部上書きしてインスタンスを生成しDBに保存
        factory(Person::class)->create($dummyPerson);

        // 指定した数のインスタンスをDBに保存
        factory(Person::class, 10)->create();

        $this->assertDatabaseHas('people', $dummyPerson);
    }
}
```
