FROM caddy:2.7.6-alpine

RUN xcaddy build \
    --with github.com/ueffel/caddy-brotli

COPY /usr/bin/caddy /usr/bin/caddy