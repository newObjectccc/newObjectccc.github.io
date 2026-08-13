# 与 next-monorepo 保持一致：Debian slim + 国内源 + corepack pnpm
FROM node:20-bookworm-slim AS base

RUN sed -i 's#deb.debian.org#mirrors.aliyun.com#g; s#security.debian.org#mirrors.aliyun.com#g' /etc/apt/sources.list.d/debian.sources \
    && apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates \
    && corepack enable \
    && corepack prepare pnpm@10.17.1 --activate \
    && npm config set registry https://registry.npmmirror.com \
    && pnpm config set registry https://registry.npmmirror.com

WORKDIR /app

# ============================================
# 主站依赖（VitePress）
# ============================================
FROM base AS deps

COPY package.json pnpm-lock.yaml ./
ENV PNPM_STORE_DIR=/root/.pnpm-store
RUN --mount=type=cache,id=pnpm-store-vesper,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile

# ============================================
# Landing 依赖（独立 pnpm 项目）
# ============================================
FROM base AS landing-deps

COPY landing/package.json landing/pnpm-lock.yaml ./landing/
ENV PNPM_STORE_DIR=/root/.pnpm-store-landing
RUN --mount=type=cache,id=pnpm-store-landing,target=/root/.pnpm-store-landing \
    pnpm --dir landing install --frozen-lockfile

# ============================================
# 构建：VitePress + Landing，合并产物
# 注意：docs/secret/（秘密空间日记）只存在于部署机本地，
# 经 rsync 传到服务器后在这里被打进镜像，镜像不推送任何仓库
# ============================================
FROM base AS builder

# 构建上下文无 .git（rsync 排除），lastUpdated 的 git 调用在容器内不可用
ENV DOCKER_BUILD=1

COPY package.json pnpm-lock.yaml ./
COPY --from=deps /app/node_modules ./node_modules
COPY docs ./docs
RUN pnpm run docs:build

COPY --from=landing-deps /app/landing/node_modules ./landing/node_modules
COPY landing ./landing
RUN pnpm --dir landing build \
    && cp -r landing/dist/. docs/.vitepress/dist/

# ============================================
# 运行：Caddy 静态伺服（TLS 由边缘 1Panel Caddy 终结）
# ============================================
FROM caddy:2-alpine

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /app/docs/.vitepress/dist /srv

EXPOSE 80
