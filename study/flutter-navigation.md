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

任意のタイミングで on the fly で画面を表示したいとき

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
- しかし、url をパースして値を取得するようなことはできない。例）`/details/:itemId`

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
- Url をパースして画面に渡すことも可能

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
