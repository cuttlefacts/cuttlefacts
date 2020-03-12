# Modifications particular to my local environment

There are a handful of things that will be specific to an individual
environment:

 - secrets, in particular those for external services like GitHub
 - a means of exposing webhooks endpoints

## Setting up a GitHub webhook

Tekton wants to use a shared secret for GitHub webhooks, and fair
enough. I generated one with

```
KEY=$(ruby -rsecurerandom -e 'print SecureRandom.hex(20)')
# the name 'cuttlefacts-github-secret' matches a secretRef
# in policy/cuttlefacts/triggers.yaml
kubectl -n policy create secret generic cuttlefacts-github-secret --from-literal=key=$KEY
```

## Setting up a Docker image push secret

To be able to push newly built images, the service account running the
image build task needs an imagePullSecret with write permission to the
Docker image repo.

I'm using [GitHub's package
storage](https://help.github.com/en/packages/using-github-packages-with-your-projects-ecosystem/configuring-docker-for-use-with-github-packages)
to store the built images.

To create a secret for image push, I created a personal access token
in the settings page on GitHub, then, after copying it to the
clipboard:

```
# the name 'cuttlefacts-push-secret' matches the imagePullSecret
# in policy/triggers-serviceaccount.yaml
kubectl create secret docker-registry \
  -n policy cuttlefacts-push-secret \
  --docker-server=docker.pkg.github.com \
  --docker-username=squaremo \
  --docker-password=$(pbpaste)
```

## ngrok

I run ngrok to tunnel webhook requests through to the Tekton event
listener(s). To use this:

    kubectl apply -f ngrok.yaml

This will tunnel the ngrok address through to the event listener
service (in policy/cuttlefacts/triggers.yaml). To see the ngrok
dashboard, which will tell you the address:

    kubectl port-forward -n policy 4040 deploy/ngrok
