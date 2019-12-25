# Flutter

[[toc]]

## User Interface

### Widget の基本

#### 最小構成

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(MaterialApp(
      home: Scaffold(
          appBar: AppBar(
            title: Text('Welcome to Flutter'),
          ),
          body: Center(
            child: Text('Hello World'),
          ))));
}
```

- `StatelessWidget` 又は `StatefulWidget` を継承したウィジェットを組み合わせて画面を作っていく。
  - 上記の`MaterialApp`,`Scaffold`などは Stateful、`Text`は Stateless
- Widget の主たる役割は`build()`メソッドを実装すること。

#### 基本ウィジェット

- `Text` --- テキスト
- `Column`|`Row` --- 縦・横方向に要素を並べる
- `Expanded` --- 余白を埋めきるまで拡張する。または収まるように縮小する。`flex`により拡張率を設定できる。
- `Stack` --- 複数の要素を絶対配置する。出現順に z 方向に重ねて表示する。
- `Container` --- web でいう div。`BoxDecoration`で装飾する。

#### マテリアルコンポーネントの利用

- `MaterialApp`ウィジェット
  - テーマや`Navigator`、`routes`など、マテリアルデザインに必須の機能を提供する。
  - マテリアルデザインのウィジェットを使うときには必ず先祖に必要。
  - 特に理由がなければ`MaterialApp`+`Scaffold`ウィジェットを使うのがグッドプラクティス。

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
      appBar: AppBar(
        leading: IconButton(
          icon: Icon(Icons.menu),
          tooltip: 'Navigation menu',
          onPressed: null,
        ),
        title: Text('Example title'),
        actions: <Widget>[
          IconButton(
            icon: Icon(Icons.search),
            tooltip: 'Search',
            onPressed: null,
          ),
        ],
      ),
      body: Center(
        child: Text('Hello, world!'),
      ),
      floatingActionButton: FloatingActionButton(
        tooltip: 'Add',
        child: Icon(Icons.add),
        onPressed: null,
      ),
    );
  }
}
```

#### 子ウィジェットへの引数の渡し方

```dart
class MyText extends StatelessWidget {
  MyText({this.firstName, this.lastName});

  final String firstName, lastName;

  @override
  build(context) {
    return Text(firstName + ' ' + lastName);
  }
}

// 親側
MyText(
  firstName: 'John',
  lastName: 'Doe',
)
```

#### ジェスチャーへの反応

`GestureDetector`を使う。

```dart
class MyButton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
        onTap: () {
          print('MyButton was tapped!');
        },
        child: Text('tap me'));
  }
}
```

#### StatefulWidget

```dart
class Counter extends StatefulWidget {
  Counter({this.name});

  final String name;

  @override
  _CounterState createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int _counter = 0;

  void _increment() {
    setState(() {
      // setStateを呼ぶことでbuildが再実行されて画面が更新される
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

        // `StatefulWidget`のプロパティにアクセスするには
        // `widget.名前`を使う
        Text('Name: ' + widget.name),

        // インスタンス変数にアクセスするには`$名前`を使う
        Text('Count: $_counter'),
      ],
    );
  }
}

// 使う時
Counter(name: 'num of click');
```

- `StatefulWidget`と`State`が別オブジェクトである理由：
  - 関心を分離して再利用性を高めるため？いまひとつよくわからない
  - StatefulWidget は表示を担当する。親の`build()`が実行されるたびに再生成される一時的なもの。
  - State は状態の保持を担当する。親の`build()`が実行されても同じものが使い回される。

#### widget の変更検知

widget(StatefulWidget のプロパティのこと。React の props のようなもの)の変更を検知したいときは`didUpdateWidget`をオーバーライドする。

```dart
class _CounterState extends State<Counter> {
  @override
  void didUpdateWidget(Counter oldWidget) {
    super.didUpdateWidget(oldWidget);
    // 処理
  }
}
```

#### State のライフサイクル

ライフサイクルメソッドは`initState`や`dispose`をオーバーライドして記述する。

```dart
class _CounterState extends State<Counter> {
  // マウント時に1度だけ行いたい処理
  @override
  void initState() {
    super.initState();
    // 処理
  }

  // アンマウント時に行いたい処理
  @override
  void dispose() {
    // 処理
    super.dispose();
  }
}
```

