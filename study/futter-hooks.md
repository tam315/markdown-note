# Flutter - Hooks

[[toc]]

## 使える場所

下記の条件を満たす場所で使える

- `Hooks`ミックスインを使った widget や、`HookWidget`の中であること
- `build()`メソッドの中であること

## ルール

- フック名は必ず`use`で始める
- conditional に実行できない(例えば if 文の中などでは使えない)

## 例

### useState

- カウンターの例
- 返ってくる値の実態は`ValueNotifier`である

```dart
class Counter extends HookWidget {
  @override
  Widget build(context) {
    final count = useState(0);

    return Column(children: [
      Text("you clicked ${count.value} times"),
      TextButton(
        child: Text("count up"),
        onPressed: () => count.value += 1,
      ),
    ]);
  }
}
```

### useEffect

```dart
class Counter extends HookWidget {
  @override
  Widget build(context) {
    final count = useState(0);

    useEffect(
      () {
        // 初回マウント時に１回だけ実行される
        count.value += 10;

        return () {/* dispose時に行いたい処理があればここに記載する */};
      },
      // 以下の値に変化があったときに再実行される。
      // この例ではマウント時にのみ実行される。
      [],
    );
    // 以下省略
  }
}
```

### useMemorized

常に変化する値を固定したり、高コストな計算をなるべく減らすために使う。

```dart
// マウント時の現在日時を保存する例
final DateTime now = useMemoized(() => DateTime.now());
```
