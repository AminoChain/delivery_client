FROM alpine:3.14
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
EXPOSE 8080
RUN apk add --update nodejs npm
RUN npm install
