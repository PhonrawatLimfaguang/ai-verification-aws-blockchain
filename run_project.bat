@echo off
echo 🚀 Starting AI Verification Project...
echo.

REM ✅ 1. Start Backend Server (server.js)
start cmd /k "cd /d C:\Users\phonr\Desktop\ai-verification && node server.js"

REM ✅ 2. Start React Dashboard
start cmd /k "cd /d C:\Users\phonr\Desktop\ai-verification\dashboard && npm start"

echo ✅ All systems launched!
pause
