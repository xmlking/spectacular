FROM node:lts-bullseye-slim AS builder
#https://turbo.build/repo/docs/handbook/deploying-with-docker
#https://github.com/vercel/turbo/tree/main/examples/with-docker

# Install pnpm
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"
SHELL ["/bin/bash", "-c"]
RUN npm install --global pnpm \
  && SHELL=bash pnpm setup \
  && source /root/.bashrc

WORKDIR /app
RUN pnpm install -g turbo
COPY . .
RUN turbo prune --scope=@fullpower-stack/nextjs --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:lts-bullseye-slim AS installer
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
RUN pnpm turbo run build --filter=@fullpower-stack/nextjs

# Run the app
FROM node:lts-bullseye-slim AS runner
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

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/nextjs/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/nextjs/.next/static ./apps/nextjs/.next/static

COPY --from=installer /app/apps/nextjs/public ./apps/nextjs/public
COPY --from=installer /app/apps/nextjs/next.config.js ./apps/nextjs/next.config.js
COPY --from=installer /app/apps/nextjs/package.json ./apps/nextjs/package.json

EXPOSE 3000
ENV PORT 3000


CMD node apps/nextjs/server.js