# Modifications particular to my local environment

## Setting up a GitHub webhook

Tekton wants to use a shared secret for GitHub webhooks, and fair
enough. I generated one with

```
KEY=$(ruby -rsecurerandom -e 'print SecureRandom.hex(20)')
# the name 'cuttlefacts-github-secret' matches a secretRef
# in policy/cuttlefacts/triggers.yaml
kubectl -n policy create secret generic cuttlefacts-github-secret --from-literal=key=$KEY
```

## ngrok

I run ngrok to tunnel webhook requests through to the Tekton event
listener(s). To use this:

    kubectl apply -f ngrok.yaml

This will tunnel the ngrok address through to the event listener
service (in policy/cuttlefacts/triggers.yaml). To see the ngrok
dashboard, which will tell you the address:

    kubectl port-forward -n policy 4040 deploy/ngrok
