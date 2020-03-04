# Substructure

This is the supporting structure for the cluster. It consists of the
things that must be running for the platform and policy (layers above)
to function.

In our case, that's a Flux daemon, syncing things from a particular
directory in a git repository (this one).

## Bootstrapping

1. The initial files were generated with fluxctl:

```
$ fluxctl install  -o substructure/ \
  --namespace substructure \
  --git-email "michael+cuttlefacts@weave.works" \
  --git-url "git@github.com:squaremo/cuttlefacts" \
  --git-path=substructure \
  --registry-disable-scanning \
  --git-readonly
```

then edited lightly to remove some needless commentary. A namespace
manifest was added, so it can be fully self-sufficient. (NB: I
originally had more `--git-path` arguments, but changed them in a
later commit.)

In a just world, provisioning the cluster and this Flux bootstrapping
would be done with other tooling (maybe `wksctl`?).

2. I added and committed those files to the git repository, and pushed to Github

3. I applied the files:

```bash
$ kubectl apply -f substructure/
```

4. I used `fluxctl --k8s-fwd-ns=substructure identity` to get the SSH
   public key, and installed it as a deploy key in this repository in
   Github.
