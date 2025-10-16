#!/bin/bash

# Health check script for Vite dev server
echo "Checking Vite dev server..."

# Check if port 3150 is listening
if netstat -tuln | grep -q ":3150 "; then
    echo "✅ Port 3150 is listening"
    
    # Check if Vite is responding
    if curl -s http://localhost:3150/ > /dev/null; then
        echo "✅ Vite dev server is responding"
        exit 0
    else
        echo "❌ Vite dev server not responding"
        exit 1
    fi
else
    echo "❌ Port 3150 is not listening"
    exit 1
fi
