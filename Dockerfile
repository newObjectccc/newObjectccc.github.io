FROM caddy:2-builder AS builder

RUN xcaddy build \
    --with github.com/aksdb/caddy-cgi/v2

FROM caddy:2.7.6-alpine

RUN apk update
RUN apk add --no-cache git
RUN apk add --no-cache lua5.3
RUN apk add --no-cache nodejs
RUN apk add --no-cache npm
RUN ln -s /usr/bin/lua5.3 /usr/bin/lua

ENV PATH /usr/local/bin:/usr/bin:$PATH

COPY --from=builder /usr/bin/caddy /usr/bin/caddy