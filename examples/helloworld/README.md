# Hello world pipeline

This is just to verify that Tekton is correctly installed and can run
stuff.

```bash
kubectl apply -f pipeline.yaml
```

then run it and look at the output:

```bash
tkn pipeline start demo-pipeline
# this reports the pipeline run's name
tkn pipelinerun logs <name>
```

This pipeline doesn't use any storage. To test that, we need another
pipeline.

