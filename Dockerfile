FROM node

WORKDIR /APP

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

cmd [ "npm", "start"]