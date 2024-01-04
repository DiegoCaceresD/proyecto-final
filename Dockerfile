FROM node

WORKDIR /APP

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 8080

cmd [ "npm", "start"]