@echo off
setlocal
cd /d %~dp0

rem ==========================
rem  ADMIN / MODERATION SETUP
rem ==========================
rem Первый админ создаётся (или назначается) при запуске, если заданы переменные:
set "KUSARY_ADMIN_IDENTIFIER=admin"
set "KUSARY_ADMIN_PASSWORD=strongpass"
rem
rem Премодерация объявлений (новые объявления будут «На модерации»):
rem   set "KUSARY_PREMODERATION=1"
rem
rem Если порт 5000 занят, можешь сменить:
rem   set "KUSARY_PORT=5050"

if "%KUSARY_PORT%"=="" set "KUSARY_PORT=5000"

echo.
echo ============================================================
echo  Kusary Services - Local start
echo  Folder: %cd%
echo ============================================================
echo.

if not exist ".venv\Scripts\python.exe" (
  echo [1/3] Creating venv...
  python -m venv .venv
  if errorlevel 1 (
    echo Failed to create venv. Make sure Python is installed and added to PATH.
    echo Tip: open cmd and run: python --version
    pause
    exit /b 1
  )
) else (
  echo [1/3] venv already exists - OK
)

echo [2/3] Installing requirements...
call .venv\Scripts\python.exe -m pip install --upgrade pip
call .venv\Scripts\python.exe -m pip install -r requirements.txt
if errorlevel 1 (
  echo Failed to install requirements.
  pause
  exit /b 1
)

echo [3/3] Starting server...
echo Open in browser:
echo   http://127.0.0.1:%KUSARY_PORT%
echo Health check:
echo   http://127.0.0.1:%KUSARY_PORT%/api/health
echo.

call .venv\Scripts\python.exe server.py

echo.
echo Server stopped (or crashed). If there was an error above, copy it and send it to me.
pause
endlocal
