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
