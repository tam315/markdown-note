# GraphQL - Appolo

[[toc]]

## Mutation 時のキャッシュの更新方法

### refetchQueries を使う方法

- Mutation が成功した後に別のクエリを投げてキャッシュを更新する
- メリット --- 簡単かつシンプル
- デメリット --- リクエスト量が増える

```ts
createAccount({
  variables: { account: data },
  refetchQueries: ['GetAccounts'], // クエリ名を記載する
});
```

### update を使う方法

- `cache.modify()`などを使用し、キャッシュを完全にコントロールできる
- メリット --- リクエスト量は最少ですむ
- デメリット --- 処理の記述が煩雑

```ts
createAccount({
  variables: { account: data },
  update: (cache, fetchResult) => {
    cache.modify({
      fields: {
        accounts: (existingAccounts: AccountType[]) => [
          ...existingAccounts,
          fetchResult.data?.createAccount,
        ],
      },
    });
  },
});

deleteAccount({
  variables: { id },
  update: (cache, fetchResult) => {
    cache.modify({
      fields: {
        accounts: (xistingAccounts: AccountType[], { readField }) =>
          existingAccounts.filter(
            (existingAccount) =>
              readField('id', existingAccount) !==
              fetchResult.data?.deleteAccount?.id,
          ),
      },
    });
  },
});
```
