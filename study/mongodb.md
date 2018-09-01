# MongoDB

[[toc]]

## 資料

- [User authentication](http://qiita.com/y-hara/items/83a86655bba48dc8b140)
- [Commands](http://qiita.com/svjunic/items/285e9cf20169d70aa1fa)
- [mongod.conf setting](https://docs.mongodb.org/v3.0/reference/configuration-options/)

## ユーザの作成

```bash
# DB admin for any database
db.createUser({
  user: "root",
  pwd: ${ROOT_PASS},
  roles:[
    { role: "dbAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" },
    { role: "userAdminAnyDatabase", db: "admin" }
  ]
});

# DB admin for specific database
use some-specific-db
db.createUser( {
  user: "john",
  pwd: ${JOHN_PASS},
  roles:[
    { role: "readWrite", db: "some-specific-db" }
  ]
});
```

## データベースへの接続

```bash
mongo www.something.com/admin -u root -p ${ROOT_PASS}
mongo www.something.com/some-specific-db -u john -p ${JOHN_PASS}
db.auth("user","pass")
```
