# Flutter

[[toc]]

## 雑多メモ

- プロジェクト名にアンダースコアがあると起動できないかも？
- パフォーマンス計測はリリースモードで行うこと。デバッグモードでは性能が落ちるため。
- `_`で名前が始まる変数はプライベートになる
- Anonymous function を関数に渡す方法
  ```dart
  some_func(() {/* ここに処理を記載 */})
  ```
- DevTools の使用方法
  - `flutter run -d chrome`で flutter を開始し、`ws://`から始まるアプリのアドレスをコピーする
  - VSCode で`Dart: Open DevTools`を選び、先程のアドレスをコピーして`Connect`ボタンをクリックする
- 文字の埋め込みは以下のようにする。
  ```dart
  final myNumber = 123;
  final message = "hello$a";
  // 日本語圏の場合は区切りが曖昧なので{}を省略しないほうがいいかも
  final message = "hello${a}";
  ```

## --- User Interface ---

## ウィジェットの基本

### Hello world

ミニマル構成

```dart
void main() {
  runApp(
    const Center(
      child: Text(
        'Hello, world!',
        textDirection: TextDirection.ltr,
      ),
    ),
  );
}
```

- root widget は画面全体を占める仕様になっている。詳細は後述の constraints を参照。
- `StatelessWidget` 又は `StatefulWidget` を継承したウィジェットを組み合わせて画面を作っていく。
- Widget の主たる役割は`build()`メソッドを実装すること。

### 基本ウィジェット

- `Text`
  - テキスト
- `Column`|`Row`
  - 縦・横方向に要素を並べる
  - web でいう flexbox
- `Stack`
  - 複数の要素を出現順に z 方向に重ねて表示する
  - `Positioned`widget で位置を調節できる
  - web でいう absolute 配置
- `Container`
  - パディング、マージン、ボーダー、背景色を使いたい時に利用する
  - `BoxDecoration`で装飾する。
  - web でいう div
- `Expanded`
  - スペースを使い切るまで拡張する。または収まるように縮小する。
  - `child`の中で使う
  - `flex`により拡張率を設定できる。

widget を引数として別の Widget に与える(React の children に相当)のは便利で強力なテクニックである。

### マテリアルコンポーネントの利用

- Material design を使うには以下の設定を予め行っておくこと

```yaml
# pubspec.yaml
name: my_app
flutter:
  uses-material-design: true
```

- `MaterialApp`ウィジェットの役割
  - `Navigator`をセットアップする
    - Navigator は routes を管理するために使う。routes は Widget のスタックとして管理されており、個々の Widget(各画面)は文字列で識別される。
  - マテリアルデザインのウィジェットを使うときには必ず先祖に必要。
  - `MaterialApp`を最上位に配置し、各画面を`Scaffold`ウィジェットで作るのがグッドプラクティス。

```dart
void main() {
  runApp(MaterialApp(
    title: 'Flutter Tutorial',
    home: TutorialHome(),
  ));
}

class TutorialHome extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: ...,
      body: ...,
      floatingActionButton: ...,
    );
  }
}
```

### 子ウィジェットへ引数を渡す

```dart
class MyText extends StatelessWidget {
  // メンバ変数の定義
  final String firstName, lastName;

  const MyText({
    // 引数を取り出してメンバ変数にセット
    // 必須のもの
    required this.firstName,
    // 必須でないもの
    this.lastName = "",
    // keyについてはよくわからんがsuperを呼ぶときに渡すらしい
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(child: Text(firstName + ' ' + lastName));
  }
}


// 使い方
MyText(
  firstName: 'John',
  lastName: 'Doe',
)
```

### ジェスチャー

- ボタンなどの場合は`onPressed()`などが用意されているのでそれを使う。
- それらがない場合は`GestureDetector`で要素をラップする。

```dart
GestureDetector(
  onTap: ..., // タップ時に行いたい処理
  child: ..., // ボタンなど
)
```

### StatefulWidget

- State を生成し保持することのできる特別な widget
- `StatefulWidget`と`State`が別オブジェクトである理由：
  - StatefulWidget は一時的なもの。再描写のたびに再生成される。
  - State は継続的なもの。再描写されても同じものが使い回され(`createState()`は初回のみ呼ばれる)、状態を保持する。
