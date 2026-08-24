@echo off
setlocal enabledelayedexpansion
title SkillFlow AI Launcher

cd /d "%~dp0"

echo ===================================================
echo   SkillFlow AI - Launching SIH Prototype
echo   Multi-Tier Role Governance & AI Assessment Platform
echo ===================================================
echo Working Directory: %~dp0
echo.

echo [1/2] Starting FastAPI Backend on http://127.0.0.1:8000...
start "SkillFlow Backend (FastAPI)" cmd /k "cd /d ""%~dp0backend"" && ""%~dp0backend\venv\Scripts\python.exe"" -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 2 /nobreak >nul

echo [2/2] Starting Vite Frontend on http://localhost:5173...
start "SkillFlow Frontend (Vite)" cmd /k "cd /d ""%~dp0frontend"" && npm.cmd run dev"

echo.
echo ===================================================
echo   Backend API Docs: http://127.0.0.1:8000/docs
echo   Web Application:  http://localhost:5173
echo ===================================================
echo.
echo Leave this window or press any key to close launcher.
pause
