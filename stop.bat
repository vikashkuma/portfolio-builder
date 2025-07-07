@echo off
echo 🛑 Stopping Portfolio Builder...

REM Kill processes on our ports
echo 🔍 Stopping servers on ports 3000, 3001, 3002...

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    echo Stopping Next.js server...
    taskkill /f /pid %%a >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001') do (
    echo Stopping AI server...
    taskkill /f /pid %%a >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3002') do (
    echo Stopping server on port 3002...
    taskkill /f /pid %%a >nul 2>&1
)

REM Kill any remaining node processes
echo Cleaning up any remaining processes...
taskkill /f /im node.exe >nul 2>&1

echo ✅ All servers stopped and ports freed!
pause 