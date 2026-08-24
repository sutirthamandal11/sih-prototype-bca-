@echo off
title SkillFlow Backend (FastAPI)
cd /d "%~dp0backend"
echo Starting FastAPI Backend on http://127.0.0.1:8000 ...
"%~dp0backend\venv\Scripts\python.exe" -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
pause
