# JWT Tutorial w/ Node.js, GraphQL, React

[[toc]]

[動画](https://www.youtube.com/watch?v=25GS0MLT8JU)のまとめ

## Others

- `yarn upgrade-interactive --latest`
- `npx tsconfig.json`
- `nodemon --exec some-command`
- 使わない変数は`_`にするか`_name`のように頭にアンダーバーをつけることで、eslint が許してくれる
- TypeScript
  - undefined かもよ、と怒られた場合は!をつけると解消する `someVal!`
  - 困ったときは`someVal as any`
- cmd + . でオートインポートできる

## 1. server

- `npx typeorm init --name server --database postgres`
- postgres で DB を手動作成
- `ormconfig.json`のユーザ名などを適宜編集
- `yarn start`で自動的にテーブル等が作成される

`typeorm`と`type-graphql`を使うと、GraphQL の object type の作成と、ORM のモデル(エンティティー)の作成を、一つのクラス定義により行うことができる。

graphql setup

- `yarn add express apollo-server-express graphql`
- `yarn add -D @types/express @types/graphql`

type graphql

- `yarn add type-graphql`

```ts
// UserResolver.ts
import { Query, Resolver } from 'type-graphql';

@Resolver()
export class UserResolver {
  @Query(() => String) // resolverにおいてquery typeの宣言も同時に行える
  hello() {
    return 'hi!';
  }
}

// index.ts
import { buildSchema } from 'type-graphql';

const apolloServer = new ApolloServer({
  schema: await buildSchema({
    resolvers: [UserResolver],
  }),
});
```

mutation

- `yarn add bcryptjs`
- `yarn add -D @types/bcryptjs`

```ts
export class UserResolver {
  @Mutation(() => Boolean) // 成功したかどうかを返す
  async register(
    @Arg('email') email: string, // クエリ時の引数名、格納する変数名と型
    @Arg('password') password: string,
  ) {
    const hashedPassword = await hash(password, 12);
    try {
      await User.insert({
        email,
        password: hashedPassword,
      });
    } catch (err) {
      console.log(err);
      return false;
    }

    return true;
  }
}
```

users の一覧取得クエリ

```ts
// entity/User.ts
import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType() // GraphQLでObject Typeとして使いますよ
@Entity('user') // テーブル名を指定
// BaseEntityを継承することでActive Recordパターンが使えるようになる
export class User extends BaseEntity {
  @Field() // クエリ時に公開するフィールドですよ
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('text') // DBカラムの値種別 なくてもいい
  email: string;

  // このフィールドはクエリ時に公開しない
  @Column()
  password: string;
}
```

```ts
// UserResolver.ts
@Resolver()
export class UserResolver {
  @Query(() => [User])
  users() {
    return User.find();
  }
```

JWT

- `yarn add jsonwebtoken`
- `yarn add @types/jsonwebtoken`

```ts
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import {
  Arg,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';
import { User } from './entity/User';

// graphqlの型としても使うし、TypeScriptの型としても使う
@ObjectType()
class LoginRespone {
  @Field()
  accessToken: string;
}

@Resolver()
export class UserResolver {
  // resolverにおいてmutation typeの宣言も同時に行える
  @Mutation(() => LoginRespone)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
  ): Promise<LoginRespone> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw Error('could not find user');
    }

    const valid = await compare(password, user.password);

    if (!valid) {
      throw Error('bad password');
    }

    return {
      accessToken: sign({ userId: user.id }, 'asdfasdfasd', {
        expiresIn: '15m',
      }),
    };
  }
}
```

ApolloServer で express の req, res を取得したいときは context を使う

```ts
const apolloServer = new ApolloServer({
  context: ({ req, res }) => ({ req, res }),
});
```

```ts
export class UserResolver {
  @Mutation()
  async login(@Ctx() { req, res }) {
    // req, resを使ってなにかする
  }
}
```

- `yarn add dotenv`

`.env`

```
ACCESS_TOKEN_SECRET=asdfasdfasdf
```

```ts
import 'dotenv/config';
console.log(process.env.ACCESS_TOKEN_SECRET);
```

type-graphql での認証機能の実装方法

```ts
// MyContext.ts
import { Request, Response } from 'express';

export interface MyContext {
  req: Request;
  res: Response;
  payload?: { userId: string }; // これに任意のデータを乗せる。名前は自由。
}
```

```ts
// isAuthorized.ts (middleware)
import { verify } from 'jsonwebtoken';
import { MiddlewareFn } from 'type-graphql/dist/interfaces/Middleware';
import { MyContext } from './MyContext';

export const isAuthorized: MiddlewareFn<MyContext> = async (
  { context },
  next,
) => {
  const authorization = context.req.headers['authorization'];
  if (!authorization) {
    throw new Error('not authenticated');
  }

  try {
    const token = authorization.split(' ')[1];
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    context.payload = payload as any;
  } catch (e) {
    console.log(e);
    throw new Error('not authenticated');
  }

  return next();
};
```

```ts
// UserResolver.ts
export class UserResolver {
  @Query(() => String)
  @UseMiddleware(isAuthorized)
  bye(@Ctx() { payload }: MyContext) {
    return `bye! user id is ${payload?.userId}`;
  }
}
```

refresh token の実装

```ts
// reflesh token request hander
import { RequestHandler } from 'express';
import { verify } from 'jsonwebtoken';
import { User } from '../entity/User';
import { createAccessToken } from './tokenCreator';

export const refreshTokenHander: RequestHandler = async (req, res) => {
  // refresh tokenが有効であることを確認する
  const refreshToken = req.cookies.jid;
  if (!refreshToken) {
    return res.send({ ok: false, accessToken: '' });
  }
  let payload: any = null;
  try {
    payload = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
  } catch (err) {
    console.log(err);
    return res.send({ ok: false, accessToken: '' });
  }

  // refresh tokenが正しい場合は以下の処理が行われる
  const user = await User.findOne({ id: payload.userId });
  if (!user) {
    return res.send({ ok: false, accessToken: '' });
  }

  return res.send({
    ok: true,
    accessToken: createAccessToken(user),
  });
};
```

reflesh token のバージョン管理（無効にする場合は user.tokenVersion を 1 つ上げるだけで OK）

```ts
// トークン作成時にバージョンを含めておく
export const createRefreshToken = (user: User) => {
  return sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: '7d' },
  );
};
```

```ts
// refresh tokenのバージョンが古い場合はエラーとする
if (refreshToken.tokenVersion !== user.tokenVersion) {
  return res.send({ ok: false, accessToken: '' });
}
```

## frontend

- `yarn add apollo-boost @apollo/react-hooks graphql`
- `yarn add -D @types/graphql`

```tsx
// index.tsx
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';

const client = new ApolloClient({
  uri: 'http://localhost:8080/graphql',
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
```

```ts
// App.tsx
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import React from 'react';

export const App: React.FC = () => {
  const { data, loading } = useQuery(gql`
    {
      hello
    }
  `);

  if (loading) {
    return <div>loading...</div>;
  }

  return <div>{JSON.stringify(data)}</div>;
};
```

フロントエンド側に型や hook を自動生成する

- `yarn add -D @graphql-codegen/cli`
- `npx npx graphql-codegen init`
- 画面に従って設定ファイルを作成
- サーバを立ち上げた状態で`yarn gen`などを実行(設定による)
- 以上により、型ファイルだけでなく、HOC や hook が自動的に生成される

```yaml
# codegen.yml
overwrite: true
schema: 'http://localhost:8080/graphql'
documents: 'src/graphql/*.graphql'
generates:
  src/generated/graphql.tsx:
    plugins:
      - 'typescript'
      - 'typescript-operations'
      - 'typescript-react-apollo'
    config:
      withHOC: false # HOCはいらない
      withComponent: false # コンポーネントもいらない
      withHooks: true # hookだけ生成して
```

Mutation の使い方

```graphql
# register.graphql
mutation Register($email: String!, $password: String!) {
  register(email: $email, password: $password)
}

# yarn genしたあとに、コンポーネントにおいて下記のようにして使う
# const [register] = useRegisterMutation();
```

1:53:42 から
https://www.youtube.com/watch?v=25GS0MLT8JU
