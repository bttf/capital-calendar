FROM node:10-alpine as builder

COPY package*.json ./

COPY . .

# This should be optimized to prune dependencies for production usage. Currently
# we install all dependencies including those needed for development.
RUN apk add --no-cache make gcc g++ python postgresql-dev && \
  yarn install && \
  yarn build

FROM node:10-alpine

WORKDIR /user/src/app

# We need this to run pg-native it seems
RUN apk add --no-cache postgresql-dev

COPY --from=builder node_modules node_modules
COPY --from=builder dist dist

# This can be optimized since we only need dist/ and node_modules/ to run in
# prod. This is in place so that it works in development.
COPY . .

CMD ["yarn", "start"]
