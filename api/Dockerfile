FROM node:10.15.3

WORKDIR /app

ADD package.json /app/package.json
ADD yarn.lock /app/yarn.lock

RUN ["yarn", "install"]

CMD ["yarn", "dev"]
