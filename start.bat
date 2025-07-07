@echo off
echo 🚀 Starting Portfolio Builder...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Kill any existing processes on our ports
echo 🔍 Checking ports...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3002') do taskkill /f /pid %%a >nul 2>&1

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing main dependencies...
    npm install
)

if not exist "mcp-server\node_modules" (
    echo 📦 Installing MCP server dependencies...
    cd mcp-server
    npm install
    cd ..
)

REM Configure environment
echo ⚙️ Configuring servers...
echo PORT=3001 > mcp-server\.env
echo NEXT_PUBLIC_MCP_SERVER_URL=http://localhost:3001 > .env.local

REM Start MCP server
echo 🤖 Starting AI server...
cd mcp-server
start "AI Server" cmd /c "npm run start:http"
cd ..

REM Wait a moment for server to start
timeout /t 5 /nobreak >nul

REM Start Next.js app
echo 🌐 Starting portfolio builder...
start "Portfolio Builder" cmd /c "npm run dev"

echo.
echo 🎉 Portfolio Builder is starting!
echo 📱 Open your browser and go to: http://localhost:3000
echo 🤖 AI server is running on: http://localhost:3001
echo.
echo 💡 Close the terminal windows to stop the servers
pause 