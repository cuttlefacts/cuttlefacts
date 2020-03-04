# Substructure

This is the supporting structure for the cluster. It consists of the
things that must be running for the platform and policy (layers above)
to function.

In our case, that's a Flux daemon, syncing things from a particular
directory in a git repository (this one).

The initial files were generated with fluxctl:

```
$ fluxctl install  -o substructure/ \
  --namespace substructure \
  --git-email "michael+cuttlefacts@weave.works" \
  --git-url "git@github.com:squaremo/cuttlefacts" \
  --git-path=substructure \
  --git-path=platform \
  --git-path=policy \
  --registry-disable-scanning \
  --git-readonly
```

then edited lightly to remove some needless commentary. A namespace
manifest was added, so it can be fully self-sufficient.

In a just
world, provisioning the cluster and this Flux bootstrapping would be
done with other tooling (maybe `wksctl`?).
