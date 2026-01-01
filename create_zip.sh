#!/usr/bin/env bash
set -e
ZIPNAME="tfz-web.zip"
echo "Creating ${ZIPNAME} (excluding node_modules and .next)..."
zip -r "${ZIPNAME}" . -x "node_modules/*" -x ".next/*" -x "*.git/*" -x "${ZIPNAME}"
echo "Created ${ZIPNAME}"
