
build docker app
```sh
docker build -t nodejs-tutorial .
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
