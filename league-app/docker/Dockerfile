FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine AS production

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/app-env.sh /docker-entrypoint.d/40-app-env.sh
RUN chmod +x /docker-entrypoint.d/40-app-env.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
