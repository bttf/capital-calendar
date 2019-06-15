FROM node:10-alpine

WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN apk add --no-cache make gcc g++ python postgresql-dev && \
  npm install && \
  apk del make gcc g++ python

COPY . .
CMD ["yarn", "dev"]
