#!/bin/bash

# Portfolio Builder Stop Script
# This script cleanly stops all servers and frees ports

echo "🛑 Stopping Portfolio Builder..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Kill processes on our ports
echo -e "${YELLOW}🔍 Stopping servers on ports 3000, 3001, 3002...${NC}"

# Kill processes on port 3000 (Next.js)
if lsof -ti :3000 > /dev/null 2>&1; then
    echo "Stopping Next.js server..."
    lsof -ti :3000 | xargs kill -9 2>/dev/null || true
fi

# Kill processes on port 3001 (MCP server)
if lsof -ti :3001 > /dev/null 2>&1; then
    echo "Stopping AI server..."
    lsof -ti :3001 | xargs kill -9 2>/dev/null || true
fi

# Kill processes on port 3002 (fallback)
if lsof -ti :3002 > /dev/null 2>&1; then
    echo "Stopping server on port 3002..."
    lsof -ti :3002 | xargs kill -9 2>/dev/null || true
fi

# Kill any remaining node processes related to our project
echo "Cleaning up any remaining processes..."
pkill -f "portfolio-builder" 2>/dev/null || true
pkill -f "mcp-server" 2>/dev/null || true

echo -e "${GREEN}✅ All servers stopped and ports freed!${NC}" 