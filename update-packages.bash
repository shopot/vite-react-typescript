#!/bin/bash

# Список пакетов, которые нужно исключить из обновления
EXCLUDE_PACKAGES=("react" "react-dom" "typescript")

DEPS=$(tr -d '\n' <package.json | grep -o '"dependencies": {[^}]*}' | grep -E -o '"[^"]+": *"[^"]+"' | sed 's/": *"[^"]*//;s/"//g')
DEV_DEPS=$(tr -d '\n' <package.json | grep -o '"devDependencies": {[^}]*}' | grep -E -o '"[^"]+": *"[^"]+"' | sed 's/": *"[^"]*//;s/"//g')

is_excluded() {
  local package=$1
  for excluded in "${EXCLUDE_PACKAGES[@]}"; do
    if [[ "$excluded" == "$package" ]]; then
      return 0 # Это пакет в исключениях
    fi
  done
  return 1 # Пакет не в исключениях
}

get_packages() {
  old_ifs="$IFS"

  local pkg=$(echo "$1" | tr '\n' ' ')

  parts=($pkg)

  IFS=' '

  IFS="$old_ifs"

  result_packages=""

  for part in "${parts[@]}"; do
    if ! is_excluded "$part"; then
      result_packages+=" $part"
    fi
  done

  output_string=$(echo "$result_packages" | sed 's/^\s//' | tr '\n' ' ' | sed 's/[[:space:]]\+$//' | sed 's/\([^ ]*\)/\1@latest/g')

  echo "$output_string"
}

update_dependencies() {
  local _deps=$(get_packages "$DEPS")

  echo "npm install -P $_deps" | sh
}

update_devDependencies() {
  local _deps=$(get_packages "$DEV_DEPS")

  echo "npm install -D $_deps" | sh
}

update_dependencies
update_devDependencies

echo "Done!"
