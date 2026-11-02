@echo off
title Push CampusDesk to GitHub
echo ========================================================
echo   Pushing CampusDesk to GitHub
echo   Repository: https://github.com/wasifatin/campusdesk-diu.git
echo ========================================================
echo.
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo   SUCCESS: All files pushed to GitHub successfully!
    echo ========================================================
) else (
    echo ========================================================
    echo   If prompted, sign in with GitHub in your browser window.
    echo ========================================================
)
echo.
pause

