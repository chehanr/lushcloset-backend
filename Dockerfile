FROM node:alpine3.12

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --no-fund --verbose

COPY ./scripts/docker-entrypoint.sh ./

COPY . ./

RUN chmod +x ./scripts/*.sh

ENTRYPOINT ["sh", "./scripts/docker-entrypoint.sh"]
