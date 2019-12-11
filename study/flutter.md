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
- `Expanded` --- 余白を埋めきるまで拡張する。`flex`により拡張率を設定できる。
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
