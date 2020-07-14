# GraphQL

[[toc]]

## Schema Type

GraphQL では Schema Type というものを宣言する。種類は以下の通り。

- Object Type
  - GraphQL で使うスキーマのほとんどがこのタイプ
  - 下記のいずれかのフィールドをもつ
    - Scalar type
    - Object type
- Query Type
  - Query に関する引数と戻り値の型
- Mutation Type
  - Mutation に関する引数と戻り値の型

## Tips

- N+1 問題
  - [こちらの動画](https://www.youtube.com/watch?v=uCbFMZYQbxE)の 3 つ目の解消方法がおすすめ
- Local state の管理方法
  - useState + context か、redux がおすすめ
  - apollo の local state は見通しが悪い
