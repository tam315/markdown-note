# Bit

## 使い方

### セットアップ

```sh
bit init --package-manager yarn
bit import --compiler bit.envs/compilers/react-typescript
bit login
bit config # to show config
```

[hook 関連のエラー](https://discourse.bit.dev/t/invalid-hook-call-on-react-component/180)が出るため、package.json に下記を追加しておくこと

```json
{
  "bit": {
    "overrides": {
      "*": {
        "dependencies": {
          "react": "-"
        },
        "peerDependencies": {
          "react": "+"
        }
      }
    }
  }
}
```

### Bit.dev へのエクスポート

```sh
bit add src/components/MyComponentFolder
bit show <component_name>　# 依存関係が正しいか確認する(ReactがpeerDependenciesになっているかなど)
bit status # コンポーネントが一覧に表示されること

bit build
bit tag --all 0.0.1
bit status # stagedになっていること

bit export <username>.<collection_name>
bit status # 空になっていること

bit list # local scopeの部分にexportしたコンポーネントが記載されている
```

### 他のプロジェクトで使う

```sh
# 他のプロジェクトで
yarn add @bit/<username>.<collection_name>.<component_name>
```

### 他のプロジェクトで編集する

```sh
# (package.jsonに記載された依存先のバージョンの部分がローカルファイルを指すようになる)
bit import <username>.<collection_name>/<component_name>

# 編集する

bit tag <component_name>
bit export <username>.<collection_name>

# 元のプロジェクトで
bit import
# この状態ではまだ新しいパッケージは使われない
bit status
# 新しいパッケージを使うには
bit checkout 0.0.4 <component_name>
```

### 削除

```sh
# リモートからパッケージを消す
bit remove username.your-collection/foo/bar --remote
```
