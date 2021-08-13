# Flutter - Riverpod

[[toc]]

## インストール

- Flutter + flutter_hooks で使う場合 => `hooks_riverpod`
- Flutter で使う場合 => `flutter_riverpod`
- Flutter は使わず Dart のみの場合 => `riverpod`

## 最小構成

```dart
import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

// "hello world"という値を保持するプロバイダを作成する。
final helloWorldProvider = Provider((_) => 'Hello world');

void main() {
  runApp(
    // ウィジェットが値を読み出せるように、
    // アプリ全体をProviderScopeでラップする。
    // すべてのプロバイダはここで生息する。
    ProviderScope(
      child: MyApp(),
    ),
  );
}

// flutter_hooksのHookConsumerWidgetを使用している点に注意
class MyApp extends HookConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // HookConsumerWidgetのおかげで、
    // `ref.watch()`を使って値を読み出せる。
    final String value = ref.watch(helloWorldProvider);

    return MaterialApp(
      home: Scaffold(body: Text(value)),
    );
  }
}
```

## Provider とは

- Provider は下記の２つを実現するためのオブジェクト
  - state をカプセル化する
  - state を listen できるようにする
- Providers を使うメリット
  - state を複数の場所で使える
  - 複数の state を簡単に組み合わせられる
  - パフォーマンスの最適化が可能
  - テストが容易
  - Logging や pull-to-refresh などの先進機能との統合が容易

### Provider の作成

```dart
final myProvider = Provider((ref) {
  return MyValue();
});
```

- プロバイダ自体は immutable でなければならないので`final`で宣言する
- `Provider`が最も基本的なプロバイダ。他にも`StreamProvider`や`StateNotifierProvider`などがある。
- コールバック関数は常に`ref`を受け取る。`ref`は以下の用途に使う。
  - 他の Provider の値を取得する
  - Destroy 時に特定の処理を行う(たとえば[ストリームを閉じる処理](https://riverpod.dev/docs/concepts/providers#performing-actions-before-the-state-destruction)など)

### Provider Modifiers

- Modifier を使うと、少し機能を追加したり変更した Provider を作成できる。
- Modifier どの種類の Provider でも利用可能。
- 今のところ以下の２種類しかない。

```dart
final myAutoDisposeProvider = StateProvider.autoDispose<String>((ref) => 0);
final myFamilyProvider = Provider.family<String, int>((ref, id) => '$id');
```

## Provider を読み取る

Provider の値を読む方法はいくつかある。

![フローチャート](https://res.cloudinary.com/ds0prnqhx/image/upload/v1628838794/markdown/20210813161312.jpg)

### 読み取れる値の種類は複数ある場合がある

たとえば StreamProvider を使ったとき、取得できる値の種類は３つある。詳しくは[こちら](https://riverpod.dev/docs/concepts/reading#deciding-what-to-read)。

- `Stream`として受け取る
- `Future`として受け取る
- `AsyncValue`(riverpod の型)として受け取る

### ウィジェットの中で読み取る

#### `ConsumerWidget` を使う方法

- `StatelessWidget`の代わりに`ConsumerWidget`を使う。
- 注意：`watch`メソッドを非同期に呼び出してはいけない。例えば`onPressed()`の中など。その場合は後述の`context.read(myProvider)`を使う。

```dart
class Home extends ConsumerWidget {
  @override
  Widget build(context, ref) {
    int count = ref.watch(counterProvider).state;

    return Scaffold(/*...*/);
  }
}
```

#### `Consumer`を使う方法

- state の変更時に全体が再描写されるのを防ぎたいときに使う
- 下記の場合、state が更新されても Consumer の外側は再描写されない

```dart
Consumer(
  builder: (context, ref, child) {
    int count = ref.watch(counterProvider).state;
    return Text('$count');
  },
),
```

#### `useProvider(HookConsumerWidget)`を使う方法

```dart
class Count extends HookConsumerWidget {
  @override
  Widget build(context, ref) {
    int count = ref.watch(counterProvider).state;
    return Text('$count');
  }
}
```

- `HookConsumerWidget`では下記の表記ができる。これは、`ConsumerWidget`では使えないもの。
- このとき、`isAbove5`が変更されない限り、再描写はされないので効率的。(たとえば 1 が 2 になったとき)

```dart
// 下記のような記法がつかえる。
// これは、ConsumerWidgetでは使えない
bool isAbove5 = ref.watch(counterProvider.select((s) => s.state > 5));
```

#### `context.read(myProvider)`を使う方法

- 値の操作はしたいけど listen はしたくないときに使う。パフォーマンス最適化のために使う。
- 下記の場合、カウントアップされてもボタンは再描写されない。

```dart
@override
Widget build(BuildContext context) {
  return ElevatedButton(
    onPressed: () => context.read(counterProvider).state++,
    child: Text('increment'),
  );
}
```

#### `ProviderListener`を使う方法

Provider の値の変化を監視して、必要に応じて何らかの対応をしたい場合に使う。

```dart
ProviderListener<StateController<int>>(
  provider: counterProvider,
  onChange: (context, counter) {
    if (counter.state == 5) {
      /* なんらかの処理 */
    }
  },
  child: Whatever(),
);
```

### 他のプロバイダの中で読み取る

```dart
final myValue1Provider = Provider((ref) => MyValue1());
final myValue2Provider = Provider((ref) {
  final myValue1 = ref.watch(myValue1Provider)
  return MyValue2(myValue1);
});
```

### provider を使えない環境で読み取る

- `ProviderContainer`を使う。詳細は省略。
- 主にウィジェットではないクラスのテスト時などが想定される
