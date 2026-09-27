@echo off
setlocal
cd /d "%~dp0"

where py >nul 2>nul
if %errorlevel%==0 (
  py -3.11 -m venv .venv
) else (
  python -m venv .venv
)
if errorlevel 1 goto :error

".venv\Scripts\python.exe" -m pip install --upgrade pip
if errorlevel 1 goto :error
".venv\Scripts\python.exe" -m pip install -r requirements.txt
if errorlevel 1 goto :error

where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js 22+ не найден. Установите Node.js и повторите запуск.
  goto :error
)
npm install
if errorlevel 1 goto :error

echo.
echo Yasen_Ava установлен. Для постоянного аватара используйте desktop.bat
exit /b 0

:error
echo.
echo Установка не завершена. Проверьте Python 3.11, Node.js 22+ и подключение к интернету.
exit /b 1
