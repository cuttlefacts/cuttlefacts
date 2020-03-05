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

[tekton-install]: https://github.com/tektoncd/pipeline/blob/master/docs/install.md#installing-tekton-pipelines-on-kubernetes
[tekton-triggers]: https://github.com/tektoncd/triggers/blob/master/docs/getting-started/README.md
