@echo off
setlocal
cd /d "%~dp0"

if not exist "node_modules\electron\dist\electron.exe" (
  echo Electron не установлен. Сначала запустите setup_windows.bat
  pause
  exit /b 1
)

start "Yasen_Ava" "%~dp0node_modules\electron\dist\electron.exe" "%~dp0."
