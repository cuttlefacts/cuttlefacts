// Script to rewrite Tekton release YAML to be where I want it.
//
// This is for use with `jk generate`, e.g.,
//
//     curl curl -L https://storage.googleapis.com/tekton-releases/pipeline/latest/release.yaml | \
//       jk generate --lib jkcfg/kubernetes ./platform/tekton/ --stdout
//
// (or use `-o platform` to put it all in individual files).
//
// The parameters are `newNamespace`, in case you don't want things in
// platform/, and `controller`, which is different for e.g., the
// Tekton triggers YAML (which otherwise is amenable to this script).


import { valuesForGenerate } from '@jkcfg/kubernetes/generate';
import { read, Format } from '@jkcfg/std';
import { merge, deepWithKey } from '@jkcfg/std/merge';
import * as param from '@jkcfg/std/param';

const newNamespace = param.String('namespace', 'platform');
const controllerName = param.String('controller', 'tekton-pipelines-controller');

// mergeMap assumes the left-hand value is an array, and merges each
// item with the right-hand value (using the given rules) to get
// another array.
function mergeMap(rules) {
  return (v1, v2) => v1.map(v => merge(v, v2, rules));
}

function renamespace(v) {
  // The namespace declaration itself
  if (v.kind === 'Namespace') {
    return merge(v, { metadata: { name: newNamespace } });
  }

  // A cluster role binding subject will have a namespace, but aren't
  // namespaced themselves.
  if (v.kind === 'ClusterRoleBinding') {
    return merge(v, {
      subjects: [{ name: controllerName, namespace: newNamespace }]
    }, { subjects: deepWithKey('name') });
  }

  // Webhooks have a namespaced clientConfig, but aren't namespaced
  // themselves.
  if (v.kind === 'ValidatingWebhookConfiguration' ||
      v.kind === 'MutatingWebhookConfiguration') {
    return merge(v, {
      webhooks: {
        clientConfig: {
          service: {
            namespace: newNamespace,
          },
        },
      },
    }, { webhooks : mergeMap() });
  }

  // Anything else: if it has a namespace, give it the new namespace.
  if (v.metadata.namespace) {
    return merge(v, { metadata: { namespace: newNamespace } });
  }
  return v;
}

export default read('' /* stdin */, { format: Format.YAMLStream })
  .then(values => values.filter(v => v)
        .map(renamespace))
  .then(valuesForGenerate);
