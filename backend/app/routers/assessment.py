from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from datetime import datetime
from app.models.schemas import (
    GenerateQuizRequest, SanitizedQuizResponse, QuizSubmitRequest, 
    QuizResultResponse, UserResponse, UserRole, SkillLevel
)
from app.services.auth_service import get_current_user
from app.services.db import QUIZZES_DB, USER_ATTEMPTS_DB, ENROLLMENTS_DB, TOPICS_DB
from app.services.assessment_service import (
    generate_assessment, sanitize_quiz_for_client, evaluate_submission,
    generate_recommendations_for_weaknesses
)

router = APIRouter(prefix="/assessment", tags=["AI Skill Assessment Flow"])

@router.post("/generate", response_model=SanitizedQuizResponse)
def generate_quiz_endpoint(
    req: GenerateQuizRequest,
    current_user: Optional[UserResponse] = Depends(get_current_user)
):
    """
    Step 2 in Demo Flow:
    Generates a 5-question multi-difficulty diagnostic MCQ quiz for the chosen topic.
    Strips correct answers before returning to the frontend.
    """
    quiz = generate_assessment(topic_id=req.topic_id, is_retest=False)
    return sanitize_quiz_for_client(quiz)

@router.post("/submit", response_model=QuizResultResponse)
def submit_quiz_endpoint(
    req: QuizSubmitRequest,
    current_user: Optional[UserResponse] = Depends(get_current_user)
):
    """
    Step 3 in Demo Flow:
    Grades user answers against stored key, maps score -> level,
    identifies weak sub-concepts, and generates tailored study recommendations.
    """
    quiz = QUIZZES_DB.get(req.quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz ID not found or expired.")
        
    user_id = req.user_id or (current_user.id if current_user else "learner-1")
    
    score_pct, level, weak_subs, strong_subs, breakdown = evaluate_submission(quiz, req.answers)
    recommendations = generate_recommendations_for_weaknesses(quiz.topic_title, level, weak_subs)
    
    # Check prior level from enrollment
    prior_level: Optional[SkillLevel] = None
    level_improved: bool = False
    
    user_enrs = ENROLLMENTS_DB.setdefault(user_id, {})
    if quiz.topic_id in user_enrs:
        enr = user_enrs[quiz.topic_id]
        if quiz.is_retest:
            prior_level = enr.current_level
            enr.has_taken_retest = True
            enr.retest_score = score_pct
            enr.retest_level = level
            # Check improvement
            level_rank = {SkillLevel.BEGINNER: 1, SkillLevel.INTERMEDIATE: 2, SkillLevel.ADVANCED: 3}
            if prior_level and level_rank.get(level, 1) > level_rank.get(prior_level, 1):
                level_improved = True
            elif prior_level and score_pct > (enr.latest_score or 0):
                level_improved = True
        else:
            enr.has_taken_initial_assessment = True
            enr.latest_score = score_pct
            enr.current_level = level
            enr.weak_sub_concepts = weak_subs
            
    # Record attempt history
    attempt_record = {
        "attempt_id": f"att_{len(USER_ATTEMPTS_DB) + 1}",
        "user_id": user_id,
        "quiz_id": req.quiz_id,
        "topic_id": quiz.topic_id,
        "is_retest": quiz.is_retest,
        "score_percentage": score_pct,
        "level": level.value,
        "weak_sub_concepts": weak_subs,
        "timestamp": datetime.now().isoformat()
    }
    USER_ATTEMPTS_DB.append(attempt_record)
    
    return QuizResultResponse(
        quiz_id=quiz.quiz_id,
        topic_id=quiz.topic_id,
        topic_title=quiz.topic_title,
        is_retest=quiz.is_retest,
        score_percentage=score_pct,
        total_questions=len(quiz.questions),
        correct_count=sum(1 for b in breakdown if b["is_correct"]),
        level=level,
        prior_level=prior_level,
        level_improved=level_improved,
        weak_sub_concepts=weak_subs,
        strong_sub_concepts=strong_subs,
        recommendations=recommendations,
        question_breakdown=breakdown
    )

@router.post("/retest", response_model=SanitizedQuizResponse)
def retest_quiz_endpoint(
    req: GenerateQuizRequest,
    current_user: Optional[UserResponse] = Depends(get_current_user)
):
    """
    Step 4 in Demo Flow:
    Looks up learner's previous weak areas and generates an adaptive retest
    deliberately weighted toward those topics.
    """
    user_id = req.user_id or (current_user.id if current_user else "learner-1")
    user_enrs = ENROLLMENTS_DB.get(user_id, {})
    weak_areas = []
    if req.topic_id in user_enrs:
        weak_areas = user_enrs[req.topic_id].weak_sub_concepts
        
    quiz = generate_assessment(topic_id=req.topic_id, is_retest=True, weak_sub_concepts=weak_areas)
    return sanitize_quiz_for_client(quiz)
