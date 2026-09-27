@echo off
cd /d "%~dp0"
if exist ".venv\Scripts\python.exe" (
  ".venv\Scripts\python.exe" -B bridge\server.py %*
) else (
  python -B bridge\server.py %*
)
