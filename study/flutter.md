# Flutter

[[toc]]

## ✅ User Interface ✅

## Introduction to widgets

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

- root widget(上記の場合 Center)は画面全体を占める仕様になっている
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

### 子ウィジェットへの引数の渡し方

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

  // - このクラスはstateの設定である。
  // - 親から与えられた引数を保持する
  //   - これらはstateのbuildメソッドから`widget.***`としてアクセス可能
  //   - これらは常にfinalとして扱われる
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

## ✅✅ レイアウトの作成 ✅✅

## レイアウトの概要

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

パス

## Building adaptive apps

パス

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
- alignment は具体的に設定する必要がある。なぜなら、もし child が parent とは違うサイズになりたいのに、parent が十分な情報を持っていない場合、child のサイズは無視される事がある。

### レイアウトの挙動を例で学ぶ

[このページ](https://flutter.dev/docs/development/ui/layout/constraints)の Examples を眺めていくとだいたい分かる。以下、ハッとしたことリスト：

- サイズ決定ロジックは意外と複雑なので注意。例えば `Container` なら、子要素があれば最小サイズ、なければ最大サイズになるなど。
- `ConstrainedBox`は子に constraint を**加える**。言い換えると、もともと親から与えられている constraint がある場合はそちらが優先されるので注意。
- `UnconstrainedBox`は子にいかなる制約も加えないため、子を自然なサイズで描写できる
- `OverflowBox`は、動作は`UnconstrainedBox`と同じだが、黄色いゼブラの警告を表示しない点が異なる。
- bounded という言葉の意味は、`double.infinity`ではない width と height を持っているということ。
- `Row`は子にいかなる constraint も加えないため、自然のサイズで表示される。
  - ただし、`Expanded`で子をラップした場合、子のサイズは無視される。
  - `Expanded`の兄弟に`Flexible`がいる。こちらは、子に同じサイズになるように強要しない。

### Tight vs loose constraints

- Tight constraint
  - (min|max)Width に同じ値を指定し、かつ (min|max)Height にも同じ値を指定すること
  - 例：root screen の constraint: 子要素に画面幅・高さと同じになるように強要。
- Loose constraint
  - max(Width|Height)のみ指定し、min(Width|Height)は 0 であること
  - 例：Center の constraint: 子要素は小さくなっていい。ただし画面高と高さは超えないように。
