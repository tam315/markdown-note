# Flutter navigation

## Navigator 1.0

- `Navigator`
  - Route オブジェクトをスタックとして管理する widget
- `Route`
  - 各画面を表現するオブジェクト
  - `MaterialPageRoute`クラス等によって実装されることが多い
  - Named routes と Anonymous routes がある

### Anonymous routes

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

### Named routes

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

### onGenerateRoute

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

## Navigator 2.0

- Navigator2.0 はあまりにも複雑で、一般的な開発者が扱うには向いていない。
- Flutter 開発チームもこういった評価を認識しており、より簡易なパッケージの開発が始まっている。
- いまのところは Navigator 1.0 を使うか、Navigator 2.0 が必要な場合はサードパーティのラッパーライブラリを使うとよい。2021/08 現在では[routemaster](https://pub.dev/packages/routemaster)が使い良さそう。詳細後述。
- なお、web の場合は URL との同期が必要となることが多いので、v2 がほぼ必須となる。

参考資料

- https://zenn.dev/ntaoo/articles/6641e846765da1
- https://medium.com/flutter/learning-flutters-new-navigation-and-routing-system-7c9068155ade
