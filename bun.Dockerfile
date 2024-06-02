ARG SCOPE=playground
###################################################################
# Stage 0: base image											                        #
###################################################################
FROM oven/bun:1.1.12 AS base
ENV GIT_SSL_NO_VERIFY 1
RUN apt-get update && apt-get install -y --no-install-recommends git tini

ARG SCOPE
ENV SCOPE=${SCOPE}

# Install turbo
# RUN bun --bun add -g turbo@latest
# RUN turbo --version
RUN bun --version

###################################################################
# Stage 1: Install dependencies                                   #
# Add lockfile and package.json's of isolated subworkspace         #
###################################################################
FROM base AS builder

WORKDIR /app
# Copy all the application files to the container
COPY . .
RUN ls -la  /app/apps/web

# https://playwright.dev/docs/browsers
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD 1

# First install the dependencies (as they change less often)
# RUN bun i --backend copyfile
RUN bun i

# Run your build process
# Uncomment and use build args to enable remote caching
ARG TURBO_TEAM
ENV TURBO_TEAM=$TURBO_TEAM

ARG TURBO_TOKEN
ENV TURBO_TOKEN=$TURBO_TOKEN

# TODO: set any extra ENV needed for build
ENV BUN_ENV=true
RUN bun run build --filter=${SCOPE}...
RUN ls -la  /app/apps/web

###################################################################
# Stage 2: Run the app (prod)                                     #
###################################################################
FROM base AS runner
USER bun:bun

WORKDIR /app
ENV NODE_ENV production
ARG SCOPE

# copy tini
COPY --from=builder --chown=bun:bun /usr/bin/tini /usr/bin/tini
ENTRYPOINT ["/usr/bin/tini", "-s", "--", "bun"]

# copy runtime needed config files???
COPY --from=builder --chown=bun:bun /app/apps/${SCOPE}/package.json .
# COPY --from=builder --chown=bun:bun /app/config ./config

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=bun:bun /app/apps/${SCOPE}/build ./build


EXPOSE 3000
ENV PORT 3000

# Metadata params
ARG DOCKER_REGISTRY=ghcr.io
ARG VCS_CONTEXT_PATH=xmlking/spectacular
ARG BUILD_TIME
ARG BUILD_VERSION
ARG VCS_REF=1
ARG VENDOR=xmlking

# Metadata
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

#Start the application
CMD ["./build/index.js" ]
