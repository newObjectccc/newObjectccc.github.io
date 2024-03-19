FROM caddy:2-builder AS builder

RUN xcaddy build \
    --with github.com/aksdb/caddy-cgi/v2

FROM caddy:2.7.6-alpine

RUN apk update
RUN apk install -y git
RUN apk install -y lua5.3
RUN apk install -y nodejs

ENV PATH /usr/local/bin:$PATH

COPY --from=builder /usr/bin/caddy /usr/bin/caddy