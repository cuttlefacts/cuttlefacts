# Platform

This layer has cluster-wide or otherwise generic services, and the
components used to enact and enforce policy (the particulars of which
are in the layer above).

In this case, the main article of platform is Tekton, which will drive
standard pipelines defined in the policy layer.

The Flux daemon running in substructure is also used to control the
platform layer, here, because I'm on control of both of them. This may
not be the case for other systems, where there's say an operations
team provisioning the cluster and substructure, then other teams who
can layer other stuff on top.

The Tekton pipelines installation files were created by downloading a
big YAML according to [the instructions][tekton-install], and running
it through a `jk` script to a.) rewrite the namespace it lives in, and
b.) put it all in separate files with nice names. See
[./platform/tekton/index.js][].

The [Tekton triggers controller][tekton-triggers] and its entourage of YAMLs are
processed with the same script (though using a parameter to adjust it
slightly -- see the script itself).

## Verifying Tekton

You can see if Tekton is doing anything by making a "Hello World"
pipeline, and checking if you can run it.

There is a helloworld pipeline defined in [examples/helloworld][],
which will do just that. It does not demonstrate the use of storage,
though.

[tekton-install]: https://github.com/tektoncd/pipeline/blob/master/docs/install.md#installing-tekton-pipelines-on-kubernetes
[tekton-triggers]: https://github.com/tektoncd/triggers/blob/master/docs/getting-started/README.md

## Persistent volumes for Tekton

This (barely changed) setup for Tekton relies on there being a
[default storage
class](https://kubernetes.io/docs/concepts/storage/storage-classes/).

You'll need to either rely on the environment supplying a default
storage class, which is a decent starting option:

 - [GKE](https://cloud.google.com/kubernetes-engine/docs/concepts/persistent-volumes)
   supplies a default storage class;
 - [AKS](https://docs.microsoft.com/en-us/azure/aks/concepts-storage#storage-classes)
   supplies a default storage class.
 - For
   [EKS](https://docs.aws.amazon.com/eks/latest/userguide/storage-classes.html),
   you need to create a default storage class;
 - Minikube, like Docker for Desktop, has a default storage class with
   [its own
   provisioner](https://minikube.sigs.k8s.io/docs/reference/persistent_volumes/).

If you need to use another, non-default storage class, you can put its
name in
[platform/tekton/config-artifact-pvc-configmap.yaml](../../platform/tekton/config-artifact-pvc-configmap.yaml)
and restart the pipeline controller.

## Ingress

I am using the [Nginx ingress controller][ingress-nginx], with the
configuration in [`./ingress`][]. Consult the linked deployment
document for variations specific to your environment.

[ingress-nginx]: https://kubernetes.github.io/ingress-nginx/deploy/
