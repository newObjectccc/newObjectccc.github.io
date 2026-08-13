# vesper-server — 秘密空间后端（门禁/日记/语音成文/朗读/图片）
FROM node:20-bookworm-slim AS base

RUN sed -i 's#deb.debian.org#mirrors.aliyun.com#g; s#security.debian.org#mirrors.aliyun.com#g' /etc/apt/sources.list.d/debian.sources \
    && apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates \
    && corepack enable \
    && corepack prepare pnpm@10.17.1 --activate \
    && npm config set registry https://registry.npmmirror.com \
    && pnpm config set registry https://registry.npmmirror.com

WORKDIR /app

# 依赖阶段（better-sqlite3 二进制优先走 npmmirror，失败则源码编译）
FROM base AS deps

RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-lock.yaml ./
ENV PNPM_STORE_DIR=/root/.pnpm-store \
    npm_config_better_sqlite3_binary_host_mirror=https://registry.npmmirror.com/-/binary/better-sqlite3
RUN --mount=type=cache,id=pnpm-store-vesper-server,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile

# 运行阶段
FROM node:20-bookworm-slim

# libreoffice-impress + poppler-utils：PPT/PDF 转每页图片；fonts-noto-cjk：中文渲染不豆腐块
RUN sed -i 's#deb.debian.org#mirrors.aliyun.com#g; s#security.debian.org#mirrors.aliyun.com#g' /etc/apt/sources.list.d/debian.sources \
    && apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates ffmpeg libreoffice-impress poppler-utils fonts-noto-cjk \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY index.js ./

EXPOSE 7000
CMD ["node", "index.js"]
