# Terraform

以下、GCP での例

## 参照資料

- [構成ファイルの書き方](https://registry.terraform.io/providers/hashicorp/google/latest/docs)

## 事前準備

- Google Cloud
  - プロジェクトを作る
  - サービスアカウントキーを作る
    - IAM & Admin -> Service Accounts -> Create service account
    - 名前は適当につける
    - 権限は`Editor`にする
    - 作成後、JSON 形式のキーを生成してダウンロードする
  - 使用する API を有効化しておく
- [Web マスターセントラル](https://www.google.com/webmasters/verification/home)の該当ドメインの確認済みサイト所有者に、作成したサービスアカウントのメールアドレスを追加しておく。
  - これをしておかないと Google cloud storage にドメイン名を付したバケットを作ろうとした時に拒否される。

## 構成ファイルの基本

```terraform
# Terraform Registryからどのプロバイダをダウンロードするか
terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
      # Optional but recommended
      version = "3.5.0"
    }
  }
}

# プロバイダはリソースを作成・管理する責任を負う
provider "google" {
  credentials = file("goodmenu-dev-cf8aef4d27c0.json")
  project = var.project
  region  = var.region
  zone    = var.zone
}

# リソースは`resource type`と`resource name`(名前は自由)からなる
# - Resource type の prefix (`google_`)はプロバイダを示す
# - resource IDは`google_compute_network.vpc_network`になる
resource "google_compute_network" "vpc_network" {
  name = "terraform-network"
}
```

## コマンド

```sh
terraform init # 一番最初にだけ実行
terraform plan # プランだけを見たい時
terraform apply
terraform destroy
terraform show # 現在の状態を見る
```

プランを事前に確定させて、後から実行したいとき

```sh
terraform plan -out some_plan
terrafrom apply some_plan
```

## 乱数を使う

`random_string`リソースタイプを使う

```terraform
resource "random_string" "my_bucket_name" {
  length  = 8
  special = false
  upper   = false
}

resource "google_storage_bucket" "example_bucket" {
  name     = "learn-gcp-${random_string.my_bucket_name.result}"
}
```

上記を実行すると、`learn-gcp-jxt5163o`のようなバケットが作成される。

## 依存関係

依存関係は自動的に推論される。
どうしても明示的に指定する必要がある場合に限り、下記のように記載する。

```terraform
resource "google_compute_instance" "some_instance" {
  depends_on = [google_storage_bucket.example_bucket]
}
```

## Provisioning

- [Provisioner](https://www.terraform.io/docs/language/resources/provisioners/index.html)を使うことで、EC2 インスタンスへの初期設定などを行うことができる。
  - （本来は Packer などでイメージを事前に固めておくことが推奨されている）
  - インスタンスの IP をローカルにテキストファイルとして保存する[例](https://learn.hashicorp.com/tutorials/terraform/google-cloud-platform-provision?in=terraform/gcp-get-started#defining-a-provisioner)
- Provisioner は初回作成時にのみ適用される。
- 後から適用したい場合は`terraform taint google_compute_instance.my_instance`などして「汚して」おくと、リソースが再作成され、Provisioner も適用される。
- 破壊時に適用される「Destroy Provisioners」というものもあるが、省略

## 入力値を定義する

- 入力値を定義するには、`variables.tf`などを作成（任意）して以下のようにする。
- 使用する際は`var.credentials_file`のようにする。
- `default`を指定すると、その値はオプショナルになる

```tr
variable "project" { }

variable "region" {
  default = "us-central1"
}
```

値の入力はいくつか方法があるので[マニュアル](https://learn.hashicorp.com/tutorials/terraform/google-cloud-platform-variables?in=terraform/gcp-get-started#assigning-variables)を参照すること

- コマンドラインから
- テキストファイルから
- 環境変数から(`TF_VAR_*****`)
- `terraform apply`時などに UI から

使用できる値の型は以下の通り

- Strings
- Numbers
- Lists
- Map

## 出力

`outputs.tf`などを作成（任意）する。下記の例では`ip`という Output を定義している。

```tr
output "ip" {
  value = google_compute_address.vm_static_ip.address
}
```

- `terraform refresh|apply`すると Output が表示される
- CI で使うときは`terraform output`の出力をパースするとよい

```sh
$ terraform output
ip = "34.67.140.206"
```

## 状態ファイルの保管

- 状態ファイル(.tfstate)をなくすと非常にめんどくさいことになるので、クラウドで保管しておくと良い。
- Terraform cloud が一番簡単そう。コンソールの General Settings の Execution mode を local にしておくことで、状態ファイルの管理のみをクラウドで行うことができる。

```tf
terraform {
  backend "remote" {
    organization = "yuuniworks"

    workspaces {
      name = "my-workspace-name(developmentなど)"
    }
  }
}
```
