#!/bin/bash
# deploy.sh — 兼容旧习惯，实际走标准化部署脚本
exec "$(dirname "$0")/deploy-production.sh" "$@"
