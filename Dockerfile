FROM caddy:2-builder AS builder

RUN xcaddy build \
    --with github.com/ueffel/caddy-brotli

FROM caddy:2.7.6-alpine

COPY --from=builder /usr/bin/caddy /usr/bin/caddy