ARG SCOPE=playground
###################################################################
# Stage 0: base image											                        #
###################################################################
FROM node:20-slim AS base
RUN apk add --no-cache git

ARG SCOPE
ENV SCOPE=${SCOPE}

#https://turbo.build/repo/docs/handbook/deploying-with-docker
#https://github.com/vercel/turbo/tree/main/examples/with-docker

# Install pnpm
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
RUN turbo prune --scope=${SCOPE} --docker

###################################################################
# Stage 2: Install dependencies                                   #
# Add lockfile and package.json's of isolated subworkspace        #
###################################################################
FROM base AS builder

WORKDIR /app
# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# https://playwright.dev/docs/browsers
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD 1

RUN pnpm install

# Build the project
COPY --from=pruner /app/out/full/ .
COPY turbo.json turbo.json

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

# TODO: set any extra ENV needed for build
# ENV ENCRYPTION_SECRET=encryption_secret_placeholder123 DATABASE_URL=postgresql://postgres:typebot@typebot-db:5432/typebot NEXTAUTH_URL=http://localhost:3000 NEXT_PUBLIC_VIEWER_URL=http://localhost:3001
RUN pnpm turbo run build --filter=${SCOPE}...

###################################################################
# Stage 4: Run the app (prod)                                     #
###################################################################
# FROM gcr.io/distroless/nodejs:20 as final
# FROM gcr.io/distroless/nodejs:20-debug as final
FROM cgr.dev/chainguard/node:20 AS runner
# FROM base AS runner

WORKDIR /app
ENTRYPOINT ["/usr/bin/node"]
ENV NODE_ENV production
ARG SCOPE

# copy runtime needed config files???
COPY --from=builder /app/apps/${SCOPE}/package.json .
# COPY --from=builder --chown=node:node /app/config ./config

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=node:node /app/apps/playground/build ./build


EXPOSE 3000
ENV PORT 3000

CMD ["build"]
