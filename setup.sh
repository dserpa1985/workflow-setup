#!/bin/bash
set -e

echo "Starting Marketplace Backend CI Setup..."
cd backend

echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

npm ci

find . -maxdepth 3 -name "*.js" -not -path "./node_modules/*" -exec node --check {} +

npm test --if-present

echo "✓ Marketplace backend setup complete!"
