# Regex

## Cheatsheet

### Character classes

- `.` any character except newline
- `\w \d \s` word, digit, whitespace
- `[abc]` (Set) --- any of a, b, or c
- `[a-g]` (Range) --- character between a & g

### Negative Character classes

- `\W \D \S` not word, digit, whitespace
- `[^abc]` (Set) --- not a, b, or c

### Anchors

- `^someWord$` start / end of the string
- `\b` word boundary
- `\B` not-word boundary

### Escaped characters

- `\. \* \\ \[` escaped special characters
- `\t \n \r` tab, linefeed, carriage return

### Groups & Lookaround

- `(someWord)` capture group
- `\1` backreference to group #1
- `(?:someWord)` non-capturing group
- `(?=someWord)` positive lookahead
- `(?<=someWord)` positive lookbehind
- `(?!someWord)` negative lookahead
- `(?<!someWord)` negative lookbehind

### Quantifiers

直前の文字等の数を指定するための文法

- `a*` 0 or more
- `a+` 1 or more
- `a?` 0 or 1
- `a{5}` exactly five
- `a{2,}` two or more
- `a{2,4}` between two & four
- `a{,4}` four or less
- `a*? a+? a{2,}?` match as few as possible (lazy mode, non-greedy mode)

### Alternation

- `ab|cd` ab or cd

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
