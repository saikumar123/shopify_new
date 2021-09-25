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

## How to push with tag:
    git tag v1.0.0                    # creates tag locally
    git push origin v1.0.0            # pushes tag to remote