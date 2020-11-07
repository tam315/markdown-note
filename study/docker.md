# Docker

## コマンド

まとめ：https://qiita.com/curseoff/items/a9e64ad01d673abb6866

```bash
docker image ls #イメージ一覧
docker ps #コンテナ一覧
docker exec -it ${CONTAINER_NAME_OR_ID} /bin/bash　# container に入る

# image を pull し、container を run する
docker run \
  --name some-postgis \
  -d \
  --rm \
  -p 5432:5432 \
  -v c:/test:/backup \
  --mount 'src=postgres,target=/var/lib/postgresql/data' \
  -e POSTGRES_PASSWORD=testpass \
  ${IMAGE_NAME}

# ファイルのコピー
docker cp ${CONTAINER_ID}:/etc/my.cnf my.cnf
```

### ボリューム

ボリュームのマウント方法には、bind mounts(`-v` オプション) と volumes(`--mount` オプション) がある。

#### volumes

- ドキュメント：https://docs.docker.com/storage/volumes/
- 抽象度が高く互換性に優れているものの、ホストから直接操作はできない。

```bash
# 'postgres'というvolumeをホストに作成する
docker volume create postgres

# 作成したvolumeの情報を確認する
docker volume inspect postgres

# volumeを使ってコンテナを開始する
docker run --mount 'src=postgres,target=/var/lib/postgresql/data'
```

#### bind mounts

ホストから直接操作できるメリットがある。

```bash
docker run -v c:/test:/backup
```

## Tips

### フロント環境の再ビルドが遅い

[参考](https://qiita.com/yuki_ycino/items/cb21cf91a39ddd61f484)

[Mutagen-based caching](https://docs.docker.com/docker-for-mac/mutagen-caching/)を使え。

以下、古い情報

フロント環境を docker で構築した際、ビルド環境が遅くなってしまう。これは主に`node_modules`をホスト側と共有してしまっていることが理由である。設定をオーバーライドし、`node_modules`だけは docker 側でネイティブに動作するようにすると高速化する。

```yaml
version: '3.3'
services:
  some_frontend:
    image: node:10.11
    container_name: some_frontend
    volumes:
      - ./:/root/project_root
      # node_modules だけは共有しない
      - /root/project_root/node_modules/
```

### windows 環境において webpack の watch が動作しない

フロント環境を docker で構築した際、windows 環境では watch 機能が動作しない（2019.04.09 時点）。これを動作させるには、以下のような設定を`webpack.config.js`に記載する。

```js
module.exports = {
  /* ... */
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 300,
    poll: 500,
  },
};
```

### 軽量な Next.js 環境を作る

Dockerfile

```Dockerfile
FROM node:12.18.4 AS BUILD_IMAGE

WORKDIR /usr/src/app

COPY ./package.json ./yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

RUN rm -rf node_modules
RUN yarn install --prod

#
# Reasons to create another container:
# - As building fails on alpine linux
# - To keep node_modules small by excluding node_modules caches which is generated on install
#
# https://medium.com/trendyol-tech/how-we-reduce-node-docker-image-size-in-3-steps-ff2762b51d5a
#

FROM node:12.18.4-alpine as RUNNER

ENV NODE_ENV=production

COPY . .
COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules
COPY --from=BUILD_IMAGE /usr/src/app/.next ./.next

EXPOSE 8080

CMD ["yarn", "next", "start", "-p", "8080"]
```
