FROM caddy:latest

RUN xcaddy build \
    --with github.com/ueffel/caddy-brotli \
    --output /usr/bin/caddy

COPY /usr/bin/caddy /usr/bin/caddy