# Flutter チュートリアル

## Web のチュートリアル

https://flutter.dev/docs/get-started/codelab-web

- プロジェクト名にアンダースコアがあると起動できないかも？
- パフォーマンス計測はリリースモードで行うこと。デバッグモードでは性能が落ちるため。
- `_`で名前が始まる変数はプライベートになる
- ウィジェット自体(`StatefulWidget`|`StatelessWidget`)は immutable であり state を持つことはできない。state はウィジェットとは別の`State`クラスで保持する。
- State クラスで State を更新するには`setState()`を使う。
- `Navigator`というシングルトンなオブジェクトを使って画面(screens|routes|pages ともいう)の管理を行う。スタックで管理されており、最後に追加したものが最前面に表示される。

```dart
// 進む
Navigator.of(context).pushNamed('/welcome');
// 戻る
Navigator.of(context).pop();
```

- Anonymous function を関数に渡す方法

```dart
some_func(() {/* ここに処理を記載 */})
```

- DevTools の使用方法
  - `flutter run -d chrome`で flutter を開始し、`ws://`から始まるアプリのアドレスをコピーする
  - VSCode で`Dart: Open DevTools`を選び、先程のアドレスをコピーして`Connect`ボタンをクリックする

## モバイルのチュートリアル

- `pubspec.yaml`の`flutter`セクションに`uses-material-design: true`を記載しておくと、追加のアイコンなどが使用できるようになるので便利。
- Flutter ではほぼすべてのものが Widget である。alignment、padding, layout さえも。
- Widget の主な仕事は`build`メソッドを実装すること。
- 外部ライブラリを使用するには`pubspec.yaml`に記載したうえで`flutter pub get`する。

```yaml
# pubspec.yaml
dependencies:
  english_words: ^4.0.0
```

```dart
// main.dart
import 'package:english_words/english_words.dart';
```

- ステートフルなウィジェットを作るには、下記の 2 つが必要
  - `StagefulWidget`クラス
    - このクラス自体は immutable で、かつレンダリングのたびに破棄される
    - `State`クラスのインスタンスを作成する役割を持つ
  - `State`クラス
    - Widget が生き続ける限り再利用される
- `stful`のショートカットで一発で作成できる
- state クラスはプライベートにしておく(`_`を名前の頭につけておく)のがベストプラクティス

stateful なウィジェットの最小構成例

```dart

class RandomWords extends StatefulWidget {
  const RandomWords({Key? key}) : super(key: key);

  @override
  _RandomWordsState createState() => _RandomWordsState();
}

class _RandomWordsState extends State<RandomWords> {
  final someMyState = 123;

  void updateMyState() {
    setState(() {
      // この関数の中でstateを更新する。そうするとbuild()が実行され、再描写がかかる。
      someMyState = 456;
    })
  }

  @override
  Widget build(BuildContext context) {
    return Text(someMyState);
  }
}
```

マテリアルアプリの基本構成

- `MaterialApp` --- テーマの設定、タイトルの設定など
  - `Scaffold` --- AppBar、Body の設定など。画面ごとにこれを作るイメージ。
