# stage 1
FROM node:latest as node 

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build --prod

#stage 2

FROM nginx:latest 

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

#RUN rm -rf /usr/share/nginx/html/*

#COPY --from=node /app/dist/ /usr/share/nginx/html/
COPY --from=node /app/dist/ /var/www/html/