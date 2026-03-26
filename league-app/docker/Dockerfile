FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Baked into import.meta.env — required when league runs as a federated remote (host page never loads league's /env-config.js).
ARG VITE_APP_AUTH_URL
ARG VITE_APP_AUTH_REALM
ARG VITE_APP_AUTH_CLIENTID
ARG VITE_APP_FOOTBALL_APIURL

ENV VITE_APP_AUTH_URL=$VITE_APP_AUTH_URL
ENV VITE_APP_AUTH_REALM=$VITE_APP_AUTH_REALM
ENV VITE_APP_AUTH_CLIENTID=$VITE_APP_AUTH_CLIENTID
ENV VITE_APP_FOOTBALL_APIURL=$VITE_APP_FOOTBALL_APIURL

COPY . .
RUN npm run build

FROM nginx:alpine AS production

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/app-env.sh /docker-entrypoint.d/40-app-env.sh
RUN chmod +x /docker-entrypoint.d/40-app-env.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
