# SkillFlow AI — Role-Based Skill Assessment & Governance Platform

A full-stack web platform implementing **Role-Based Access Control (RBAC)** across **Learners, Trainers, Training Managers, and Admins**, integrated with an end-to-end **AI Skill Assessment closed-loop** (Assessment &rarr; Grading &rarr; Personalized Recommendations &rarr; Adaptive Retest).

---

## 👥 The 4-Tier Role Governance Matrix

| Role | Permissions & Visibility | Demo Login Persona |
|---|---|---|
| **Learner** | • Views enrolled courses & exact **Current Content Position** (e.g. *Module 3: Advanced Grouping*).<br>• Takes AI Diagnostic Skill Assessments.<br>• Receives personalized AI study recommendations.<br>• Takes Adaptive Retests on weak areas to show level progression. | `learner.aarav@demo.com`<br>Password: `password123` |
| **Trainer** | • Monitors assigned/enrolled learners.<br>• Inspects each learner's **exact real-time content position** and completion %.<br>• Reviews diagnostic scores, skill levels (*Beginner/Intermediate/Advanced*), and weak sub-concept tags.<br>• Drilldown inspection for each learner. | `trainer.rahul@demo.com`<br>Password: `password123` |
| **Training Manager** | • Oversees all faculty trainers and their respective cohorts.<br>• Tracks cohort completion velocity and organizational progress KPIs.<br>• Expandable hierarchy to view trainers and their enrolled learners. | `manager@demo.com`<br>Password: `password123` |
| **Administrator** | • Master platform oversight across all tiers.<br>• System user directory with role assignment.<br>• Curriculum & assessment catalog governance.<br>• Global organizational analytics. | `admin@demo.com`<br>Password: `password123` |

---

## ⚡ Quick Start

### 1. One-Click Launch (Windows)
Double-click [`start-dev.bat`](file:///D:/cotain/sih%20prototype/start-dev.bat) in the project root to launch both Backend and Frontend.

### 2. Manual Terminal Launch

#### Backend (FastAPI):
```bash
cd backend
venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
*API Swagger Docs*: `http://127.0.0.1:8000/docs`

#### Frontend (React + Vite + Tailwind):
```bash
cd frontend
npm run dev
```
*Web Application*: `http://localhost:5173`

---

## 🧪 Running Automated Backend Tests

```bash
cd backend
venv\Scripts\python.exe tests/test_backend.py
```
This tests:
1. Health & Server Status
2. JWT Authentication for all 4 roles
3. Trainer visibility into enrolled learners & content positions
4. Training Manager hierarchy view
5. Admin global system metrics
6. Complete 4-step AI Assessment &rarr; Diagnostic Grading &rarr; Retest improvement flow.
