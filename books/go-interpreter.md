# Go 言語で作るインタプリタ

[[toc]]

## Lexical Analysis(字句解析)

[https://en.wikipedia.org/wiki/Lexical_analysis](https://en.wikipedia.org/wiki/Lexical_analysis)

別名、lexing 又は tokenization

lexer, tokenizer 又は scanner などと呼ばれるものを使って、ソースコード等（sequence of characters）をトークン（sequence of tokens）に変換すること

```txt
lex x = 5 + 5;
```

上記をトークンにすると次のようになる。

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
