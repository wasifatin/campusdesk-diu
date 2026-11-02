@echo off
title CampusDesk Server Launcher
echo ========================================================
echo   Launching CampusDesk Server (No terminal commands needed)
echo ========================================================
echo.
set "PATH=C:\Program Files\nodejs;%PATH%"

echo Starting server on http://localhost:3000 ...
start "" http://localhost:3000
npm run dev
pause

