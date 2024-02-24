# docker

## Build

### Local Docker Build

multi-platform, multi-stage, multi-module local build

login to GHCR first.

```shell
export GITHUB_PACKAGES_TOKEN=<ghp_XXX>
echo $GITHUB_PACKAGES_TOKEN | docker login ghcr.io -u xmlking --password-stdin
```

(Optional) Prefetch and cache base images to speedup docker builds

```shell
docker pull --platform linux/amd64 node:20
docker pull --platform linux/arm64/v8 node:20
docker pull --platform linux/amd64 node:20-alpine
docker pull --platform linux/arm64/v8 node:20-alpine
docker pull --platform linux/amd64 gcr.io/distroless/nodejs:20
docker pull --platform linux/arm64/v8 gcr.io/distroless/nodejs:20
```

Build and publish docker image to ghcr.io

```shell
#VERSION=$(git describe --tags || echo "HEAD")
VERSION=v0.1.3
BUILD_TIME=$(date +%FT%T%Z)
REGISTRY=ghcr.io
#REGISTRY=us-west1-docker.pkg.dev/<project_id>/docker
TURBO_TEAM=cloudbusters
TURBO_TOKEN=r5tgcj65H0sBLx7E1ki9jDr4
SCOPE=console
IMAGE_NAME=xmlking/spectacular
DOCKER_IMAGE=$REGISTRY/$IMAGE_NAME/$SCOPE

#(optional) enable buildx
export DOCKER_CLI_EXPERIMENTAL=enabled
docker buildx create --use

> Note: to desable **cache**,  use `--no-cache` option

# build for local platform
docker build \
-t $DOCKER_IMAGE\:$VERSION \
-t $DOCKER_IMAGE\:latest \
--build-arg BUILD_TIME=$BUILD_TIME --build-arg BUILD_VERSION=$VERSION --build-arg SCOPE=$SCOPE \
--progress=plain \
--load .

# (or) build for multi-plateform and push
docker buildx build \
--platform linux/arm64/v8,linux/amd64 \
-t $DOCKER_IMAGE\:$VERSION \
-t $DOCKER_IMAGE\:latest \
--build-arg BUILD_TIME=$BUILD_TIME --build-arg BUILD_VERSION=$VERSION --build-arg SCOPE=$SCOPE \
--progress=plain \
--push .

# run
docker run \
--rm -it \
-p 3000:3000 \
--platform=linux/arm64 \
--name $SCOPE $DOCKER_IMAGE\:latest

# (optional) pull recent images from GHCR
docker pull --platform linux/arm64/v8 $DOCKER_IMAGE\:latest
docker pull --platform linux/amd64 $DOCKER_IMAGE\:latest
docker pull --platform linux/arm64/v8 $DOCKER_IMAGE\:$VERSION
docker pull --platform linux/amd64 $DOCKER_IMAGE\:$VERSION

# inspect
docker buildx imagetools inspect $DOCKER_IMAGE:$VERSION
docker buildx imagetools inspect --raw $DOCKER_IMAGE:$VERSION
docker inspect --format "{{.Architecture}}" $DOCKER_IMAGE:$VERSION

# run
docker run -it --rm --platform linux/amd64 -p 3000:3000 \
-e NODE_ENV=production -e ORIGIN=http://localhost:3000 --env-file ./.env $DOCKER_IMAGE:$VERSION

docker run -it --rm --platform linux/arm64/v8 -p 3000:3000 \
-e NODE_ENV=production -e ORIGIN=http://localhost:3000 --env-file ./.env $DOCKER_IMAGE:$VERSION
## (or)
docker compose up

## Debug
# when built from `FROM gcr.io/distroless/nodejs:19-debug`, you can debug by running:
docker run --rm -it --entrypoint=sh $DOCKER_IMAGE:$VERSION
# other option to explore docker image is via dive
dive $DOCKER_IMAGE:$VERSION
```

Sign Docker image and push with Keyless mode

```shell
#nerdctl push --sign=cosign ghcr.io/xmlking/spectacular:$VERSION
COSIGN_EXPERIMENTAL=1 cosign $DOCKER_IMAGE:$VERSION
```

Verify the image with Keyless mode

```shell
#nerdctl pull --verify=cosign ghcr.io/xmlking/spectacular:$VERSION
COSIGN_EXPERIMENTAL=1 cosign verify $DOCKER_IMAGE:$VERSION
```

### GitHub Action
Build environment variables are needed during docker build in `GitHub Action`  
**TODO:** pass `GitHub Sectets` as described in `Reference` and [example 1](https://github.com/SSHOC/gl-autodevops-minimal-port/blob/main/.github/workflows/build-herokuish-and-push-to-registry.yaml#L95)

## Reference
- [Sharing environment variables using Github Action secrets](https://andrei-calazans.com/posts/2021-06-23-passing-secrets-github-actions-docker/)
- [How to use Github Action secrets with your Docker image](https://medium.com/@brian978_dev/effortlessly-secure-passing-secrets-from-github-to-your-docker-image-f1df3b6d0e49)
