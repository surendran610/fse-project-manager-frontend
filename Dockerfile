# stage 1
FROM node:latest as node 

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build --prod

#stage 2

FROM nginx:latest 

COPY --from=builder /app/dist/ /usr/share/nginx/html/

COPY ./nginx.conf /etc/nginx/conf.d/default.conf