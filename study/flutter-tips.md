# Flutter - tips

[[toc]]

## 縦横スクロールバーを常時表示する

https://github.com/flutter/flutter/issues/70380#issuecomment-841544548

上記を参考に、少し順序を入れ替えたところ動作した。

```dart
// スクロールしたときにわかりやすいようにグラデーションしたBox
final gradientBox = Container(
  decoration: BoxDecoration(
    gradient: LinearGradient(
      colors: [Colors.purple, Colors.red],
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
    ),
  ),
  width: 800,
  height: 800,
);

final ScrollController _horizontalController = ScrollController();
final ScrollController _verticalController = ScrollController();

return Center(
  // 縦用Scrollbarを表示する役割？
  child: Scrollbar(
    isAlwaysShown: true,
    controller: _verticalController,
    // 縦用SingleChildScrollView
    child: SingleChildScrollView(
      controller: _verticalController,
      scrollDirection: Axis.vertical,
      // 横用Scrollbarを表示する役割？
      child: Scrollbar(
        isAlwaysShown: true,
        controller: _horizontalController,
        // 横用SingleChildScrollView
        child: SingleChildScrollView(
          controller: _horizontalController,
          scrollDirection: Axis.horizontal,
          child: gradientBox,
        ),
      ),
    ),
  ),
);
```

## scroll controller によるアニメーション

```dart
_scrollController.animateTo(
  _scrollController.position.maxScrollExtent,
  duration: Duration(milliseconds: 500),
  curve: Curves.ease,
);
```

## builder 関数において constraint を使う

- [PagenatedDataTable の高さを余白いっぱいに設定する例](https://stackoverflow.com/a/65972040/6574720)
