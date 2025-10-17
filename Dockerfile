FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json ./

# Install packages + server for static pages
RUN \
    npm install \
    npm i -g serve

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "serve", "-s", "dist" ]
