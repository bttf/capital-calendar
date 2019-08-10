FROM node:10-alpine as builder

COPY package*.json ./

COPY . .

RUN apk add --no-cache make gcc g++ python && \
  yarn install && \
  yarn build

FROM node:10-alpine

WORKDIR /user/src/app

COPY --from=builder node_modules node_modules
COPY --from=builder dist dist

# Needed for development
COPY . .

CMD ["yarn", "start:prod"]
