# Cuttle facts

This is not just a vital resource for cuttlefish fans everywhere, but
a demonstration of how to construct a GitOps-driven application
delivery pipeline.

Much of the supporting infrastructure is directly adapted from
https://github.com/bobcatfish/catservice (as used in [this QCon
talk][qcon-bobcatfish]).

The big difference is that this demo uses Flux to make changes in the
cluster. Deploying a new image means committing a change to the git
repository, from where it is synced by git.

[qcon-bobcatfish]: https://www.infoq.com/presentations/tekton-ci-cd/
