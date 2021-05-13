FROM node:15-alpine3.10

WORKDIR /usr/app/dca-coinbase

COPY package.json .
COPY src .
COPY entrypoint.sh .

RUN npm install

COPY cron.conf /etc/crontabs/root

ENTRYPOINT ["sh", "entrypoint.sh"]
