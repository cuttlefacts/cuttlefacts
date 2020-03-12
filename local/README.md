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

To be able to push newly built images, the service account associated
with the image build **task run** needs an secret with write
permission to the Docker image repo. The format of these secrets is
[described in the Tekton
docs](https://github.com/tektoncd/pipeline/blob/master/docs/auth.md#basic-authentication-docker).

I'm using [GitHub's package
storage](https://help.github.com/en/packages/using-github-packages-with-your-projects-ecosystem/configuring-docker-for-use-with-github-packages)
to store the built images.

To create a secret for image push, I created a personal access token
in the settings page on GitHub, then, after copying it to the
clipboard:

```
# the name 'cuttlefacts-push-secret' matches the imagePullSecret
# in policy/triggers-serviceaccount.yaml
kubectl create secret generic --type=kubernetes.io/basic-auth \
  -n policy cuttlefacts-push-secret \
  --from-literal=username=squaremo \
  --from-literal=password=$(pbpaste)
kubectl annotate -n policy secret cuttlefacts-push-secret "tekton.dev/docker-0=https://docker.pkg.github.com"
```

(the annotation tells Tekton which host the secret is used for)

The service account already refers to this secret.

## ngrok

I run ngrok to tunnel webhook requests through to the Tekton event
listener(s). To use this:

    kubectl apply -f ngrok.yaml

This will tunnel the ngrok address through to the event listener
service (in policy/cuttlefacts/triggers.yaml). To see the ngrok
dashboard, which will tell you the address:

    kubectl port-forward -n policy 4040 deploy/ngrok

You can then get the webhook endpoint from http://localhost:4040/ and
set it up in the GitHub settings page for the project.