- StatefulWidget の内容を減らし、StatelessWidget に抽出していくことが重要
- Stateful| Stateless は関係ない話だが、より上位の Widget で値を管理するということは、その値の寿命を伸ばすことを意味する。極端な話、`runApp()`に渡されるコンポーネントで管理される値は、アプリが起動している間中、ずっと保持される。

```dart
class Counter extends StatefulWidget {
  final String name;

  // このクラスは親から与えられた引数を保持する
  // - 引数はstateのbuildメソッドから`widget.***`としてアクセス可能
  // - 引数は常にfinalとして扱われる
  const Counter({this.name = 'my counter', Key? key}) : super(key: key);

  @override
  _CounterState createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int _counter = 0;

  void _increment() {
    setState(() {
      // setStateの中で値を変更することで画面が再描写される。
      _counter++;
    });
  }

  @override
  build(context) {
    return Column(
      children: <Widget>[
        RaisedButton(
          onPressed: _increment,
          child: Text('Increment'),
        ),

        // `StatefulWidget`のメンバ変数とstateを組み合わせて使用できる
        Text(widget.name + _counter.toString()),
      ],
    );
  }
};
```

### widget の変更検知

StatefulWidget の引数を State で利用している場合（`widget.***`を使っている場合）、それらの変更は自動的に反映される。もし手動で変更を検知してなにかしたいときは`didUpdateWidget`をオーバーライドする。

```dart
class _CounterState extends State<Counter> {
  @override
  void didUpdateWidget(Counter oldWidget) {
    super.didUpdateWidget(oldWidget);
    // 処理をここに書く
  }
}
```

### ライフサイクルメソッド

StatefulWidget にはライフサイクルメソッドがある。`initState`や`dispose`をオーバーライドして記述する。

```dart
class _CounterState extends State<Counter> {
  // マウント時に1度だけ行いたい処理
  @override
  void initState() {
    super.initState();
    // 処理をここに書く
  }

  // アンマウント時に行いたい処理
  @override
  void dispose() {
    // 処理をここに書く
    super.dispose();
  }
}
```

### Local key

- Loacl key を使うことで、例えば無限リスト等において、Widget の再利用が効率的に行われる様になる。
  - `ValueKey` --- 数値などの値で区別する
  - `ObjectKey` --- オブジェクトの id で区別する
  - `UniqueKey` --- 絶対に重複しない。これを指定したコンポーネントは必ず毎回作り直される。

```dart
MyTextField(key: ValueKey(2))
MyTextField(key: ValueKey("asdf"))
MyTextField(key: ObjectKey(someObject))
MyTextField(key: Uniquekey())
```

- Local key を指定しない場合、widget の再利用はコンポーネントの位置と種類に基づいて行われる。
- 例えば下記のコードで、showFirst が true から false になった時には以下の処理が行われるが、これは非効率である。本来は 1 を削除するだけでよいため。
  - 2 の要素が削除される
  - 1 の要素の引数を`'world'`に変更する

```dart
if (showFirst) MyWidget('hello'), // 1
MyWidget('world'), // 2
```

### Global key

