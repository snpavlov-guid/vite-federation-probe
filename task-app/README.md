# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Docker

Проект можно собрать и запустить в Docker через `docker compose`. Контекст сборки — **корень монорепозитория** (`context: ../..`), Dockerfile: `task-app/docker/Dockerfile`.

### Build image

```bash
docker compose -f docker_compose/task-app-docker-compose.yml build
```

### Run container

```bash
docker compose -f docker_compose/task-app-docker-compose.yml up --build
```

Приложение будет доступно по адресу [http://localhost:31022](http://localhost:31022) (порт задаётся в compose).

### Stop container

```bash
docker compose -f docker_compose/task-app-docker-compose.yml down
```

### nginx (`docker/nginx.conf`)

- Раздача статики из `/usr/share/nginx/html`, для SPA используется `try_files` с fallback на `index.html`.
- Настроены заголовки **CORS** для JS/CSS: remote может запрашиваться с другого origin (например, с host при прямых URL). Если remote открывается только через **same-origin** прокси host-app (`/mf/task-react/`), CORS не нужен, но конфиг поддерживает оба варианта.

### Переменные окружения в контейнере

Отдельных `VITE_*` для task-app в образе не задано: при необходимости добавьте `ARG`/`ENV` перед `npm run build` в Dockerfile по аналогии с `league-app`.

### Notes

- Multi-stage сборка: стадия `build` (Node) и `production` (`nginx:alpine`).

Расширение ESLint (type-aware и React) — см. документацию [Vite](https://vite.dev/) и конфиги в репозитории.
