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
