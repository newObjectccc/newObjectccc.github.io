FROM caddy:2.7.6-alpine AS builder

RUN xcaddy build \
    --with github.com/aksdb/caddy-cgi/v2

FROM caddy:2.7.6-alpine

COPY --from=builder /usr/bin/caddy /usr/bin/caddy