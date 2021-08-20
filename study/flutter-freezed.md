# Flutter - Freezed

[[toc]]

## 参考資料

- [freezed パッケージの使い方](https://note.com/mxiskw/n/n55441444bd46)
- [immutable なクラスを扱いやすくする機能をコード生成で提供してくれる freezed を使ってみる](https://dev.classmethod.jp/articles/flutter_freezed_introduction/)

## なんのために使うか

- Dart では多くのオブジェクトが immutable であり、多くの利点がある。
- その反面、mutable なオブジェクトを扱うのは大変。その大変さを軽減するためのライブラリである。

## 何ができるか

- アサーション
- デフォルト値の設定
- 遅延初期化
- deprecated の指定
- toString
- hashCode
- `==`(すべてのプロパティが等しいか)
- CopyWith(既存オブジェクトの一部のプロパティのみを変更して新しく作成)
- FromJson/ToJson

## インストール

```yaml
# pubspec.yaml
dependencies:
  # freezedのアノテーションを利用可能にする
  freezed_annotation:

dev_dependencies:
  # コードジェネレータのランナー
  build_runner:
  # コードジェネレータ
  freezed:
```

## 使い方

```dart
// main.dart

// パッケージのインポート
import 'package:flutter/foundation.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

// 自動生成されるコードを読み込む
part 'main.freezed.dart';

// モデルの宣言(_$Personと_Personは後で自動生成されるクラスのこと)
class Person with _$Person {
  factory Person({
    String? name,
    int? age,
  }) = _Person;
}

// 使うとき
var person = Person(name: 'Remi', age: 24);
print(person.name); // Remi
print(person.age); // 24
```

コードの自動生成方法

```sh
flutter pub run build_runner build
```

## 機能

### アサーション

```dart
abstract class Person with _$Person {
  @Assert('name.isNotEmpty', 'name cannot be empty')
  @Assert('age >= 0')
  factory Person({
    String? name,
    int? age,
  }) = _Person;
}
```

### デフォルト値

```dart
class Person with _$Person {
  factory Person({
    @Default("") String? name,
    @Default(18) int? age,
  }) = _Person;
}
```

### deprecated

```dart
@freezed
class Person with _$Person {
  const factory Person({
    String? name,
    int? age,
    @deprecated Gender? gender,
  }) = _Person;
}
```

### toString

```dart
print(Person(name: 'Remi', age: 24)); // Person(name: Remi, age: 24)
```

### ==

```dart
print(
  Person(name: 'Remi', age: 24) == Person(name: 'Remi', age: 24),
); // true
```

### copyWith

```dart
var person = Person('Remi', 24);

// `age` not passed, its value is preserved
print(person.copyWith(name: 'Dash')); // Person(name: Dash, age: 24)

// `age` is set to `null`
print(person.copyWith(age: null)); // Person(name: Remi, age: null)
```

deepCopy もできる。詳細は[こちら](https://pub.dev/packages/freezed#copywith)を参照。

### FromJson/ToJson

- `json_serializable`と適合するようにできる。
- そのためには以下の２つの追記が必要。
  - `part 'model.g.dart';`
  - `factory Model.fromJson(Map<String, dynamic> json) => _$ModelFromJson(json);`

```dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'person.freezed.dart';
part 'person.g.dart';

@freezed
class Person with _$Person {
  const factory Person({
    String? name,
    int? age,
    @deprecated Gender? gender,
  }) = _Person;

  factory Person.fromJson(Map<String, dynamic> json) => _$PersonFromJson(json);
}
```
