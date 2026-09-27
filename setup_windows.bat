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

echo.
echo Yasen_Ava установлен. Для запуска используйте run.bat
exit /b 0

:error
echo.
echo Установка не завершена. Проверьте Python 3.11 и подключение к интернету.
exit /b 1
