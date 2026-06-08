@echo off
rem Starts backend and frontend in separate command windows on Windows.
cd /d "%~dp0backend"
start "Backend" cmd /k "cd /d "%~dp0backend" && npm.cmd run dev"
start "Frontend" cmd /k "cd /d "%~dp0frontend" && npm.cmd run dev"
