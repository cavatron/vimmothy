FROM node:12-stretch-slim

RUN set -eux; \
  mkdir -p /usr/share/man/man1; \
  apt update; \
  apt install -y --no-install-recommends ca-certificates openjdk-8-jre-headless chromium wget; \
	rm -rf /var/lib/apt/lists/*; \
	apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false;

WORKDIR /usr/src/app
COPY . .
RUN yarn --prod
CMD [ "yarn", "start" ]
