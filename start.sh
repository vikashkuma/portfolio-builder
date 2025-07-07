#!/bin/bash

# Portfolio Builder Startup Script
# This script handles all the complexity of starting the project

set -e

echo "🚀 Starting Portfolio Builder..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Port $port is already in use. Killing existing process...${NC}"
        lsof -ti :$port | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
}

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down servers...${NC}"
    if [ ! -z "$MCP_PID" ]; then
        kill $MCP_PID 2>/dev/null || true
    fi
    if [ ! -z "$NEXT_PID" ]; then
        kill $NEXT_PID 2>/dev/null || true
    fi
    echo -e "${GREEN}✅ Cleanup complete!${NC}"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Check and free ports
echo -e "${BLUE}🔍 Checking ports...${NC}"
check_port 3000
check_port 3001
check_port 3002

# Ensure we're in the right directory
cd "$(dirname "$0")"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing main dependencies...${NC}"
    npm install
fi

if [ ! -d "mcp-server/node_modules" ]; then
    echo -e "${YELLOW}📦 Installing MCP server dependencies...${NC}"
    cd mcp-server
    npm install
    cd ..
fi

# Fix MCP server port configuration
echo -e "${BLUE}⚙️  Configuring MCP server...${NC}"
echo "PORT=3001" > mcp-server/.env

# Create main app environment file
echo -e "${BLUE}⚙️  Configuring main application...${NC}"
echo "NEXT_PUBLIC_MCP_SERVER_URL=http://localhost:3001" > .env.local

# Start MCP server
echo -e "${BLUE}🤖 Starting AI server...${NC}"
cd mcp-server
npm run build > /dev/null 2>&1 || true
npm run start:http &
MCP_PID=$!
cd ..

# Wait for MCP server to start
echo -e "${YELLOW}⏳ Waiting for AI server to start...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:3001/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ AI server is running on http://localhost:3001${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ AI server failed to start${NC}"
        cleanup
    fi
    sleep 1
done

# Start Next.js app
echo -e "${BLUE}🌐 Starting portfolio builder...${NC}"
npm run dev &
NEXT_PID=$!

# Wait for Next.js to start
echo -e "${YELLOW}⏳ Waiting for portfolio builder to start...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Portfolio builder is running on http://localhost:3000${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ Portfolio builder failed to start${NC}"
        cleanup
    fi
    sleep 1
done

echo -e "\n${GREEN}🎉 Portfolio Builder is ready!${NC}"
echo -e "${BLUE}📱 Open your browser and go to: ${GREEN}http://localhost:3000${NC}"
echo -e "${BLUE}🤖 AI server is running on: ${GREEN}http://localhost:3001${NC}"
echo -e "\n${YELLOW}💡 Press Ctrl+C to stop all servers${NC}"

# Keep script running
wait 