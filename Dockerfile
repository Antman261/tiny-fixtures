FROM node:14-alpine AS build

COPY ./ /app
WORKDIR /app

RUN npm i --ci
RUN npm run build

FROM build AS test

WORKDIR /app

CMD npm run test
