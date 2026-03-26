# Host App

Shell-приложение (React + Vite) для **Module Federation**: подключает remotes (league, React/Vue task apps).

## Локальная разработка

```bash
npm install
npm run dev
```

## Docker: nginx, переменные окружения, сборка

### Роль nginx в контейнере

- Раздаёт статику из `dist` после `npm run build`.
- **Прокси same-origin для remotes** (`docker/nginx.conf`): запросы вида  
  `http://<хост>:31030/mf/league/...`, `/mf/task-react/...`, `/mf/task-vue/...`  
  проксируются на `http://host.docker.internal:<порт>/...`, где порты на **хосте** совпадают с опубликованными портами контейнеров remotes (`31021`–`31023`).  
  Так браузер всегда обращается к **одному origin** (порт хоста), что устраняет CORS при загрузке ES-модулей federation.
- Для резолва `host.docker.internal` в compose задано `extra_hosts: ["host.docker.internal:host-gateway"]` (в т.ч. Linux).

### Переменные среды при сборке (`VITE_*`)

Они подставляются **на этапе `npm run build`** в `vite.config.ts` (URL remote entry). Задаются через:

- файл **`host-app/.env.production`** (рекомендуется для compose), и/или
- **`build.args`** в `docker_compose/host-app-docker-compose.yml` (подтягивают `${VITE_REMOTE_*}` из окружения).

| Переменная | Назначение |
|------------|------------|
| `VITE_REMOTE_LEAGUEAPP_URL` | Базовый URL для `assets/league-app-entry.js` (в Docker — тот же хост и порт, что у UI, путь `/mf/league/` со **слешем** в конце) |
| `VITE_REMOTE_TASKAPPREACT_URL` | Аналогично, `/mf/task-react/` |
| `VITE_REMOTE_TASKAPPVUE_URL` | `/mf/task-vue/` |

Пример для стандартных портов (`31030` — хост, remotes на тех же путях, что и в nginx):

См. актуальные значения в `.env.production`.

### Runtime: `env-config.js`

Скрипт `docker/app-env.sh` при старте контейнера записывает в `/usr/share/nginx/html/env-config.js` все переменные окружения контейнера с префиксом `VITE_*`, чтобы их мог прочитать `window.app.env` в приложении (см. `src/app/env.ts`).

### Сборка и запуск

Из каталога **`host-app`**:

```bash
docker compose --env-file .env.production -f docker_compose/host-app-docker-compose.yml up --build -d
```

UI: порт смотрите в `docker_compose/host-app-docker-compose.yml` (по умолчанию в репозитории `31030:80` → [http://localhost:31030](http://localhost:31030)).

### Зависимости

Remotes должны быть доступны на хосте на портах `31021`–`31023` (как в прокси nginx). Поднимайте их отдельными compose-файлами из соответствующих приложений.

---

## ESLint (шаблон Vite)

При необходимости расширьте конфигурацию ESLint для type-aware правил — см. документацию [Vite](https://vite.dev/) и используемые в проекте плагины.
