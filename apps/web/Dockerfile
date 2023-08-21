# syntax=docker/dockerfile:1.4
############################################################
### stage_tini
### add tini to act as PID1 for proper signal handling
############################################################
FROM --platform=${BUILDPLATFORM} alpine as tini
ENV TINI_VERSION v0.19.0
# Use BuildKit to help translate architecture names
ARG TARGETPLATFORM
# translating Docker's TARGETPLATFORM into tini download names
RUN case ${TARGETPLATFORM} in \
	"linux/amd64")  TINI_ARCH=amd64  ;; \
	"linux/arm64")  TINI_ARCH=arm64  ;; \
	"linux/arm/v7") TINI_ARCH=armhf  ;; \
	"linux/arm/v6") TINI_ARCH=armel  ;; \
	"linux/386")    TINI_ARCH=i386   ;; \
	esac \
	&& wget -q https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini-static-${TINI_ARCH} -O /tini \
	&& chmod +x /tini

############################################################
### stage_build
### this stage builds the application.
############################################################
FROM --platform=${BUILDPLATFORM} node:20 as build

# install pnpm
#RUN curl -fsSL https://get.pnpm.io/install.sh | sh -; node - add --global pnpm
RUN corepack enable; corepack prepare pnpm@8.6.0 --activate

# build-args are used in vite.config.ts
ARG BUILD_TIME
ARG BUILD_VERSION
ARG BUILD_REVISION

WORKDIR /app

# clean install all dependencies (except optional)
COPY ./patches/ ./patches/
COPY .npmrc package.json pnpm-lock.yaml ./
RUN pnpm fetch --no-optional --ignore-scripts --unsafe-perm
RUN pnpm install -r --offline --no-optional --ignore-scripts --unsafe-perm

COPY . .

# build SvelteKit app
RUN pnpm build

############################################################
### stage_runtime
### this stage installs the runtime dependencies.
############################################################
FROM --platform=${BUILDPLATFORM} node:20-alpine as runtime

# install pnpm
RUN corepack enable; corepack prepare pnpm@8.6.0 --activate

WORKDIR /app

# clean install dependencies, no devDependencies, no prepare script
COPY ./patches/ ./patches/
COPY .npmrc package.json pnpm-lock.yaml ./
RUN pnpm fetch --prod --unsafe-perm --ignore-scripts --unsafe-perm
RUN pnpm install -r --offline --prod
RUN pnpm prune --prod --no-optional

############################################################
### stage_final
### this stage only needs the compiled application and the runtime dependencies.
############################################################
#FROM gcr.io/distroless/nodejs:19 as final
# FROM gcr.io/distroless/nodejs:18-debug as final
FROM cgr.dev/chainguard/node:20 as final
ENV NODE_ENV production

WORKDIR /app
COPY --from=tini --chown=node:node /tini /tini
# ENTRYPOINT ["/tini", "-s", "--", "/nodejs/bin/node"]
ENTRYPOINT ["/tini", "-s", "--", "/usr/bin/node"]
COPY --from=build --chown=node:node /app/build ./build
# COPY --from=build --chown=node:node /app/config ./config
COPY --from=runtime --chown=node:node /app/package.json ./package.json
COPY --from=runtime --chown=node:node /app/node_modules ./node_modules

EXPOSE 3000
#USER nonroot:nonroot

# Metadata params
ARG TARGET=svelte-starter-kit
ARG DOCKER_REGISTRY=ghcr.io
ARG DOCKER_CONTEXT_PATH=xmlking
ARG BUILD_TIME
ARG BUILD_VERSION
ARG VCS_URL=svelte-starter-kit
ARG VCS_REF=1
ARG VENDOR=xmlking

# Metadata
LABEL org.opencontainers.image.created=$BUILD_TIME \
	org.opencontainers.image.name="${TARGET}" \
	org.opencontainers.image.title="${TARGET}" \
	org.opencontainers.image.description="Example of SvelteKit multi-stage docker build" \
	org.opencontainers.image.url=https://github.com/xmlking/$VCS_URL \
	org.opencontainers.image.source=https://github.com/xmlking/$VCS_URL \
	org.opencontainers.image.revision=$VCS_REF \
	org.opencontainers.image.version=$BUILD_VERSION \
	org.opencontainers.image.authors=sumanth \
	org.opencontainers.image.vendor=$VENDOR \
	org.opencontainers.image.licenses=MIT \
	org.opencontainers.image.documentation="docker run -it -e NODE_ENV=production -p 3000:3000  ${DOCKER_REGISTRY:+${DOCKER_REGISTRY}/}${DOCKER_CONTEXT_PATH}/${TARGET}:${BUILD_VERSION}"

CMD ["build"]
