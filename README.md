## How to push azure ACR:
    az login
    az acr login --name shopifyWebk8Registry
    docker build --tag shopifywebk8registry.azurecr.io/node_backend:<version> .
    docker push shopifywebk8registry.azurecr.io/node_backend:<version>

## How to create variable env for backend:
1 For prod: 
    kubectl create secret generic cosmodbconnection \
    --namespace=production \
    --from-literal=COSMOSDBURL="https://shopify-cosmos.documents.azure.com:443/"

2 For staging:
    kubectl create secret generic cosmodbconnection \
    --namespace=staging \
    --from-literal=COSMOSDBURL="https://shopify-cosmos.documents.azure.com:443/"


## Pipeline pushed only with tags.:
    git tag azure_build                   # creates tag locally     
    git push origin azure_build           # pushes tag to remote