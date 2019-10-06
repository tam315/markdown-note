# Google Cloud Platform - Associate Cloud Engineer

[[toc]]

## 基本

```sh
gcloud auth list
gcloud config list project
gcloud config set compute/zone us-central1-b
```

## Kubernetes を使った Cloud のオーケストレーション

Docker イメージを Kubernetes 上に配置する最も基本的な流れ

```sh
kubectl create
kubectl describe
kubectl exec
kubectl expose
kubectl get
kubectl label
kubectl logs
kubectl port-forward
```

```sh
gcloud compute firewall-rules create allow-monolith-nodeport --allow=tcp:31000
gcloud compute instances list
gcloud container clusters create ${cluster_name}
kubectl create -f ${filename}
kubectl create configmap ${config_name} --from-file ${filename}
kubectl create deployment ${deployment_name} --image=nginx:1.10.0
kubectl create secret generic ${secret_name} --from-file ${file_or_folder}
kubectl describe pods ${pod_name}
kubectl describe services ${service_name}
kubectl exec ${pod_name} --stdin --tty -c ${container_name} /bin/sh
kubectl expose deployment ${deployment_name} --port 80 --type LoadBalancer
kubectl get pods
kubectl get pods -l "app=monolith,secure=enabled"
kubectl get pods ${pod_name} --show-labels
kubectl get services
kubectl label pods ${pod_name} 'secure=enabled'
kubectl logs -f ${pod_name}
kubectl logs ${pod_name}
kubectl port-forward ${pod_name} 10080:80
```

- Deployment Manager
- Helm
- VPC
