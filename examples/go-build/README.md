# Pipeline using storage

This pipeline shows tasks sharing storage. It needs the controller to
have been configured with "artifact storage" -- that is, given a means
to either access a persistent volume, or a cloud storage (S3) bucket.

The pipeline consists of two tasks: one builds a go binary from a git
repo, and another simply lists the file that was built, as a check
that it is in the filesystem.

## Running the tasks and pipeline

You should be able to run this as-is, so long as you have given Tekton
a persistent volume or cloud storage bucket to use.

Create the resource, the tasks and the pipeline:

```
kubectl apply -f pipeline.yaml
```

You can run one of the tasks:

```
tkn task start -i repo=cuttlefacts-repo -p filename=README.md check-file-exists --showlog
```

(NB at this time, `tkn` does not understand v1beta1 resources, and
will have problems with parameters -- the above should work, but will
probably give you an error).

.. and run the pipeline:

```
tkn pipeline start build-check -r source=cuttlefacts-repo --showlog
```
