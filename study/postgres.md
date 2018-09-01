# PostgreSQL

[[toc]]

## psql

### DB への接続

`psql` は下記のコマンドで起動する。デフォルトでは、オペレーティングシステムのユーザと同名のユーザと DB が使われる。例えば、windows のユーザ名が test の場合、`psql`コマンドは下記と同じ意味になる。

```
psql -U travelr -d test
```

### コマンド

- **\\d** リレーション一覧
- **\\dt** テーブル一覧
- **\\di** インデックス一覧

### 参考

- [psql でよく使うコマンド](https://dev.classmethod.jp/server-side/db/postgresql-organize-command/)
- [INDEX の命名規則](https://gist.github.com/popravich/d6816ef1653329fb1745)

## pg-promise

### セットアップ

```javascript
const pgPromise = require('pg-promise')();

const db = pgPromise({
  host,
  user,
  password,
  database,
});
```

### query

```javascript
// query()は汎用クエリであり、なるべく避ける。次行以降の result-specific Method を使うこと。
db.query();
db.none();
db.one();
db.oneOrNone();
db.many();
db.manyOrNone();
```

### bulk insert

```javascript
const users = [];

users.push({
  user_id: 1,
  description: 'some description',
  geom: `ST_GeomFromText('POINT(${lng} ${lat})')`,
});

// SEE: http://vitaly-t.github.io/pg-promise/helpers.ColumnSet.html
const column = [
  'user_id',
  'description',
  {
    name: 'geom',
    // サニタイズせずに、raw textとしてクエリ文に変換する。
    // 関数などを使うときに使用する。
    mod: '^',
  },
};

// 第三引数はテーブル名
const query = pgPromise.helpers.insert(users, column, 'users');

await db.none(query);
```

### 呼び出し

初期設定は下記のように行う。

```javascript
const pgPromise = require('pg-promise')(initOptions);
```

初期化以降のタイミングで、他のファイルで pg-promise のヘルパーを使う際などは、下記のように呼び出して使う。

```javascript
const pgPromise = require('pg-promise')();
pgPromise.as.format('something'); // ヘルパー
pgPromise.end(); // poolをすべて殺す
```
