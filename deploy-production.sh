#!/bin/bash
set -euo pipefail

# =============================================================================
# Vesper's site (newObjectccc.github.io) - 生产环境部署脚本（temp-server）
# 与 next-monorepo/deploy-production.sh 同一套约定
# =============================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

REMOTE_HOST="${REMOTE_HOST:-temp-server}"
REMOTE_DIR="${REMOTE_DIR:-/opt/vesper}"
ENV_FILE="${ENV_FILE:-.env.production}"
PUBLIC_URL="${PUBLIC_URL:-https://vesper.qyqmedu.com}"

prompt_bool() {
  local var_name="$1"
  local message="$2"
  local default_value="$3"
  local current_value="${!var_name:-}"

  if [ -n "$current_value" ]; then
    case "$current_value" in
      1|true|TRUE|yes|YES|y|Y) printf -v "$var_name" true ;;
      0|false|FALSE|no|NO|n|N) printf -v "$var_name" false ;;
      *) echo -e "${RED}错误: $var_name 只能是 true/false${NC}"; exit 1 ;;
    esac
    return
  fi

  if [ "${NONINTERACTIVE:-0}" = "1" ]; then
    printf -v "$var_name" "$default_value"
    return
  fi

  local suffix input
  if [ "$default_value" = true ]; then suffix="Y/n"; else suffix="y/N"; fi
  read -r -p "$message ($suffix): " input
  if [[ "$input" =~ ^[Yy]$ ]]; then
    printf -v "$var_name" true
  elif [[ "$input" =~ ^[Nn]$ ]]; then
    printf -v "$var_name" false
  else
    printf -v "$var_name" "$default_value"
  fi
}

require_command() {
  local cmd="$1"
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo -e "${RED}错误: 本地缺少命令 '$cmd'${NC}"; exit 1
  fi
}

sync_code() {
  echo -e "\n${YELLOW}同步代码到 $REMOTE_HOST:$REMOTE_DIR ...${NC}"
  echo -e "${CYAN}注意: docs/secret/（秘密空间日记）只存在于本机，随构建进入服务器镜像，不进任何 git 仓库${NC}"
  ssh "$REMOTE_HOST" "mkdir -p $REMOTE_DIR"
  rsync -az --delete \
    --exclude ".git/" \
    --exclude "node_modules/" \
    --exclude "landing/node_modules/" \
    --exclude "docs/.vitepress/cache/" \
    --exclude "docs/.vitepress/dist/" \
    --exclude "landing/dist/" \
    --exclude "waline-data/" \
    --exclude ".playwright-mcp/" \
    --exclude "landing-full.png" \
    --exclude ".env" \
    --exclude ".env.*" \
    --exclude "docker-compose.override.yml" \
    ./ "$REMOTE_HOST:$REMOTE_DIR/"
}

sync_env_if_requested() {
  if [ "$RUN_SYNC_ENV" = true ]; then
    if [ ! -f "$ENV_FILE" ]; then
      echo -e "${RED}错误: 未找到 $ENV_FILE${NC}"
      exit 1
    fi
    echo "同步 $ENV_FILE 到服务器 .env ..."
    scp "$ENV_FILE" "$REMOTE_HOST:$REMOTE_DIR/.env"
  fi

  ssh "$REMOTE_HOST" "test -f $REMOTE_DIR/.env" || {
    echo -e "${RED}错误: 服务器缺少 $REMOTE_DIR/.env。可设置 RUN_SYNC_ENV=true 同步本地 $ENV_FILE。${NC}"
    exit 1
  }
}

build_images() {
  echo -e "\n${YELLOW}构建 Docker 镜像（在服务器上）...${NC}"
  ssh "$REMOTE_HOST" "cd $REMOTE_DIR && docker compose build web server"
}

restart_services() {
  echo -e "\n${YELLOW}启动服务...${NC}"
  ssh "$REMOTE_HOST" "cd $REMOTE_DIR && docker compose up -d"
}

check_health() {
  echo -e "\n${YELLOW}检查服务状态...${NC}"
  ssh "$REMOTE_HOST" "cd $REMOTE_DIR && docker compose ps"
  local code_home code_gate code_secret code_waline code_api
  code_home=$(ssh "$REMOTE_HOST" "curl -s -o /dev/null -w '%{http_code}' --resolve vesper.qyqmedu.com:443:127.0.0.1 $PUBLIC_URL/")
  code_gate=$(ssh "$REMOTE_HOST" "curl -s -o /dev/null -w '%{http_code}' --resolve vesper.qyqmedu.com:443:127.0.0.1 $PUBLIC_URL/gate/")
  code_secret=$(ssh "$REMOTE_HOST" "curl -s -o /dev/null -w '%{http_code}' --resolve vesper.qyqmedu.com:443:127.0.0.1 $PUBLIC_URL/secret/")
  code_waline=$(ssh "$REMOTE_HOST" "curl -s -o /dev/null -w '%{http_code}' --resolve vesper.qyqmedu.com:443:127.0.0.1 '$PUBLIC_URL/waline/api/comment?path=/secret/'")
  code_api=$(ssh "$REMOTE_HOST" "curl -s -o /dev/null -w '%{http_code}' --resolve vesper.qyqmedu.com:443:127.0.0.1 $PUBLIC_URL/api/gate/me")
  echo "  首页:              $code_home (期望 200)"
  echo "  /gate/ 登录页:     $code_gate (期望 200)"
  echo "  /secret/ 无 cookie: $code_secret (期望 302)"
  echo "  /waline/ 无 cookie: $code_waline (期望 401)"
  echo "  /api/gate/me:      $code_api (期望 200)"
  if [ "$code_home" != "200" ] || [ "$code_gate" != "200" ] || [ "$code_secret" != "302" ] || [ "$code_waline" != "401" ] || [ "$code_api" != "200" ]; then
    echo -e "${RED}错误: 健康检查未通过${NC}"
    exit 1
  fi
}

require_command rsync
require_command ssh

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  生产环境部署 - Vesper's site${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${CYAN}目标: $REMOTE_HOST:$REMOTE_DIR${NC}"

prompt_bool RUN_DEPLOY "是否同步代码、构建并部署服务？" true
prompt_bool RUN_SYNC_ENV "是否同步本地 $ENV_FILE 到服务器 .env？默认保留服务器现有 .env" false
prompt_bool SKIP_GIT_CHECK "是否跳过 Git 未提交检查？" false

echo ""
echo -e "${YELLOW}部署配置:${NC}"
echo "  - 目标服务器:   $REMOTE_HOST"
echo "  - 目标目录:     $REMOTE_DIR"
echo "  - 构建并部署:   $RUN_DEPLOY"
echo "  - 同步 env:     $RUN_SYNC_ENV"
echo "  - 跳过 Git 检查: $SKIP_GIT_CHECK"
echo ""

if [ "$SKIP_GIT_CHECK" != true ] && [ -d .git ]; then
  if ! git diff --quiet || ! git diff --cached --quiet; then
    echo -e "${RED}错误: 存在未提交的改动，请先提交或设置 SKIP_GIT_CHECK=true${NC}"
    exit 1
  fi
fi

if [ "$RUN_DEPLOY" != true ]; then
  echo -e "${YELLOW}未选择部署，退出。${NC}"
  exit 0
fi

sync_code
sync_env_if_requested
build_images
restart_services
check_health

echo -e "\n${GREEN}✅ 部署完成: $PUBLIC_URL${NC}"
echo -e "${CYAN}秘密空间: $PUBLIC_URL/secret/ （需要密码）${NC}"
