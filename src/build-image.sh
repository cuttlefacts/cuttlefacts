#!/bin/bash

# This is a script to build the app image, to act as a stepping-stone
# if needed. It'll build the image, but you'll still need to push it
# somewhere. I used it this way:
#
#  1. generate a personal access token for github, with
#     `package:{read,write}` permission and copy to clipboard;
#  2.     pbpaste | docker login --username squaremo --password-stdin \
#           docker.pkg.github.com
#  3. run this script
#  4. docker push docker.pkg.github.com/squaremo/cuttlefacts/app

ORG=squaremo

set -xe

docker build . -t docker.pkg.github.com/${ORG}/cuttlefacts/app
