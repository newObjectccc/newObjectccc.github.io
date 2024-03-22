FROM caddy:latest

RUN xcaddy build \
    --with github.com/ueffel/caddy-brotli

COPY /usr/bin/caddy /usr/bin/caddy