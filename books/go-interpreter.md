# Go 言語で作るインタプリタ

[[toc]]

## Lexical Analysis(字句解析)

[https://en.wikipedia.org/wiki/Lexical_analysis](https://en.wikipedia.org/wiki/Lexical_analysis)

lexer, tokenizer 又は scanner などと呼ばれるものを使って、ソースコード等（sequence of characters）をトークン（sequence of tokens）に変換すること

別名、lexing 又は tokenization ともいう。

```txt
lex x = 5 + 5;
```

上記をトークンで表すと、例えば次のような形になる。

```txt
[
  LET,
  IDENTIFIER("X"),
  EQUAL_SIGN,
  INTEGER(5),
  PLUS_SIGN,
  INTEGER(5),
  SEMICOLON
]
```

### トークンの定義

出現が予想されるトークンを定義する。

```go
package token

type TokenType string

type Token struct {
  Type    TokenType
  Literal string
}

const (
  ILLEGAL = "ILLEGAL" // 解析不能な字句
  EOF     = "EOF"

  // 識別子
  IDENT = "IDENT" // x, y など

  // リテラル
  INT = "INT" // 整数 1, 2, 3 など

  // 演算子
  ASSIGN = "="
  PLUS   = "+"

  // デリミタ
  COMMA     = ","
  SEMICOLON = ";"
  LPAREN    = "("
  RPAREN    = ")"
  LBRACE    = "{"
  RBRACE    = "}"

  // キーワード
  FUNCTION = "FUNCTION"
  LET      = "LET"
)
```

### Lexer(字句解析器)

ソース参照

## Parse(構文解析)

Lexer によって生成されたトークンを基に、何らかのデータ構造を構築する。

`JSON.parse()`も立派な構文解析器であり、プログラミング言語の構文解析器と基本的な作りは変わらない。

### データ構造

- Syntax Tree（構文木）
- Abstract Syntax Tree; AST（抽象構文木）

Syntax Tree から、セミコロンや改行といった補助的なものを取り除いたものが AST である。

### memo

- 式 expression --- 値を生成する
- 文 statement --- 値を生成しない
