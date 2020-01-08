# Regex

## Cheatsheet

### Character classes

- `.` any character except newline
- `\w \d \s` word, digit, whitespace
- `\W \D \S` not word, digit, whitespace
- `[abc]` any of a, b, or c
- `[^abc]` not a, b, or c
- `[a-g]` character between a & g

### Anchors

- `^someWord$` start / end of the string
- `\b \B` word, not-word boundary

### Escaped characters

- `\. \* \\` escaped special characters
- `\t \n \r` tab, linefeed, carriage return

### Groups & Lookaround

- `(someWord)` capture group
- `\1` backreference to group #1
- `(?:someWord)` non-capturing group
- `(?=someWord)` positive lookahead
- `(?<=someWord)` positive lookbehind
- `(?!someWord)` negative lookahead
- `(?<!someWord)` negative lookbehind

### Quantifiers & Alternation

- `a* a+ a?` 0 or more, 1 or more, 0 or 1
- `a{5} a{2,}` exactly five, two or more
- `a{1,3}` between one & three
- `a*? a+? a{2,}?` match as few as possible (lazy mode | non-greedy mode)
- `ab|cd` match ab or cd

## global match

```javascript
/,/  // マッチする最初のカンマ
/,/g // マッチする全てのカンマ
```

## multi line

- マルチラインモードでは`.*`とすると行をまたげない(`.`は改行以外の任意の一文字のため)。
  行をまたぐには、`[\s\S]*`とする必要がある。
- なお、下記の例では`*`を`*?`とすることで、lazy(non-greedy)モードで検索している。
  この場合、マッチする最短の文字列が選ばれる。

```javascript
/<br>[\s\S]*?<br>/m;
```

## case-insensitive search

```javascript
/[a-z]/; // 小文字のa-z
/[a-z]/i; // 小文字・大文字のa-z
```
