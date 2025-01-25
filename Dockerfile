FROM node:22.11.0-alpine as build

WORKDIR /app

COPY ./package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "build"]