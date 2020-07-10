# Apollo Client

[[toc]]

## なぜ Apollo Client か

### 宣言的なデータ取得

- データ取得にまつわる多くの面倒な処理が`useQuery`にカプセル化される
  - データ取得の開始と終了
  - データ取得中かどうかの状態管理
  - エラーの管理
  - UI の更新
  - 正規化
  - キャッシング
  - 楽天的更新
  - データの再取得
  - ページネーション
- これにより、下手をすると数千行のコードを削減できる

```js
function Feed() {
  const { loading, error, data } = useQuery(GET_DOGS);
  if (error) return <Error />;
  if (loading || !data) return <Fetching />;

  return <DogList dogs={data.dogs} />;
}
```

### ゼロコンフィグ・キャッシング

正規化されたデータキャッシュをゼロコンフィグで利用できる

### Local data と Remote data の統合

- remote だけでなく local のデータ管理機能も持っている
- キャッシングや正規化も使える
- ローカルデータも Apollo で管理することで、Apollo DevTools を使って全てのデータを一元的に管理することができる
- client side only な属性を作ることもできる

```js
const GET_DOG = gql`
  query GetDogByBreed($breed: String!) {
    dog(breed: $breed) {
      images {
        url
        id
        isLiked @client // <==クライアントだけに存在する属性
      }
    }
  }
`;
```
