ARG SCOPE=console
###################################################################
# Stage 0: base image											                        #
###################################################################
FROM node:23-slim AS base
ENV GIT_SSL_NO_VERIFY=1
RUN apt-get update && apt-get install -y --no-install-recommends git tini

ARG SCOPE
ENV SCOPE=${SCOPE}

#https://turbo.build/repo/docs/handbook/deploying-with-docker
#https://github.com/vercel/turbo/tree/main/examples/with-docker

# Install pnpm
# RUN corepack enable pnpm
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"
SHELL ["/bin/bash", "-c"]
RUN npm install --global pnpm \
  && SHELL=bash pnpm setup \
  && source /root/.bashrc

###################################################################
# Stage 1: Prune monorepo                                         #
###################################################################
FROM base AS pruner

WORKDIR /app
RUN pnpm add -g turbo
COPY . .
RUN mv .git dotgit
RUN turbo prune --scope=${SCOPE} --docker

###################################################################
# Stage 2: Install dependencies                                   #
# Add lockfile and package.json's of isolated subworkspace        #
###################################################################
FROM base AS builder

WORKDIR /app
## First install the dependencies (as they change less often)
COPY .gitignore .gitignore

## prepare: `scripts/init.sh` will copy `.env`, `.secrets` needed during build
# TODO: remove scripts and .env* copy
COPY scripts scripts
COPY .env.example .env.example
COPY .secrets.example .secrets.example
COPY .env.production.example .env.production.example
COPY .secrets.production.example .secrets.production.example

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

## https://playwright.dev/docs/browsers
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV COREPACK_ENABLE_STRICT=0

## FIXME: https://github.com/vercel/turbo/pull/7512
# RUN pnpm install --frozen-lockfile
RUN pnpm install --no-frozen-lockfile
# RUN pnpm install --no-frozen-lockfile --ignore-scripts

## Build the project
COPY --from=pruner /app/out/full/ .
COPY --from=pruner /app/dotgit .git
COPY turbo.json turbo.json

## Uncomment and use build args to enable remote caching
ARG TURBO_TEAM
ENV TURBO_TEAM=$TURBO_TEAM

ARG TURBO_TOKEN
ENV TURBO_TOKEN=$TURBO_TOKEN

ARG TURBO_REMOTE_ONLY=true
ENV TURBO_REMOTE_ONLY=$TURBO_REMOTE_ONLY

ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN pnpm turbo run build --filter=${SCOPE}...

###################################################################
# Stage 4: Run the app (prod)                                     #
###################################################################
# FROM cgr.dev/chainguard/node:latest-dev AS runner
FROM cgr.dev/chainguard/node:latest AS runner
# FROM base AS runner

WORKDIR /app
ENV NODE_ENV=production
ARG SCOPE

## copy tini
COPY --from=builder --chown=node:node /usr/bin/tini /usr/bin/tini
ENTRYPOINT ["/usr/bin/tini", "-s", "--", "/usr/bin/node"]

## copy runtime needed config files for `dashboard` app ONLY
# COPY --from=builder --chown=node:node /app/apps/${SCOPE}/config ./config
COPY --from=builder --chown=node:node /app/apps/${SCOPE}/package.json .

## Automatically leverage output traces to reduce image size
## https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=node:node /app/apps/${SCOPE}/build ./build

ENV HOST=0.0.0.0
EXPOSE 3000
ENV PORT=3000

## Metadata params
ARG DOCKER_REGISTRY=ghcr.io
ARG VCS_CONTEXT_PATH=xmlking/spectacular
ARG BUILD_TIME
ARG BUILD_VERSION
ARG VCS_REF=1
ARG VENDOR=xmlking

## for faster docker shutdown
STOPSIGNAL SIGINT

## Metadata
LABEL org.opencontainers.image.created=$BUILD_TIME \
	org.opencontainers.image.name="${SCOPE}" \
	org.opencontainers.image.title="${SCOPE}" \
	org.opencontainers.image.description="Example of SvelteKit multi-stage docker build" \
	org.opencontainers.image.url=https://github.com/$VCS_CONTEXT_PATH \
	org.opencontainers.image.source=https://github.com/$VCS_CONTEXT_PATH \
	org.opencontainers.image.revision=$VCS_REF \
	org.opencontainers.image.version=$BUILD_VERSION \
	org.opencontainers.image.authors=sumanth \
	org.opencontainers.image.vendor=$VENDOR \
	org.opencontainers.image.licenses=MIT \
	org.opencontainers.image.documentation="docker run -it -e NODE_ENV=production -p 3000:3000  ${DOCKER_REGISTRY:+${DOCKER_REGISTRY}/}${VCS_CONTEXT_PATH}/${SCOPE}:${BUILD_VERSION}"

CMD ["build"]
