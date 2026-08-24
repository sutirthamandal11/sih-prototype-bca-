import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from app.main import app
from app.models.schemas import UserRole

client = TestClient(app)

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"
    print(" [PASS] Health check")

def test_login_all_roles():
    roles = [
        ("admin@demo.com", UserRole.ADMIN),
        ("manager@demo.com", UserRole.MANAGER),
        ("trainer.rahul@demo.com", UserRole.TRAINER),
        ("learner.aarav@demo.com", UserRole.LEARNER)
    ]
    for email, expected_role in roles:
        res = client.post("/api/auth/login", json={"email": email, "password": "password123"})
        assert res.status_code == 200, f"Login failed for {email}: {res.text}"
        data = res.json()
        assert "access_token" in data
        assert data["user"]["role"] == expected_role.value
        print(f" [PASS] Login verified for {expected_role.value} ({email})")

def test_trainer_views_learners():
    # Login as Trainer
    res = client.post("/api/auth/login", json={"email": "trainer.rahul@demo.com", "password": "password123"})
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Fetch enrolled learners
    res = client.get("/api/trainer/learners", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["trainer"]["name"] == "Rahul Verma"
    assert data["learners_count"] > 0
    # Check that learner's content position is visible
    first_learner = data["learners"][0]
    assert len(first_learner["enrollments"]) > 0
    enr = first_learner["enrollments"][0]
    assert "current_module_title" in enr
    assert "progress_percentage" in enr
    print(f" [PASS] Trainer views {data['learners_count']} learners and content position: '{enr['current_module_title']}' ({enr['progress_percentage']}%)")

def test_manager_views_trainers_and_learners():
    # Login as Training Manager
    res = client.post("/api/auth/login", json={"email": "manager@demo.com", "password": "password123"})
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    res = client.get("/api/manager/trainers-and-learners", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["manager"]["name"] == "Priya Sharma"
    assert data["total_trainers"] >= 2
    assert data["total_learners"] >= 3
    print(f" [PASS] Training Manager views hierarchy: {data['total_trainers']} Trainers, {data['total_learners']} Total Learners")

def test_admin_global_overview():
    # Login as Admin
    res = client.post("/api/auth/login", json={"email": "admin@demo.com", "password": "password123"})
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    res = client.get("/api/admin/overview", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["total_users"] >= 7
    assert data["total_courses"] >= 3
    print(f" [PASS] Admin master overview: {data['total_users']} Users across {data['total_courses']} Topics")

def test_assessment_flow_end_to_end():
    # Login as Learner
    res = client.post("/api/auth/login", json={"email": "learner.aarav@demo.com", "password": "password123"})
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 1. Generate Diagnostic Quiz
    gen_res = client.post("/api/assessment/generate", json={"topic_id": "python-data"}, headers=headers)
    assert gen_res.status_code == 200
    quiz = gen_res.json()
    assert len(quiz["questions"]) == 5
    # Verify answers are stripped
    assert "correct_option_index" not in quiz["questions"][0]
    print(f" [PASS] Step 1: Generated quiz '{quiz['quiz_id']}' with {len(quiz['questions'])} sanitized questions")
    
    # 2. Submit initial answers (simulate beginner score)
    # Intentional wrong answers on advanced topics
    answers = {
        "pd-q1": 0,  # correct
        "pd-q2": 0,  # wrong
        "pd-q3": 0,  # wrong
        "pd-q4": 2,  # wrong
        "pd-q5": 2   # wrong
    }
    sub_res = client.post("/api/assessment/submit", json={"quiz_id": quiz["quiz_id"], "answers": answers}, headers=headers)
    assert sub_res.status_code == 200
    result = sub_res.json()
    assert result["level"] == "Beginner"
    assert len(result["weak_sub_concepts"]) > 0
    assert len(result["recommendations"]) > 0
    print(f" [PASS] Step 2: Graded score={result['score_percentage']}%, Level={result['level']}, Weak Areas={result['weak_sub_concepts']}")
    
    # 3. Request Adaptive Retest targeting weak areas
    retest_gen = client.post("/api/assessment/retest", json={"topic_id": "python-data"}, headers=headers)
    assert retest_gen.status_code == 200
    retest_quiz = retest_gen.json()
    assert retest_quiz["is_retest"] == True
    print(f" [PASS] Step 3: Adaptive Retest generated targeting weak areas: {retest_quiz['target_weak_areas']}")
    
    # 4. Submit Retest with improved answers
    retest_answers = {
        "pd-rt-1": 0, # correct
        "pd-rt-2": 0, # correct
        "pd-rt-3": 0, # correct
        "pd-rt-4": 0, # correct
        "pd-rt-5": 2  # wrong
    }
    retest_sub = client.post("/api/assessment/submit", json={"quiz_id": retest_quiz["quiz_id"], "answers": retest_answers}, headers=headers)
    assert retest_sub.status_code == 200
    retest_result = retest_sub.json()
    assert retest_result["level"] in ("Intermediate", "Advanced")
    assert retest_result["level_improved"] == True
    print(f" [PASS] Step 4: Retest scored {retest_result['score_percentage']}%, Level improved: {retest_result['prior_level']} -> {retest_result['level']}")

if __name__ == "__main__":
    print("\n--- RUNNING BACKEND INTEGRATION TESTS ---")
    test_health()
    test_login_all_roles()
    test_trainer_views_learners()
    test_manager_views_trainers_and_learners()
    test_admin_global_overview()
    test_assessment_flow_end_to_end()
    print("\n ALL BACKEND TESTS PASSED SUCCESSFULLY!\n")
