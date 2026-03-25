/// env-config.js — runtime-переопределение переменных на стендах (Docker генерирует файл при старте контейнера).
(function (window) {
  window.app = window.app || {};
  window.app.env = {};
})(window);
