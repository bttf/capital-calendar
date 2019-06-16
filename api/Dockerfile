FROM node:10-alpine as builder

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

COPY package*.json ./
RUN apk add --no-cache make gcc g++ python postgresql-dev && \
  yarn install && \
  yarn build && \
  apk del make gcc g++ python

FROM node:10-alpine

# The next few operations can be optimized since we are copying the entire
# project source everytime, despite the fact that we only need dist and
# node_modules to run in prod. This is in place so that it works in development.
WORKDIR /user/src/app
COPY --from=builder node_modules node_modules
COPY --from=builder dist dist

COPY . .

CMD ["yarn", "start"]
