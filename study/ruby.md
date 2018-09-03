# Ruby

## Gem

### Gemfile

Node.js でいう`package.json`の`dependencies`に該当

### Gemfile.lock

Node.js でいう`yarn.lock`に該当

### グローバルインストールされた gem を削除

Windows の場合は、cmd で下記を実行する。これにより、デフォルト gem 以外がアンインストールされる。

```bash
ruby -e "`gem list`.split(/$/).each { |line| puts `gem uninstall -Iax #{line.split(' ')[0]}` unless line.empty? }"
gem install bundler
```

## bundler

Gemfile, Gemfile.lock を元に、ライブラリをインストールする。

インストールの際、`--path`の指定がないとグローバルインストールになる。
グローバルインストールしても問題はないが、分けておいたほうがきれい。
パスは`vendor/bundle`とするのが慣習のようだ。
一度 path を指定すると、`.bundle`に設定が保存されるため、以降は path を指定しなくてよい。

```bash
# インストール
bundle install --path=vendor/bundle

# 実行
bundle exec ${CLI_COMMAND} ${args}
```
