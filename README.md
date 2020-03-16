# Cuttle Facts

This is not just a vital resource for cuttlefish fans everywhere, but
a demonstration of how to construct a GitOps-driven application
delivery pipeline.

The pipeline and supporting infrastructure is inspired by
https://github.com/bobcatfish/catservice (as used in [this QCon
talk][qcon-bobcatfish]).

The big difference is that this demo uses Flux to make changes in the
cluster. Deploying a new image means committing a change to the git
repository, from where it is synced by git.

[qcon-bobcatfish]: https://www.infoq.com/presentations/tekton-ci-cd/

## How to use this git repository

The repository contains four directories each with a logically
distinct layer of Kubernetes configuration:

 - `substructure/`, configuring the infrastructure needed to
   bootstrap;
 - `platform/`, configuring the general machinery for building and
   delivering apps (in this case, Tekton);
 - `policy/`, which sets up the app delivery pipelines for each
   application;
 - and `app/`, which represents the applications, but is empty since
   they will have their own git repositories (that is:
   [squaremo/cuttlefacts-app][app-repo])

Each layer instantiates the one above it. For example, the `policy`
layer includes a deployment for a Flux daemon that will apply the
application configuration. This arrangement bottoms out at
`substructure`, which is self-sustaining -- it also runs a Flux
daemon, which applies the platform _and_ substructure configuration.

Therefore, to get the whole shebang running, you just need to apply
the configuration in `substructure/`:

    kubectl apply -f substructure/

However, it's likely you will want to experiment with how it works. To
do that, you'll need to fork the repo, then replace the URL to the git
repository that is given in `substructure/flux-deployment.yaml`.

Each of the layers has a README.md describing its purpose and what can
be tinkered with.

[app-repo]: https://github.com/squaremo/cuttlefacts-app
