#!/bin/bash
set -e
cd apps/aristo && npm install && npm run build && cd ../asli && npm install && npm run build && cd ../..
mkdir -p public_out/aristo public_out/asli
cp -r apps/aristo/dist/. public_out/aristo/
cp -r apps/asli/dist/. public_out/asli/
cp apps/landing/index.html public_out/index.html
