from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class UserRole(str, Enum):
    LEARNER = "learner"
    TRAINER = "trainer"
    MANAGER = "manager"
    ADMIN = "admin"

class SkillLevel(str, Enum):
    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"

class Difficulty(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"

# --- User & Auth Schemas ---
class UserBase(BaseModel):
    id: str
    email: str
    name: str
    role: UserRole
    department: str
    avatar: Optional[str] = None
    trainer_id: Optional[str] = None  # For learners, points to their trainer

class UserResponse(UserBase):
    pass

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# --- Course & Module Schemas ---
class Module(BaseModel):
    id: str
    title: str
    description: str
    duration: str
    sub_concepts: List[str]

class Topic(BaseModel):
    id: str
    title: str
    category: str
    description: str
    total_modules: int
    modules: List[Module]
    difficulty_level: str
    estimated_hours: int

# --- Learner Progress Schemas ---
class ModuleProgress(BaseModel):
    module_id: str
    module_title: str
    status: str  # "completed", "in_progress", "locked"
    completed_at: Optional[str] = None

class ContentEnrollmentProgress(BaseModel):
    enrollment_id: str
    topic_id: str
    topic_title: str
    category: str
    total_modules: int
    completed_modules_count: int
    current_module_id: str
    current_module_title: str
    progress_percentage: int
    status: str  # "in_progress", "completed", "not_started"
    last_accessed: str
    modules: List[ModuleProgress]
    # Skill Assessment metrics
    has_taken_initial_assessment: bool = False
    latest_score: Optional[float] = None
    current_level: Optional[SkillLevel] = None
    weak_sub_concepts: List[str] = []
    has_taken_retest: bool = False
    retest_score: Optional[float] = None
    retest_level: Optional[SkillLevel] = None

class LearnerProgressDetail(BaseModel):
    learner: UserResponse
    trainer: Optional[UserResponse] = None
    enrollments: List[ContentEnrollmentProgress]
    overall_progress: int
    completed_courses_count: int
    in_progress_courses_count: int

# --- Hierarchy & Management Schemas ---
class TrainerWithLearners(BaseModel):
    trainer: UserResponse
    specializations: List[str]
    learners_count: int
    learners: List[LearnerProgressDetail]
    avg_learner_progress: int

class ManagerHierarchyView(BaseModel):
    manager: UserResponse
    total_trainers: int
    total_learners: int
    avg_org_progress: int
    trainers: List[TrainerWithLearners]

class AdminSystemOverview(BaseModel):
    total_users: int
    total_learners: int
    total_trainers: int
    total_managers: int
    total_courses: int
    active_assessments_count: int
    avg_org_score: float
    learners: List[LearnerProgressDetail]
    trainers: List[TrainerWithLearners]
    all_topics: List[Topic]

# --- Assessment & Quiz Schemas ---
class Question(BaseModel):
    id: str
    text: str
    options: List[str]
    correct_option_index: int
    difficulty: Difficulty
    sub_concept: str

class SanitizedQuestion(BaseModel):
    id: str
    text: str
    options: List[str]
    difficulty: Difficulty
    sub_concept: str

class GenerateQuizRequest(BaseModel):
    user_id: Optional[str] = None
    topic_id: str

class Quiz(BaseModel):
    quiz_id: str
    topic_id: str
    topic_title: str
    is_retest: bool = False
    target_weak_areas: List[str] = []
    questions: List[Question]
    created_at: str

class SanitizedQuizResponse(BaseModel):
    quiz_id: str
    topic_id: str
    topic_title: str
    is_retest: bool
    target_weak_areas: List[str]
    total_questions: int
    questions: List[SanitizedQuestion]

class RecommendationItem(BaseModel):
    title: str
    type: str  # "Interactive Exercise", "Targeted Reading", "Video Walkthrough"
    reason: str
    target_sub_concept: str
    estimated_minutes: int

class QuizSubmitRequest(BaseModel):
    user_id: Optional[str] = None
    quiz_id: str
    answers: Dict[str, int]  # { question_id: selected_index }

class QuizResultResponse(BaseModel):
    quiz_id: str
    topic_id: str
    topic_title: str
    is_retest: bool
    score_percentage: float
    total_questions: int
    correct_count: int
    level: SkillLevel
    prior_level: Optional[SkillLevel] = None
    level_improved: bool = False
    weak_sub_concepts: List[str]
    strong_sub_concepts: List[str]
    recommendations: List[RecommendationItem]
    question_breakdown: List[Dict[str, Any]]
