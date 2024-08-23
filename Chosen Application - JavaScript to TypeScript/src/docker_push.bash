#!/bin/bash
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker push johnrellis/johnrellis-users-api:"$TRAVIS_BUILD_NUMBER"