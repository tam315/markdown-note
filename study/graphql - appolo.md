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

#### custom merge function

アイテムを削除したのちに refetchQueries で全件取得をすると、下記のようなメッセージが出る場合がある。

```txt
Cache data may be lost when replacing the accounts field of a Query object.
```

この場合は、下記のように custom merge function を明示的に設定してやるとよい。

```ts
const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          accounts: {
            // custom merge function
            // - accountsを取得したときはキャッシュのデータをまるごと置き換える
            // - ページネーションなどを行うときはより細かい制御が必要となる
            merge: (_existingAccount, incomingAccounts) => incomingAccounts,
          },
        },
      },
    },
  }),
});
```

### update を使う方法

- `cache.modify()`などを使用し、キャッシュを完全にコントロールできる
- メリット --- リクエスト量は最少ですむ
- デメリット --- 処理の記述が煩雑

```ts
// 作成の例
createAccount({
  variables: { account: data },
  update: (cache, fetchResult) => {
    const newAccountRef = cache.writeFragment({
      data: fetchResult.data?.createAccount?.account,
      fragment: gql`
        fragment NewAccountType on AccountType {
          id
          name
        }
      `,
    });
    cache.modify({
      fields: {
        accounts: (existingAccounts) => [...existingAccounts, newAccountRef],
      },
    });
  },
});

// 削除の例
deleteAccount({
  variables: { id },
  update: (cache, fetchResult) => {
    cache.modify({
      fields: {
        accounts: (existingAccounts: AccountType[], { readField }) =>
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
