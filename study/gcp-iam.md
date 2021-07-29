# Google Cloud IAM

## IAM とは

誰(Member)が、どんな役割(Role)を、何(Rosource)に対して持っているかを決定する仕組み

## 用語

https://cloud.google.com/iam/docs/overview

- Member
  - Google Account
  - Service Account(Google Account の機械版みたいなもの)
  - Google workspace domain
- Permission
  - 何ができるか
  - 直接メンバーに付与することはできない。ロールを介して付与する。
  - `service.resource.verb`の形で定義される
- Role
  - いくつかの Permission をまとめたもの
  - ベーシックロール（`Owner`など。古い）や事前定義ロール(`roles/pubsub.publisher`など)などがある
- Policies
  - Member と Role の組み合わせを定義したもの。
  - Resouce にアタッチして使用する。
    - どの Resouce にアタッチするかにより、**権限の及ぶ範囲**をコントロールできる。
    - 例えば、プロジェクトにアタッチすれば影響はプロジェクト全体に及ぶ
    - Cloud Storage の個別のバケットにアタッチすれば、影響はそのバケットだけに及ぶ
  - メンバーの指定は`user:***`や`serviceAccount:***`のように記載する。詳細は[マニュアル](https://cloud.google.com/iam/docs/overview?hl=en#cloud-iam-policy)を参照。
- Resouces
  - Google Cloud を構成する要素。
    - 仮想マシン、GCS バケット、組織、プロジェクトなど。
  - リソースは階層構造をしている。組織がルートノードで、個々の仮想マシンなどは最下位のリソース。
  - Policy は上位リソースから下位リソースに継承される

## Application Default Credential(ADC)

https://cloud.google.com/docs/authentication/production?hl=ja

- サービスアカウントの自動検出機能を使用できる環境
  - Compute Engine
  - Google Kubernetes Engine
  - App Engine
  - Cloud Run
  - Cloud Functions
- 優先順位
  1. `GOOGLE_APPLICATION_CREDENTIALS`環境変数がある場合は、そこで指定されているサービスアカウント
  2. コードが動作しているリソースに紐付けられたサービスアカウント(例：Compute Engine なら個々のインスタンスにおいて指定されているサービスアカウント)
  3. Compute Engine, Google Kubernetes Engine, App Engine, Cloud Run, Cloud Functions のデフォルトのサービスアカウント(`PROJECT_NUMBER-compute@developer.gserviceaccount.com`など)

## Cloud Run

https://cloud.google.com/run/docs/securing/service-identity?hl=ja

- ランタイム時のサービスアカウントを指定することができる（以下、ランタイム時 SA）
- ランタイム時 SA を指定するには、Cloud Run のサービス作成時に作成者がランタイム時 SA リソースに対して`iam.serviceAccounts.actAs`の権限を持っている必要がある。
  - サービスアカウントはリソースでもある点に注意
  - 作成者 => コンソールなら自身の Google アカウント、Cloud Build 等ならそれが使用しているサービスアカウント
- 何も指定しなければ Compute Engine のデフォルトのサービス アカウント(`PROJECT_NUMBER-compute@developer.gserviceaccount.com`)が使用される。このアカウントはなんでもできて危険なので注意する。
