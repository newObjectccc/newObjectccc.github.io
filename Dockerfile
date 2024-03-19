FROM caddy:2-builder AS builder

RUN xcaddy build \
    --with github.com/aksdb/caddy-cgi/v2

RUN sudo apk update
RUN sudo apk add --no-cache git lua5.3 nodejs20

ENV PATH /usr/local/bin:$PATH

COPY --from=builder /usr/bin/caddy /usr/bin/caddy