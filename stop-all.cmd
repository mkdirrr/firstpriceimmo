@echo off
REM Stop backend/frontend servers bound to port 4000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4000') do taskkill /PID %%a /F

REM Stop Postgres if it is listening on port 5432
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5432') do taskkill /PID %%a /F

REM Optionally terminate all Node processes
taskkill /F /IM node.exe /T

echo All matching processes have been terminated.
pause