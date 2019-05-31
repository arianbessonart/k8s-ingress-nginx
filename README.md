
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

Curl to LB on the service of the LB (deployment nginx-controller)
```
curl -kL -H 'Host:mysite.com' http://35.232.117.185
```
