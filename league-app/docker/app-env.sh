#!/bin/sh
set -eu

ENV_CONFIG_FILE="/usr/share/nginx/html/env-config.js"

escape_js_string() {
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

{
  echo "(function(window) {"
  echo "  window.app = window.app || {};"
  echo "  window.app.env = {"

  env | sort | while IFS='=' read -r name value; do
    case "$name" in
      VITE_*)
        escaped_value="$(escape_js_string "$value")"
        printf '    %s: "%s",\n' "$name" "$escaped_value"
        ;;
    esac
  done

  echo "  };"
  echo "})(window);"
} > "$ENV_CONFIG_FILE"

echo "Generated runtime env config at $ENV_CONFIG_FILE"
