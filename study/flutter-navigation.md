# Flutter navigation

https://medium.com/flutter/learning-flutters-new-navigation-and-routing-system-7c9068155ade

## \_

### Navigator と Router

- Navigator 2.0
  - 宣言的に使える。
  - 従来どおり、命令的に使うことも可能。
  - 従来は、複数ページの push|pop や、カレントページの下側にあるページを削除したりすることが難しかった。これらを簡単に行えるようにした。
- Router
  - 適切なページを表示する役割を持つ

### Navigator 1.0

- `Navigator`
  - Route オブジェクトをスタックとして管理する widget
- `Route`
  - 各画面を表現するオブジェクト
  - `MaterialPageRoute`クラス等によって実装されることが多い
  - Named routes と Anonymous routes がある

#### Anonymous routes

任意のタイミングで一時的に画面を作成して表示したいとき

```dart
// 遷移したいとき
Navigator.push(
  context,
  MaterialPageRoute(builder: (context) {
    return OtherScreen();
  }),
);

// 戻るときは
Navigator.pop(context);
```

#### Named routes

- 事前定義した名前付きの画面に遷移したいとき
- [引数を画面に渡すことが可能](https://flutter.dev/docs/cookbook/navigation/navigate-with-arguments)
- しかし、url をパースして値を取得することはできない。例）`/details/:itemId`

```dart
// ルーティング設定
MaterialApp(
  routes: {
    '/': (context) => HomeScreen(),
    '/details': (context) => DetailScreen(),
  },
);

// 遷移したいとき
Navigator.pushNamed(
  context,
  '/details',
);

// 戻りたいとき
Navigator.pop(context);
```

#### onGenerateRoute

- 最も柔軟な route の作成方法。
- Url をパースして値を取得し、画面に渡すことも可能

```dart
MaterialApp(
  onGenerateRoute: (settings) {
    // Handle '/'
    if (settings.name == '/') {
      return MaterialPageRoute(builder: (context) => HomeScreen());
    }

    // Handle '/details/:id'
    var uri = Uri.parse(settings.name);
    if (uri.pathSegments.length == 2 &&
        uri.pathSegments.first == 'details') {
      var id = uri.pathSegments[1];
      return MaterialPageRoute(builder: (context) => DetailScreen(id: id));
    }

    // その他
    return MaterialPageRoute(builder: (context) => UnknownScreen());
  },
);
```

### Navigator 2.0

- `Page`
  - 変更不可なオブジェクト
  - Navigator の history stack をセットするために使う
- `Router`
  - どのページを表示すべきかという設定情報
  - Navigator に利用される
  - TODO: よくわからん
- `RouterInformationParser`
  - `RouterInformation`を`RouterInformationProvider`から取得し、パースしてユーザが定義した形式に変換する。
- `RouterDelegate`
  - TODO: よくわからん
- `BackButtonDispather`
  - 戻るボタンが押されたことを Router に報告する

![全体図](https://res.cloudinary.com/ds0prnqhx/image/upload/v1628815745/markdown/20210813094904.jpg)

全体の流れ

1. 新しい route(例えば`books/2`など)が emit される。
1. `RouteInformationParser`が、それを事前定義した抽象型(例えば`BooksRoutePath`など）に変換する。
1. `RouterDelegate`の`setNewRoutePath()`が先ほどのデータと共に呼ばれる。App state が適切に更新され、`notifyListeners()`が呼ばれる。
1. `Router`が`RouterDelegate.build()`をする（再構築する）。
1. 新しい Navigator が生成される。この Navigator は app state の更新を反映している(例えば選択中の book の id など)

#### Pages

- v2 では、画面のスタックを宣言的に管理するための部品として`Page`が用意された。
- これを使用するには、`MaterialApp`の初期化方法を変更する必要がある。
- もし、URL との同期が不要であれば、これだけで画面遷移を実現できる。

```dart
//　v1ではこうだったのが
MaterialApp(
  title: 'Flutter Tutorial',
  home: TutorialHome(),
)

// v2ではこうなる
MaterialApp(
  title: 'Flutter Tutorial',
  home: Navigator(
    // スタックしたいページ群を宣言的に記載する
    pages: [
      MaterialPage(
        key: ValueKey('TutorialHome'),
        child: TutorialHome(),
      ),
      // stateをつかってpagesを動的に更新することで、
      // 必要に応じて画面遷移が自動的に発生する。すごい！
      if(someAppState == true)
        SomeOtherPage(...);
    ],
    onPopPage: _onPopPage, // 後述
  ),
);
```

onPopPage では以下のことを行うとよい

- pop が成功したのか確認し、失敗したのなら何もしない
- App の state を更新する。例えば選択中のアイテムを変更し、もって pages が変更されるよう設計しておく。

```dart
onPopPage: (route, result) {
  if (!route.didPop(result)) {
    return false;
  }

  setState(() {
    _selectedBook = null;
  });

  return true;
},
```
