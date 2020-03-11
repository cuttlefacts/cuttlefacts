# Policy layer

This layer enables and enforces policy for the cluster. Here, "policy"
means all the decisions that are set about how applications are
delivered into and run in the cluster, as opposed to the substance of
the applications themselves.

This layer is distinct from the `platform` below it, which is generic
machinery upon which policy depends, and `app` above it, which runs
the application code.

For our purposes, policy will boil down to:

 - standard pipelines, triggers, and task definitions*;
 - for each app in the app layer (i.e., [`cuttlefacts/`][]):
   - a namespace for it to live in;
   - a Flux deployment that will sync its configuration;
   - any instances of pipelines or triggers that are
     necessary to deliver the application code into the cluster.

Each app gets its own directory here, but the resources defined within
do not usually live in the namespace of the app -- those are kept to a
minimum, since the namespace should be for the app.

*There's no cluster-scoped pipeline in Tekton at present, so we'll
pretend that these things can be "stamped out" for each app, from some
standard definition.

### Authorisation in the policy layer

I have not attempted to nail down the permissions, just to demonstrate
that authorisation can be set in the policy layer.

 - There is a `ClusterRole` defining the authorisation needed by Flux
   within a given namespace
 - Each application Flux daemon runs in the `policy` namespace and is
   given its own service account.
 - Each application Flux's service account has a RoleBinding to the
   generic `ClusterRole`, narrowing it to the _application_ namespace.
 - All Tekton triggers run with the same ServiceAccount which has
   wide-ranging permissions in the cluster. It's probably possible to
   narrow the permissions down to the particular namespace of the app,
   and otherwise try to restrict what can be triggered.

## Flux

Each application gets a Flux daemon to sync configuration from its git
repo. For `cuttlefacts` I ran the following:

    fluxctl install --namespace=policy \
      --git-readonly --registry-disable-scanning \
      --git-url https://github.com/squaremo/cuttlefacts \
      --git-email "example@example.com" > policy/cuttlefacts/flux.yaml

then edited it to remove unnecessary volumes and so on.

I also removed the generated RBAC definitions, which give wide-ranging
permissions, and created a new set as described below.

## Standard tasks and pipelines

One job of the policy layer is to provide a kind of delivery harness
for each of the applications. To do so, there are standard pipelines
to build and run new code, and triggers that to kick them off.
