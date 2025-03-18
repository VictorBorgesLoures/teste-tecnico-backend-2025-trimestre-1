FROM node:22-alpine

WORKDIR /app

RUN mkdir -p upload
RUN mkdir -p test

COPY ./dist .
COPY ./package.json .
COPY ./tsconfig.json .
COPY ./test ./test

ENV NODE_ENV=production
ENV PORT=3000

RUN npm install

EXPOSE ${PORT}

CMD ["npm", "run", "prod"]