# [Kubernetes](http://kubernetes.io/docs/)

[[toc]]

## 環境構築メモ

1. クラスタ作成
1. `gcloud`, `kubectl` の認証設定
1. [ブログ](https://www.yuuniworks.com/blog/2018-06-14-kubernetes%E3%81%A7%E8%A4%87%E6%95%B0%E3%81%AEweb%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9%E3%82%92%E6%A5%BD%E3%81%AB%E7%AE%A1%E7%90%86%E3%81%99%E3%82%8B/)を参考に証明書の自動取得環境を設定
1. secret のアップロード（Googie Drive に原本あり）

## コマンド

### 認証

```bash
gcloud auth login
gcloud config set project ${PROJECT_ID}
gcloud container clusters get-credentials ${CLUSTER_NAME} # kubectlの認証
```

### 情報の取得

```bash
# TYPE = (node | svc | deploy | pod)

kubectl get ${TYPE}
  -o yaml
  -l KEY=VALUE # tagで検索

kubectl logs ${POD_NAME}

kubectl describe ${TYPE} ${NAME}

kubectl top node
```

### cli でのデプロイ等

```bash
# deploy from images
kubectl run ${DEPLOY_NAME} \
  --image ${IMAGE_NAME}
  [--port 80] \
  [--requests='cpu=0'] \
  [--rm] \
  [-it] \
  [${COMMAND}] # 指定した場合、DockerfileのCMDは無視される

# create service (expose deploy)
kubectl expose deployment ${DEPLOY_NAME}
  --port=80
  --type=LoadBalancer
  --load-balancer-ip="104.199.216.116"

# scale deployment
kubectl scale deployment ${DEPLOY_NAME} --replicas=4
kubectl autoscale deployment ${DEPLOY_NAME} --min=1 --max=3

# delete
kubectl delete ${TYPE} ${NAME}
```

### YAML ファイルの操作

```bash
kubectl apply -f *****.yml
kubectl delete -f *****.yml

# edit yaml
kubectl edit ${TYPE} ${NAME}
```

### Pod の操作

```bash
kubectl exec ${POD_NAME} env
kubectl exec ${POD_NAME} ls /
kubectl exec -it ${POD_NAME} bash
```

### クラスタの操作

```bash
gcloud container clusters create \
  --machine-type custom-1-1024 \
  --num-nodes 1 \
  --disk-size 10 \
  ${CLUSTER_NAME}
gcloud container clusters resize --size 2 ${CLUSTER_NAME}
gcloud container clusters delete ${CLUSTER_NAME}
```

### ローカル環境との接続

```bash
# port-forward
kubectl port-forward ${POD_NAME} 5432:5432

# copy files
kubectl cp ${POD_NAME}:/tmp/foo /tmp/bar
```

## Volumes

GCE Persistent disk を使うためには下記の 4 段階の処理が必要となる。

1.  PV を作成
1.  PVC を作成
1.  Pod.spec.volumes において PVC を指定
1.  Pod.spec.containers[].volumeMounts で、上記の Volume とマウントポイントを指定

- https://kubernetes.io/docs/concepts/storage/persistent-volumes/
- https://kubernetes.io/docs/tasks/configure-pod-container/configure-persistent-volume-storage/

### Persistent Volume

ボリューム自身（ディスクなど）。Pod のライフサイクルとは分離している。

### Persistent Volume Claim

ボリュームの要件。Pod が Node のリソースを消費するように、PVC は PV を消費する。

## Ingress

### 機能

- バーチャルホスト
- TLS 通信を終端
- ロードバランサ

### 構成要素

<img src="https://storage.googleapis.com/gcp-community/tutorials/nginx-ingress-gke/Nginx%20Ingress%20on%20GCP%20-%20Fig%2001.png" width=500px/>

- Ingress Controller: HTTP エンドポイント/ロードバランサとして機能する
- Ingress Resource: 通信をどのようにサービスにつなげるか、というルール。

### セットアップ

[ブログ](https://www.yuuniworks.com/blog/2018-06-14-kubernetes%E3%81%A7%E8%A4%87%E6%95%B0%E3%81%AEweb%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9%E3%82%92%E6%A5%BD%E3%81%AB%E7%AE%A1%E7%90%86%E3%81%99%E3%82%8B/)を参考に設定する。

- Service の spec.type は **NodePort** にする
- Deployment に `ReadinessProve` を書いておかないと起動に失敗する。
- Ingress が Readiness を確認するまでに 5 ～ 10 分くらいかかる。その間、502 や 404 エラーが表示される。
- Virtual Host を使った場合、当てはまるルートがない場合は default backend という kube-system ネームスペースに用意された Pod に転送される（404 エラーを返す）

## Helm

helm は、kubernetes のクライアントサイドのパッケージマネージャ。
下記の二つからなる。あらかじめバイナリをダウンロードし、パスを通しておくこと。

- helm: クライアントサイド
- Tiller: サーバサイド

```powershell
# kube-systemネームスペースに、tillerというサービスアカウントを作成
kubectl create serviceaccount tiller --namespace kube-system

# tillerアカウントにcluster-adminの権限をバインドする（与える）
kubectl create clusterrolebinding tiller-binding `
  --clusterrole=cluster-admin `
  --serviceaccount=kube-system:tiller

# Tiller(helmのサーバサイドコンポーネント)を作成し、アップデートする
helm init --upgrade --service-account tiller
```

## Health check

- **Liveness prove** Check if pods lives. if not, pods restarted.
- **Readiness prove** Check if pod is ready. if not, traffic is not sent to pods until it is ready.

## その他

- Network Tier は Tokyo Region ではまだ使えない。使うと kubenetes でロードバランサの IP が払い出せないなどの不具合が出る。
