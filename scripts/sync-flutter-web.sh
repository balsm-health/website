#!/usr/bin/env bash
# Copy the Flutter web release into public/apps/balsm for the site deploy.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${FLUTTER_WEB_DIR:-$ROOT/../balsm_app/app/build/web}"
DEST="$ROOT/public/apps/balsm"

if [[ ! -f "$SRC/index.html" ]]; then
  echo "sync-flutter-web: missing $SRC/index.html" >&2
  echo "  build first: (cd ../balsm_app && dart run tool/build.dart web balsm prod)" >&2
  exit 1
fi
if ! grep -q '/apps/balsm/' "$SRC/index.html"; then
  echo "sync-flutter-web: $SRC/index.html is not built with --base-href=/apps/balsm/" >&2
  exit 1
fi

rm -rf "$DEST"
mkdir -p "$DEST"
rsync -a "$SRC"/ "$DEST"/
echo "sync-flutter-web: $SRC -> $DEST"
