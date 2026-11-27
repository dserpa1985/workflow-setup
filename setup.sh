#!/bin/bash
set -e

echo "Starting Marketplace Backend CI Setup..."
cd backend

echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

npm ci

for entry in server.js index.js app.js; do
  if [ -f "$entry" ]; then
    echo "Checking syntax for $entry..."
    node --check "$entry"
  fi
done

npm test --if-present

echo "✓ Marketplace backend setup complete!"
