FROM caddy:2-builder AS builder

RUN xcaddy build \
    --with github.com/aksdb/caddy-cgi/v2

FROM caddy:2

RUN apt-get update
RUN apt-get install -y git
RUN apt-get install -y lua5.3
RUN apt-get install -y nodejs

ENV PATH /usr/local/bin:$PATH

COPY --from=builder /usr/bin/caddy /usr/bin/caddy