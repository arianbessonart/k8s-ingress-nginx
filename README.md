
build docker app
```sh
docker build -t nodejs-tutorial .
```

tag docker image
```sh
docker tag node-app gcr.io/k8s-ingress-nginx/node-app:v1
```

push docker image
```
gcloud docker -- push gcr.io/k8s-ingress-nginx/node-app:v1
```

enable ingress addons to minikube
```sh
minikube addons enable ingress
```

use local docker images
```sh
eval $(minikube docker-env)
```

get minikube ip
```sh
minikube ip
```

Curl to LB on the service of the LB (deployment nginx-controller)
```
curl -kL -H 'Host:mysite.com' http://35.232.117.185
```

Install helm
```
https://helm.sh/docs/using_helm/#installing-helm
```

Install cert-manager
```
http://docs.cert-manager.io/en/latest/getting-started/install/kubernetes.html
```