- State クラスの state やメソッドに対し、外部からアクセスしたいときに使う（そんなことしてええんか？）
- 当然ながら Stateful widget に対してのみ使用できる。また、対象の State クラス、State、メンバ変数などが Pubric である必要がある。
- [この動画](https://www.youtube.com/watch?v=jlZ8GV_3nnk)を見るとわかりやすい。

```dart
class HomeScreen extends StatelessWidget {
  // 1. グローバルキーを用意する
  final counterGlobalKey = GlobalKey<CounterState>();

  void someParentFunction() {
    // 3. 親側から子のStateやメソッドにアクセスできるようになる
    print(counterGlobalKey.currentState?.count);
    counterGlobalKey.currentState?.increment();
  }

  @override
  build(BuildContext context) {
    // 2. グローバルキーをStatefulWidgetに与える
    return Counter(key: counterGlobalKey);
  }
}

class Counter extends StatefulWidget {
  const Counter({Key? key}) : super(key: key);

  @override
  createState() => CounterState();
}

// Must be public
class CounterState extends State<Counter> {
  // Must be public
  int count = 0;

  // Must be public
  void increment() {
    setState(() {
      count += 1;
    });
  }

  /* 以下省略 */
}
```

## レイアウト

- Flutter においてはほぼ全てのものがウィジェットである。
  - レイアウトのためのウィジェット --- `Row`や`Center`など
  - UI エレメントを作るためのウィジェット（目に見えるウィジェット） --- `Text`や`RaisedButton`など

### 1 つのウィジェットを配置する手順

まず、[レイアウトウィジェット](https://flutter.dev/docs/development/ui/widgets/layout)を選ぶ

```dart
Center(child:null)
```

次に、目に見えるウィジェットを作成する。例えば`Text`や`Icon`など。

```dart
Text('hello')
```

目に見えるウィジェットをレイアウトウィジェットに追加する。レイアウトウィジェットの`child`又は`children`に記載することで行う。

```dart
Center(child:Text('hello'))
```

ウィジェットをページに配置する。

### 複数のウィジェットを配置する手順

`Row`や`Column`を使って複数の widget を縦又は横方向に並べて配置できる。

```dart
Row(
  // `justify-content`相当
  mainAxisAlignment: MainAxisAlignment.spaceAround,
  // `align-items`相当
  crossAxisAlignment: CrossAxisAlignment.center,
  children: [
    /* ...並べたいwidgets */
  ]
)
```

- 下記のような抽象度の高いウィジェットも用意されているので適宜活用すること。
  - Row の代わりに使える[`ListTile`](https://api.flutter.dev/flutter/material/ListTile-class.html)
    - 行頭末にアイコンを追加したり、3 行までのテキストを表示することが簡単に行える
  - Column の代わりに使える[`ListView`](https://api.flutter.dev/flutter/widgets/ListView-class.html)
    - カラムレイアウトを簡単に作成できる。コンテンツが縦にあふれる場合は自動でスクロールが表示される。

#### Row や Column をはみ出す場合

- 画像等が大きすぎて画面内に要素が収まらない場合、黄色と黒色のボーダーが警告として画面上に表示される。
- 画面内に収めたい場合は`Expanded`で`Row`等の各子要素を囲む。
- `flex`を指定することで拡大率を設定できる。

```dart
Row(
  crossAxisAlignment: CrossAxisAlignment.center,
  children: [
    Expanded(
      child: Image.asset('images/pic1.jpg'),
    ),
    Expanded(
      flex: 2,
      child: Image.asset('images/pic2.jpg'),
    ),
    Expanded(
      child: Image.asset('images/pic3.jpg'),
    ),
  ],
);
```

#### 詰めて表示する

デフォルトでは`Row`や`Column`は main axis の方向に最大限拡大する。拡大せずに詰めて表示したい場合は`mainAxisSize`を設定する。

```dart
Row(
  mainAxisSize: MainAxisSize.min,
  children: [
    Icon(Icons.star),
    Icon(Icons.star),
    Icon(Icons.star),
  ],
);
```

#### 読みやすいコードにする

- Flutter のコードは、ネストが深くなるとすぐに読みづらくなる。
- UI のまとまりごとに**変数や関数 に切り出す**ことを心がけること。

#### 画像

ネットワークから

```dart
Image.network('http://lorempixel.com/400/200/');
```

ローカルから

```yaml
# pubspec.yaml
flutter:
  assets:
    - images/pic1.jpg
    - images/pic2.jpg
    - images/pic3.jpg
```

```dart
Image.asset('images/pic1.jpg');
```

### よく使うレイアウト用のウィジェット

- まずはこれらの基本的なウィジェットを使って画面を作ってみよう。
- [ウィジェットカタログ](https://flutter.dev/docs/development/ui/widgets)
- Standard widgets と Material widgets がある。後者は MaterialApp 内でしか使えない。

#### Container

- パディング、マージン、ボーダーを使う時
- 背景色や背景画像を変えたい時
- 単一の子を持つ

#### GridView

- ウィジェットを格子状に配置したい時
- はみ出した部分は自動でスクロール可能になる
- `GridView.count` 指定した数で縦横を分割する
- `GridView.extent` アイテムの最大幅を指定して分割する

#### ListView

- リスト形式で項目を並べるときに使う
- 縦方向、横方向のどちらでも使用できる
- はみ出す場合は自動的にスクロール可能になる
- `Column`より設定項目は少ないものの、使いやすく、スクロールも自動的に設定される。

#### Stack

- ウィジェット（多くの場合は画像）に重ねてウィジェットを配置するときに使う
- 1 つ目に指定したウィジェットがベースウィジェットとなる。2 つ目以降に指定したウィジェットがその上に重ねて表示される。
- スクロールは不可
- はみだした部分を表示するかどうかは選択できる

#### Card (Material widget)

- マテリアルデザインのカードを使いたいとき
- 関連する情報をまとまりにしたいとき
- 丸角と影がつく
- スクロールは不可
- 初期サイズは 0x0 なので注意。`SizedBox`を使うとサイズを指定できる。
- `ListTile` と組みあわせて使うことが多い

#### ListTile (Material widget)

- マテリアルデザインの[リストタイル](https://flutter.dev/docs/development/ui/layout#listtile)を使いたいとき
- 3 行までのテキストと、行頭 or 行末の任意のアイコンから構成される
- `Row`より設定項目は少ないが、簡単に使うことができる

### 番外編

- Widget はあくまで設計図・設定・雛形である。実際には Widget を基にして Element という実体が作成され、それが画面上に配置される。
- Element tree が web で言うところの DOM tree にあたり、Widget tree が仮想 DOM にあたるイメージかな？
- `InheritedWidget` を使うと、React の Context のようなことが実現できる。詳しくは[こちら](https://medium.com/flutter-jp/inherited-widget-37495200d965)を読むとわかりやすい。

## Creating adaptive & responsive apps

TODO: 一旦パス

## Building adaptive apps

TODO: 一旦パス

## レイアウトの要件(Constraints)を理解する

- Constraint とは以下の４つのこと。
  - min width
  - max width
  - min height
  - max height

### レイアウトの 3 原則

- Flutter のレイアウトは**Constraints go down. Sizes go up. Parent sets position.**の３つのルールで動作する。web のレイアウトとは全く異なるルールなので要注意。具体的な動作は以下の通り。
  - ウィジェットは、**parent**から**constraint**を受け取る。
  - ウィジェットは、**children**に**constraint**を伝えたうえで、children がどういう**size**になりたいか聞く。
  - ウィジェットは、**children**を一つ一つ配置(**position**)していく。
  - 最後に、ウィジェット自身がどういう**size**になりたいか親に伝える。

### レイアウトの制約事項

- ウィジェットは希望するサイズになれない場合もある。なぜなら親の決めた constraint が優先されるから。
- ウィジェットは position を自分で決められないし、知ることもできない。なぜなら、それを決めるのは親だから。
- ウィジェットの size や position を正確に設定するためには、ツリー全体を把握する必要がある。なぜなら、親の size や position もそのまた親に依存するから。
- alignment は具体的に設定する必要がある。なぜなら、もし child が parent とは違うサイズになりたいのに、parent が十分な情報を持っていない場合、child のサイズは無視される事があるから。

### レイアウトの挙動を例で学ぶ

[このページ](https://flutter.dev/docs/development/ui/layout/constraints)の Examples を眺めていくとだいたい分かる。以下、ハッとしたことリスト：

- サイズ決定ロジックは意外と複雑な場合があるので注意。例えば `Container` なら、子要素があれば最小サイズ、なければ最大サイズになるなど。
- `ConstrainedBox`は子に constraint を**消極的に加える**。言い換えると、もともと親から与えられている constraint がある場合はそちらが優先されるので注意。
- `UnconstrainedBox`は子にいかなる制約も加えないため、子を自然なサイズで描写できる
- `OverflowBox`は、動作は`UnconstrainedBox`と同じだが、黄色いゼブラの警告を表示しない点が異なる。
- bounded という言葉の意味は、`double.infinity`ではない width と height を持っているということ。逆は unbounded。
- `Row`は子にいかなる constraint も加えないため、自然のサイズで表示される。ただし、`Expanded`で子をラップした場合、子のサイズは無視される。

### Tight vs loose constraints

- Tight constraint --- `FlexFit.tight`
  - (min|max)Width に同じ値を指定し、かつ (min|max)Height にも同じ値を指定すること
  - 例：root screen の constraint: 子要素に画面サイズと同じになるように強制する。この場合、子要素で width を指定しても無視される。
- Loose constraint --- `FlexFit.loose`
  - max(Width|Height)のみ指定し、min(Width|Height)は 0 であること
  - 例：Center の constraint: 子要素は小さくなっていい。ただし画面サイズは超えないように。

Expanded と Flexible の違い

- `Flexible` --- デフォルトでは`fit:FlexFit.loose`である。子に縮小を許可する。
- `Expanded` --- `Flexible`を`fit:FlexFit.tight`したものと等価。子のサイズを無視する。

`Center`などのいくつかの Widget は、constraints を緩める(loosen)する効果を持つ。

### Box constraints

Flutter の内部では`RenderBox`というオブジェクトを用いて widget を画面に配置している。

- 1. なるべく大きくなろうとする Box
     例）`Center`, `ListView`
- 2. children と同じサイズになろうとする Box
     例）`Transform`, `Opacity`
- 3. 特定のサイズになろうとする Box
     例）`Image`, `Text`
- 特殊な Box
  例）`Container` --- デフォルトで 1、子があれば 2、width を指定すれば 3 になる
  例）`Row|Column` --- 親から受け取った Constraints によって変わる（後述）

unbounded に関する注意

- unbounded(最大幅や高さが無限大) な constraint と上記の 1 を組み合わせるとエラーになる。
  - `Row|Column`とスクロール可能なウィジェット`ListView|ScrollView`を変な方向で組み合わせたときに起こりがちなので注意する。
- Flex box(`Row|Column`)は、bounded か unbounded かにより挙動が変わる。
  - bounded なら、そのサイズまで最大限拡張する
  - unbounded なら、子のサイズまで縮小する。このとき、`flex`プロパティや`Expanded`コンポーネントは当然ながら使えない。

## State をどこで管理するか

State の管理には 3 つのアプローチがある。

- 1. ウィジェット自身で管理する
  - アニメーションの状態など、親が知りたくもない情報はウィジェット自身で管理するとよい。
- 2. 親が管理する
  - チェックボックスのチェック状態やインプット欄のテキストなど、ユーザの入力データは親が管理すると良い。
- 3. 上記の 1 と２を適宜組み合わせる
  - アニメーションの状態はウィジェット自身で管理し、ユーザの入力データは親が管理するなど。

## アセットと画像

下記の項目が記載されている。必要になったら読む。

- 画像の読み込み方法
- 画像の Variant (Dark or Light)を扱う方法
- 解像度の異なる画像を読み込む方法
- json などのテキストファイルを読み込む方法

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

- Navigator 2.0 はあまりにも複雑なので、そのまま使うのは危険。なお、Flutter 開発チームもこういった評価を認識しており、より簡易なパッケージの開発が始まっている。とはいえ、web の場合は URL との同期が必要となることが多いので、v2.0 がほぼ必須となる。
- Navigator 2.0 が必要な場合はサードパーティのラッパーライブラリを使うとよい。2021/08 現在では[routemaster](https://pub.dev/packages/routemaster)が使い良さそう。

参考資料

- https://zenn.dev/ntaoo/articles/6641e846765da1
- https://medium.com/flutter/learning-flutters-new-navigation-and-routing-system-7c9068155ade

## Navigator 2.0 (routemaster)

routemaster を使うことで、Navigator2.0 を劇的にシンプルに扱うことができる。ボトムタブへの対応なども簡単に行える。詳細は [routemaster の ページ](https://pub.dev/packages/routemaster) を参照。

```dart
final routes = RouteMap(
  routes: {
    '/': (_) => CupertinoTabPage(
          child: HomePage(),
          paths: ['/feed', '/settings'],
        ),

    '/feed': (_) => MaterialPage(child: FeedPage()),
    '/settings': (_) => MaterialPage(child: SettingsPage()),
    '/feed/profile/:id': (info) => MaterialPage(
      child: ProfilePage(id: info.pathParameters['id'])
    ),
  }
);

void main() {
  runApp(
      // ここは定型文
      MaterialApp.router(
        routerDelegate: RoutemasterDelegate(routesBuilder: (context) => routes),
        routeInformationParser: RoutemasterParser(),
      ),
  );
}

// 遷移したいときは以下のようにする
Routemaster.of(context).push('/feed/profile/1');
```

## Deep linking

モバイルだけに関係する話のようなので一旦パス

## URL 戦略

- web の開発において、URL の形式を「ハッシュあり」と「ハッシュなし」から選ぶことができる。デフォルトはハッシュあり。変更したい場合は[こちら](https://flutter.dev/docs/development/ui/navigation/url-strategies)を参考に設定する。
- 必要があれば Base URL の設定も行える

## Animations

パス

## --- Data & backend ---

## State management

他のリアクティブ or 宣言的な環境(React など)の知見があればこの章はスキップしていいとのことなので、一部のみ抜粋。

- 用語
  - Ephemeral state --- アニメーションの状態など
  - App state --- ユーザが入力中の文字など

## Provider package

- 最もシンプルな State の管理方法。React の Context に似ている。
- `InheritedWidget`, `InheritedNotifier`, `InheritedModel`という低レベルなものを使いやすくしたもの
- provider を使うには以下の３つのことを理解する必要がある
  - ChangeNotifier
  - ChangeNotifierProvider
  - Consumer

### ChangeNotifier

- `notifyListeners()`により、子孫に変更を通知する役割を持つ
- 逆に言うと、Consumer は ChangeNotifier を購読することができる
- `flutter:foundation`由来

```dart
class CartModel extends ChangeNotifier {
  final List<Item> _items = [];

  get items => ListView(_items);

  int get totalPrice => _items.length * 12345;

  void add(Item item) {
    _items.add(item);
    notifyListeners(); // 通知
  }

  void removeAll() {
    _items.clear();
    notifyListeners(); // 通知
  }
}
```

### ChangeNotifierProvider

- `ChangeNotifier`のインスタンスを子孫に渡す役割を持つ
- 最も近い共通の祖先に配置する
- `provider`パッケージ由来

```dart
ChangeNotifierProvider(
  create: (context) => CartModel(),
  child: const CommonAncestor(),
)

// 複数のNotifierを使いたい場合は以下のようにする
MultiProvider(
  providers: [
    ChangeNotifierProvider(create: (context) => CartModel()),
    Provider(create: (context) => SomeOtherClass()),
  ],
  child: const CommonAncestor(),
),
```

### Comsumer

- Generic は必須。型情報を基に、どの Notifier の値を取得するかが決定されるため。
- child はパフォーマンス最適化のために使われる。詳細は[こちら](https://flutter.dev/docs/development/data-and-backend/state-mgmt/simple#consumer)を参照。

```dart
Consumer<CartModel>(
  builder: (context, cart, child) {
    return Text("Total price: ${cart.totalPrice}");
  },
);
```

- なお、メソッドだけにアクセスできれば足りる場合は、`Consumer`だとコストが高くつくため、`Provider.of`を`listen: false`にして使うと良い。

```dart
Provider.of<CartModel>(context, listen: false).removeAll();
```

## State 管理の選択肢

- setState
  - 原始的。Ephemeral state の管理に最適。
- InheritedWidget & InheritedModel
  - 祖先と子孫の間で state をやり取りするための低レベルな手法。
  - provider は実質的にはこれらを使っている
- Redux
  - 説明不要
- Fish-Redux
  - 省略。中から大規模なアプリに最適とのこと。
- BLoC / Rx
  - Stream, Observable ベース
- GetIt
  - Service locator ベース
  - `BuildContext`が不要
- MobX
  - Observable, reaction ベース
- Flutter Commands
  - Command パターン
  - `ValueNotifiers`を使っている
  - GetIt と組み合わせるのがおすすめ
- Binder
  - recoid にインスパイアされている
  - `InheritedWidget`を使っている
- GetX
- Riverpod
  - provider を使いやすく改造したもの。
  - Flutter SDK への依存が一切ない
- states_rebuilder
  - dependency injection による状態管理 + integrated router から構成される

## Riverpod

[Riverpod](https://github.com/rrousselGit/river_pod)の特徴

- エラーをコンパイル時点で検出できる
- ネストをなくせる
- テスト可能である

## JSON & serialization

JSON のシリアライズ・デシリアライズをどうやるか？

- PoC などの小さなプロジェクトでは manual serialization が最適
  - `dart:convert`を使う
  - 生の JSON を`jsonDecode()`に与えると`Map<String, dynamic>`が得られる。
  - 容易にランタイムエラーが起こるので注意
- 中規模・大規模なプロジェクトでは Code generation が最適
  - `json_serializable`や`build_value`などの外部ライブラリを使って行う
  - コンパイル時点でエラーチェックが可能
  - モデルクラスを監視し、自動的にエンコーディング用のコードを生成する

### 手動シリアライズ (inline)

- タイポにより容易にエラーが起こりうる
- 型情報が失われている

```dart
Map<String, dynamic> user = jsonDecode(jsonString);

print('Howdy, ${user['name']}!');
print('We sent the verification link to ${user['email']}.');
```

### 手動シリアライズ (inside model classes)

- モデルにエンコード・デコードの機能をもたせる方法
- 型情報は設定されるものの、冗長で、これ以上の複雑化には耐えられない。

```dart
class User {
  final String name;
  final String email;

  User(this.name, this.email);

  User.fromJson(Map<String, dynamic> json)
      : name = json['name'],
        email = json['email'];

  Map<String, dynamic> toJson() => {
        'name': name,
        'email': email,
      };
}
```

### Code generation によるシリアライズ

以下、json_serializable を使った例を記載。まず、`pubspec.yaml`の設定を行う。

```yaml
dependencies:
  json_annotation: <latest_version>

dev_dependencies:
  build_runner: <latest_version>
  json_serializable: <latest_version>
```

モデルクラスを json_serializable クラスに置き換える。

```dart
// user.dart

import 'package:json_annotation/json_annotation.dart';

// Userクラスが自動生成されたコードにアクセスするためのおまじない。
// 生成されるファイル名である`<元のソースファイル名>.g.dart`を指定する。
part 'user.g.dart';

// json_serializableの処理対象にする
@JsonSerializable()
class User {
  User(this.name, this.email);

  String name;
  String email;

  // おまじない
  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);

  // おまじない
  Map<String, dynamic> toJson() => _$UserToJson(this);
}
```

サーバサイドとフロントサイドでキー名が違う場合などは、下記のようにする。

```dart
// フィールドごとに設定する方法
@JsonKey(name: 'registration_date_millis')
final int registrationDateMillis;

// 一括で設定する方法(JSONのスネークケース<=>モデルのキャメルケース)
 @JsonSerializable(fieldRename: FieldRename.snake)
```

その他、必須要件なども設定できる

```dart
@JsonKey(defaultValue: false) // なければこの値をセットする
@JsonKey(required: true) // なければエラーを上げる
@JsonKey(ignore: true) // コード自動生成の処理対象から外す
```

コードの自動生成方法

- 一回のみ
  `flutter pub run build_runner build`
- 継続してウォッチ
  `flutter pub run build_runner watch`

実際の利用方法は以下の通り。これで、もはやシリアライズに関する責務はライブラリに委譲された。

```dart
// デコーディング
Map<String, dynamic> userMap = jsonDecode(jsonString);
var user = User.fromJson(userMap);

// エンコーディング
var userMap = User.toJson(user);
String json = jsonEncode(userMap);
```

なお、モデルをネストさせることも可能。ただし、ネストしたモデルは JSON にしたときにデフォルトでは展開されないので、`explicitToJson`の指定が必要。詳細は[こちら](https://flutter.dev/docs/development/data-and-backend/json#generating-code-for-nested-classes)。

```dart
@JsonSerializable(explicitToJson: true)
```

## HTTP 通信の方法

下記を使う。
https://github.com/dart-lang/http
