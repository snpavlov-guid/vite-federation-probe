# League App

Frontend приложение на `React + TypeScript + Vite` для отображения данных футбольных турниров:

- список сезонов и этапов турнира РПЛ;
- таблица результатов по группам;
- матчи и команды выбранного этапа;
- авторизация через Keycloak.

## Требования

- Node.js `22+`
- npm `10+`
- Docker и Docker Compose (для контейнерного запуска)

## Локальный запуск

Из папки `league-app`:

```bash
npm install
npm run dev
```

Сборка production:

```bash
npm run build
```

## Переменные окружения

Приложение поддерживает два источника переменных:

- `import.meta.env` (стандартные Vite переменные);
- `window.app.env` (runtime-конфиг, загружаемый из `env-config.js`).

Приоритет значений:

- сначала берется `window.app.env`;
- если значения нет, используется `import.meta.env`.

Ключевые переменные:

- `VITE_APP_AUTH_URL`
- `VITE_APP_AUTH_REALM`
- `VITE_APP_AUTH_CLIENTID`
- `VITE_APP_FOOTBALL_APIURL`

## Docker сборка

Используется multistage Dockerfile:

- `build` стадия: `node:22-alpine`, установка зависимостей и `npm run build`;
- `production` стадия: `nginx:alpine`, раздача статических файлов из `dist`.

Собрать образ вручную:

```bash
docker build -f docker/Dockerfile -t league-app:local .
```

Запустить контейнер вручную:

```bash
docker run --rm -p 31021:80 \
  -e VITE_APP_AUTH_URL="http://keycloak-dev:8082/" \
  -e VITE_APP_AUTH_REALM="probe-app" \
  -e VITE_APP_AUTH_CLIENTID="probe-app-client" \
  -e VITE_APP_FOOTBALL_APIURL="http://localhost:19081/api/q/v1/" \
  league-app:local
```

## Docker Compose запуск

Для запуска используется файл:

- `docker_compose/leaguage-docker-compose.yml`

Команды:

```bash
cd docker_compose
docker compose -f leaguage-docker-compose.yml up --build -d

-- или из папки проекта league-app
docker compose -f docker_compose\leaguage-docker-compose.yml up --build -d
```

Открыть приложение:

- [http://localhost:31021](http://localhost:31021)

Остановить:

```bash
docker compose -f leaguage-docker-compose.yml down
```

## Runtime env в контейнере

В образ копируется скрипт `docker/app-env.sh` в `/docker-entrypoint.d`.

Перед стартом nginx скрипт:

- считывает все переменные контейнера, начинающиеся с `VITE_`;
- генерирует файл `/usr/share/nginx/html/env-config.js`.

Таким образом значения можно менять через `environment` в Docker Compose без пересборки frontend-кода.

## Troubleshooting

- **Keycloak недоступен из контейнера**
  - убедитесь, что в `docker_compose/leaguage-docker-compose.yml` есть:
    - `extra_hosts: ["keycloak-dev:host-gateway"]`
  - проверьте, что `VITE_APP_AUTH_URL` указывает на `http://keycloak-dev:8082/`.

- **Переменные не подхватились в runtime**
  - проверьте наличие `VITE_*` в секции `environment` сервиса;
  - пересоздайте контейнер:
    - `docker compose -f leaguage-docker-compose.yml up --build -d`
  - проверьте внутри контейнера, что сгенерирован файл:
    - `/usr/share/nginx/html/env-config.js`

- **Проверка, что runtime env применился**
  - откройте DevTools в браузере;
  - в консоли проверьте:
    - `window.app?.env`
  - приложение логирует merged env при старте (`import.meta.env` + `window.app.env`).
