# PostGIS

[[toc]]

## Query

### 前提

下記のテーブルがあると想定。

```sql
CREATE TABLE posts
  (
    id            SERIAL PRIMARY KEY,
    geom          GEOMETRY(POINT),
  );
```

### ST_AsText

テキストで出力する。

```sql
ST_AsText(geom) -- => text型 'POINT(139.763995 35.681235)'
```

### ST_X, ST_Y

座標値を数値で得る

```sql
ST_X(geom) -- => double型 139.763995
ST_Y(geom)
```

### ST_DWithin

指定したポイント（135 35）から 50km 以内のレコードを抽出する。第 3 引数を false にすることで、メートルでの指定ができる。

```sql
SELECT * FROM posts WHERE ST_DWithin(geom, ST_GeomFromText('POINT(135 35)'), 50000, true)
```

### ST_PolygonFromText

テキストからポリゴンを作成する

```sql
ST_PolygonFromText('POLYGON((0 10, 10 10, 0 0, 0 10))')
-- => geometry型
```

### ST_Within, ST_Contains

geom が POLYGON の範囲に含まれるレコードを抽出する。なお、Within と Contains は引数の順序が変わるだけ。

```sql
SELECT * FROM posts
  WHERE ST_Within(geom, ST_PolygonFromText('POLYGON((0 10, 10 10, 0 0, 0 10))'))

SELECT * FROM posts
  WHERE ST_Contains(ST_PolygonFromText('POLYGON((0 10, 10 10, 0 0, 0 10))'), geom)
```

### ST_distance, ST_GeomFromText

ST_distance は、2 点間の距離を計る。第 3 引数が true なら degree で、false なら meter で結果を出力する。

ST_GeomFromText はテキストからポイントを作成する。

```sql
SELECT ST_distance(geom, ST_GeomFromText('point(145 45)', 4326), false)
  FROM posts

-- => double型　10.6890191077222
```

### ST_Transform

座標系を変換する。

```sql
ST_Transform(<ジオメトリ>,<変換先SRID>)
```

## Index の作成

```sql
CREATE INDEX posts_geom_idx ON posts USING GIST (geom);
```

## その他

[緯度経度付きデータを入れた後に Geometory 型にする方法](https://qiita.com/K-1/items/cea1354ac05e95d38961)
