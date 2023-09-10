###################################################################
# Stage 0: base image											  #
###################################################################
FROM node:20-slim AS base

#https://turbo.build/repo/docs/handbook/deploying-with-docker
#https://github.com/vercel/turbo/tree/main/examples/with-docker

###################################################################
# Stage 1: Prune monorepo                                         #
###################################################################
FROM base AS builder
# Install pnpm
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"
SHELL ["/bin/bash", "-c"]
RUN npm install --global pnpm \
  && SHELL=bash pnpm setup \
  && source /root/.bashrc

WORKDIR /app
RUN pnpm add -g turbo
COPY . .
RUN turbo prune --scope=web --docker

###################################################################
# Stage 2: Install dependencies                                   #
###################################################################
# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
WORKDIR /app

# Install pnpm
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"
SHELL ["/bin/bash", "-c"]
RUN npm install --global pnpm \
  && SHELL=bash pnpm setup \
  && source /root/.bashrc

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# https://playwright.dev/docs/browsers
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD 1
ENV STANDALONE_BUILD true

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN pnpm install

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN pnpm turbo run build --filter=web...

###################################################################
# Stage 4: Run the app (prod)                                     #
###################################################################
# FROM gcr.io/distroless/nodejs:20 as final
# FROM gcr.io/distroless/nodejs:20-debug as final
# FROM cgr.dev/chainguard/node:20 AS runner
FROM base AS runner
ENV NODE_ENV production
ENV STANDALONE_BUILD true

# Install pnpm
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"
SHELL ["/bin/bash", "-c"]
RUN npm install --global pnpm \
  && SHELL=bash pnpm setup \
  && source /root/.bashrc


WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 svelte
RUN adduser --system --uid 1001 svelte
USER svelte

# COPY --from=installer /app/apps/playbook/svelte.config.js .
COPY --from=installer /app/apps/playbook/package.json .
# COPY --from=installer /app/apps/nextjs/next.config.js ./apps/nextjs/next.config.js
# COPY --from=installer /app/apps/nextjs/package.json ./apps/nextjs/package.json

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=installer --chown=node:node /app/apps/playbook/.next/standalone ./
# COPY --from=installer --chown=node:node /app/apps/playbook/.next/static ./apps/playbook/.next/static
# COPY --from=installer --chown=node:node /app/apps/playbook/public ./apps/playbook/public

COPY --from=installer --chown=svelte:svelte /app/apps/playbook/build ./build
# COPY --from=build --chown=node:node /app/config ./config
# COPY --from=runtime --chown=node:node /app/node_modules ./node_modules

EXPOSE 3000
ENV PORT 3000

CMD node build
