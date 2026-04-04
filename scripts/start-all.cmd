@echo off
setlocal

set "ROOT=%~dp0"
set "CLIENT=%ROOT%client"
set "SERVER=%ROOT%server"
set "AI=%ROOT%ai-service"

echo Starting CyberShield services...
echo.

if not exist "%SERVER%\node_modules" (
  echo [1/3] Installing server dependencies...
  pushd "%SERVER%"
  call npm install
  if errorlevel 1 goto :fail
  popd
)

if not exist "%CLIENT%\node_modules" (
  echo [2/3] Installing client dependencies...
  pushd "%CLIENT%"
  call npm install
  if errorlevel 1 goto :fail
  popd
)

echo [3/3] Starting server, client, and AI service in separate windows...

start "CyberShield Server" /D "%SERVER%" cmd /k npm run dev
start "CyberShield Client" /D "%CLIENT%" cmd /k npm run dev
start "CyberShield AI" /D "%AI%" cmd /k "if exist .venv\Scripts\activate.bat (call .venv\Scripts\activate.bat && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000) else (echo Missing ai-service\.venv. Create it first. & pause)"

echo.
echo Launched. Keep the three windows open.
exit /b 0

:fail
echo.
echo Startup failed. Check the error above.
exit /b 1
