#!/bin/bash

echo "=== DEBUG SCRIPT ==="
echo "Current directory: $(pwd)"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo ""

echo "=== CHECKING PROCESSES ==="
ps aux | grep -E "(node|vite)" | grep -v grep
echo ""

echo "=== CHECKING PORTS ==="
netstat -tuln | grep -E ":(3000|3150|4600)"
echo ""

echo "=== CHECKING PACKAGE.JSON ==="
if [ -f package.json ]; then
    echo "package.json exists"
    echo "Start script: $(grep -A 5 '"scripts"' package.json | grep '"start"')"
else
    echo "package.json NOT FOUND"
fi
echo ""

echo "=== TRYING TO START VITE ==="
cd /app 2>/dev/null || echo "Cannot cd to /app"
npm start &
sleep 5
echo ""

echo "=== CHECKING IF VITE IS RUNNING ==="
if curl -s http://localhost:3150/ > /dev/null; then
    echo "✅ Vite is responding on port 3150"
else
    echo "❌ Vite is NOT responding on port 3150"
fi
