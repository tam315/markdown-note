# CircleCI

## コンフィグの書き方

`.circleci/config.yml`の書き方は[こちら](https://circleci.com/docs/2.0/configuration-reference/)に網羅されている。

## 基本

```yml
version: 2
jobs:
  build: # ここの名前は固定
    docker:
      - image: circleci/ruby:2.4.1
    steps:
      - checkout # リポジトリをクローンする
      - run: echo "A first hello"
```

ワークフロー機能を使う場合

```yml
version: 2
jobs:
  one: # ワークフローを使う場合は、ここの名前は好きに変えられる
    docker:
      - image: circleci/ruby:2.4.1
    steps:
      - checkout
      - run: echo "A first hello"
  two: # ワークフローを使う場合は、ここの名前は好きに変えられる
    docker:
      - image: circleci/ruby:2.4.1
    steps:
      - checkout
      - run: echo "A more familiar hi"
workflows:
  version: 2
  one_and_two:
    jobs:
      - one
      - two
        requires: # 依存関係を作って順番に実行したい場合
              - one
```

データベースなど、複数のコンテナを組み合わせて使いたいとき

```yml
version: 2
jobs:
  build:
    docker:
      # こちらがCIの実行環境になる。プライマリと呼ぶ。
      - image: circleci/ruby:2.4.1
      # こちらはCIの実行環境にはならないが、EXPOSEされているポートは
      # プライマリからlocalhost経由でアクセス可能になる。
      - image: postgres:9.4.1
```

### キャッシュの利用

```yml
jobs:
  build:
    steps:
      - restore_cache:
          keys:
            - node-v1-{{ .Branch }}-{{ checksum "front/yarn.lock" }}
      - save_cache:
          paths: # どのフォルダを保存するか
            - ~/app/front/node_modules
          key: node-v1-{{ .Branch }}-{{ checksum "front/yarn.lock" }}
```

### 実行環境

docker / machine(linux) / macos / windows から選択できる。

### 用語

- Step --- job を構成する個々の動作のこと。ソースのクローンやコマンドの実行など。
- Image --- CI が実行されるコンテナ環境のこと。2 つ以上指定した場合は、最初に記載したほうがプライマリ実行環境になる。
- Jobs --- Step のまとまり。
- Workflow --- Job に依存関係を作ったり、順番に実行したりする機能。
- Workspace --- ビルド時に複数の Job 間でファイルを共有する機能。
- Artifacts --- ビルド時に発生した特定のファイルなどを、後で Web-UI から確認したりダウンロードしたりできる機能。

### Docker 関連

カスタムな Docker イメージをビルドしたり実行したりしたい場合の方法については、[こちら](https://circleci.com/blog/how-to-build-a-docker-image-on-circleci-2-0/)のブログが詳しい。

- 実行環境に`machine`を選ぶ場合
  - ローカル環境と何も変わらない環境でビルドできるので楽ではあるものの、今後有料になる可能性が示唆されている。
- 実行環境に`docker`を選ぶ場合
  - CircleCI の実行環境で Docker を実行すると、コンテナは隔離されたリモート環境で実行される。Docker in Docker のようなイメージ。
  - CircleCI の実行環境にあるファイルを、Docker のリモート環境と共有することはできない（`-v`オプションは機能しない）。ビルド時に全てのファイルを含めるか、実行時に`docker copy`コマンドなどを使う必要がある。
