#!/bin/bash

docker build -t node-app .
docker tag node-app gcr.io/k8s-ingress-nginx/node-app:$1
docker push gcr.io/k8s-ingress-nginx/node-app:$1