#### key

key を指定しない場合、差分判定はコンポーネントの位置で行われる。

```dart
[
  if (showFirst) MyWidget(), // 1
  MyWidget(), // 2
]
```

このため例えば上記の showFirst が true から false になった時、削除されるのは 2 番である。これを防ぐには key を使う。

- `ValueKey` --- 数値などの値で区別する
- `ObjectKey` --- オブジェクトの id で区別する
- `UniqueKey` --- 絶対に重複しない。これを指定したコンポーネントは必ず毎回作り直される。

```dart
// 使用例
MyTextField(key: ValueKey(2))
MyTextField(key: ObjectKey(someObject))
MyTextField(key: Uniquekey())
```

### レイアウト

Flutter においてはほぼ全てのものがウィジェットである。

- レイアウトのためのウィジェット --- `Row`や`Center`など
- UI エレメントを作るためのウィジェット（目に見えるウィジェット） --- `Text`や`RaisedButton`など

`Container` --- パディング、マージン、ボーダー、背景色を使いたい時に利用する

#### レイアウトの手順

[レイアウトウィジェット](https://flutter.dev/docs/development/ui/widgets/layout)を選ぶ

```dart
Center(child:null)
```

目に見えるウィジェットを作成する。例えば`Text`や`Icon`など。

```dart
Text('hello')
```

目に見えるウィジェットをレイアウトウィジェットに追加する。レイアウトウィジェットの`child`又は`children`に記載することで行う。

```dart
Center(child:Text('hello'))
```

レイアウトウィジェットをページに配置する。親ウィジェットの`build`メソッドや、マテリアルアプリであれば`Scaffold`の`body`に追加することで行う。

```dart
class MyComponent extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(child: Text('hello'));
  }
}
```

#### ハイレベルなウィジェット

下記のようなハイレベルなウィジェットが用意されているので積極的に活用すること。

- Row の代わりに使える[`ListTile`](https://api.flutter.dev/flutter/material/ListTile-class.html)
- Column の代わりに使える[`ListView`](https://api.flutter.dev/flutter/widgets/ListView-class.html)

#### 配置

`Row`や`Column`は配置の設定を行うことができる。

- main axis は flex でいう`justify-content`
- cross axis は flex でいう`align-items`

```dart
Row(
  mainAxisAlignment: MainAxisAlignment.spaceAround,
  crossAxisAlignment: CrossAxisAlignment.center,
  children: []
)
```

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

Flutter のコードは、ネストが深くなるとすぐに読みづらくなる。変数や関数に切り出してネストが深くならないように心がけること。

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

### 基本的なウィジェット

[ウィジェットカタログ](https://flutter.dev/docs/development/ui/widgets)

#### Container

- パディング、マージン、ボーダーを使う時
- 背景色や背景画像を変えたい時

#### GridView

- ウィジェットを格子状に配置したい時
- はみ出した部分は自動でスクロール可能になる
- `GridView.count` 指定した数で縦横を分割するとき
- `GridView.extent` アイテムごとの最大幅を指定して分割するとき

#### ListView

- リスト形式で項目を並べるときに使う
- 縦方向、横方向のどちらでも使用できる
- はみ出す場合は自動的にスクロール可能になる
- `Column`より設定できる項目は少ないが、使いやすく、スクロールも簡単にできる。
- `Column`では自動的にスクロールはできない点に注意

#### Stack

- ウィジェット（多くの場合は画像）に重ねてウィジェットを配置するときに使う
- 1 つ目に指定したウィジェットがベースウィジェットとなる。2 つ目以降に指定したウィジェットがその上に重ねて表示される。
- スクロールは不可
- はみだした部分を表示するかどうかは選択できる

#### Card

- マテリアルデザインのカードを使いたいとき
- 関連する情報をまとまりにしたいとき
- 丸角と影がつく
- スクロールは不可

#### ListTile

- マテリアルデザインの[リストタイル](https://flutter.dev/docs/development/ui/layout#listtile)を使いたいとき
- `Row`より設定項目は少ないが、簡単に使うことができる
