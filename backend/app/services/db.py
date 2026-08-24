from typing import Dict, List, Optional, Any
from datetime import datetime
from app.models.schemas import (
    UserRole, UserResponse, Topic, Module, ContentEnrollmentProgress, 
    ModuleProgress, SkillLevel, LearnerProgressDetail, TrainerWithLearners,
    ManagerHierarchyView, AdminSystemOverview, Quiz
)

# Mock password for all users
DEFAULT_PASSWORD_HASH = "password123"

# --- Pre-seeded Users ---
USERS_DB: Dict[str, Dict[str, Any]] = {
    "admin-1": {
        "id": "admin-1",
        "email": "admin@demo.com",
        "password": DEFAULT_PASSWORD_HASH,
        "name": "Dr. Vikram Seth",
        "role": UserRole.ADMIN,
        "department": "Platform Administration & Governance",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    "manager-1": {
        "id": "manager-1",
        "email": "manager@demo.com",
        "password": DEFAULT_PASSWORD_HASH,
        "name": "Priya Sharma",
        "role": UserRole.MANAGER,
        "department": "Workforce Capability & Training Directorate",
        "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
    },
    "trainer-1": {
        "id": "trainer-1",
        "email": "trainer.rahul@demo.com",
        "password": DEFAULT_PASSWORD_HASH,
        "name": "Rahul Verma",
        "role": UserRole.TRAINER,
        "department": "Data Science & Analytics Division",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        "specializations": ["Python for Data Analysis", "Statistical Computing", "Machine Learning"]
    },
    "trainer-2": {
        "id": "trainer-2",
        "email": "trainer.ananya@demo.com",
        "password": DEFAULT_PASSWORD_HASH,
        "name": "Ananya Iyer",
        "role": UserRole.TRAINER,
        "department": "Social Research & Governance",
        "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
        "specializations": ["Survey Design & Sampling", "Data Privacy & Governance", "Field Operations"]
    },
    "learner-1": {
        "id": "learner-1",
        "email": "learner.aarav@demo.com",
        "password": DEFAULT_PASSWORD_HASH,
        "name": "Aarav Patel",
        "role": UserRole.LEARNER,
        "department": "Operations Analytics Unit",
        "trainer_id": "trainer-1",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    },
    "learner-2": {
        "id": "learner-2",
        "email": "learner.diya@demo.com",
        "password": DEFAULT_PASSWORD_HASH,
        "name": "Diya Roy",
        "role": UserRole.LEARNER,
        "department": "Field Research & Impact Evaluation",
        "trainer_id": "trainer-2",
        "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
    },
    "learner-3": {
        "id": "learner-3",
        "email": "learner.kavita@demo.com",
        "password": DEFAULT_PASSWORD_HASH,
        "name": "Kavita Nair",
        "role": UserRole.LEARNER,
        "department": "Policy & Regulatory Affairs",
        "trainer_id": "trainer-1",
        "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
    }
}

# --- Pre-seeded Topics & Course Content ---
TOPICS_DB: Dict[str, Topic] = {
    "python-data": Topic(
        id="python-data",
        title="Python for Data Analysis",
        category="Data Science & Engineering",
        description="Master data wrangling, exploratory data analysis, filtering, and statistical aggregations using Python and Pandas.",
        total_modules=4,
        difficulty_level="Beginner to Intermediate",
        estimated_hours=12,
        modules=[
            Module(
                id="mod-pd-1",
                title="Pandas Fundamentals & Data Structures",
                description="Series, DataFrames, indexing, and basic slicing.",
                duration="2.5 hours",
                sub_concepts=["DataFrame creation", "Index slicing", "Series operations"]
            ),
            Module(
                id="mod-pd-2",
                title="Data Cleaning & Missing Value Imputation",
                description="Handling NaN values, type casting, string manipulation, and duplicate removal.",
                duration="3 hours",
                sub_concepts=["Missing value imputation", "Dtype conversion", "String vectorization"]
            ),
            Module(
                id="mod-pd-3",
                title="Advanced Grouping, Aggregation & Pivot Tables",
                description="Split-apply-combine paradigm, multi-level indexing, and pivot transforms.",
                duration="3.5 hours",
                sub_concepts=["groupby aggregations", "Pivot tables", "Cross-tabulation"]
            ),
            Module(
                id="mod-pd-4",
                title="Exploratory Data Analysis & Visualization",
                description="Extracting distributions, correlation heatmaps, and outlier identification.",
                duration="3 hours",
                sub_concepts=["Outlier detection", "Correlation analysis", "Visualization export"]
            )
        ]
    ),
    "survey-design": Topic(
        id="survey-design",
        title="Survey Design & Sampling Methods",
        category="Research Methodology",
        description="Learn scientific sampling methodologies, questionnaire design, bias mitigation, and pilot survey validation.",
        total_modules=4,
        difficulty_level="Intermediate",
        estimated_hours=10,
        modules=[
            Module(
                id="mod-sd-1",
                title="Questionnaire Framing & Construct Validity",
                description="Designing unbiased Likert scales, open vs closed question strategy.",
                duration="2 hours",
                sub_concepts=["Construct validity", "Likert scale calibration", "Response fatigue"]
            ),
            Module(
                id="mod-sd-2",
                title="Probability Sampling & Stratification",
                description="Stratified random sampling, cluster sampling, and sample size calculations.",
                duration="3 hours",
                sub_concepts=["Stratified sampling", "Cluster sampling", "Sample size power"]
            ),
            Module(
                id="mod-sd-3",
                title="Mitigating Sampling & Non-Response Bias",
                description="Detecting selection bias, non-response weighting, and attrition compensation.",
                duration="2.5 hours",
                sub_concepts=["Sampling bias", "Non-response weighting", "Survey attrition"]
            ),
            Module(
                id="mod-sd-4",
                title="Pilot Testing & Field Protocol Execution",
                description="Conducting pilot surveys, cognitive pre-testing, and enumerator training.",
                duration="2.5 hours",
                sub_concepts=["Cognitive pre-testing", "Field protocol", "Enumerator reliability"]
            )
        ]
    ),
    "data-privacy": Topic(
        id="data-privacy",
        title="Data Privacy & Governance (DPDP & GDPR)",
        category="Governance & Compliance",
        description="Understanding privacy frameworks, PII data anonymization, consent architectures, and audit protocols.",
        total_modules=4,
        difficulty_level="Foundational",
        estimated_hours=8,
        modules=[
            Module(
                id="mod-dp-1",
                title="Principles of Data Privacy & Consent",
                description="Core tenets of DPDP Act 2023, GDPR principles, and notice requirements.",
                duration="2 hours",
                sub_concepts=["Notice and consent", "Data minimization", "Purpose limitation"]
            ),
            Module(
                id="mod-dp-2",
                title="Anonymization & Pseudonymization Techniques",
                description="k-anonymity, l-diversity, hashing, and differential privacy.",
                duration="2 hours",
                sub_concepts=["k-anonymity", "Hashing PII", "Differential privacy"]
            ),
            Module(
                id="mod-dp-3",
                title="Access Control & Data Fiduciary Obligations",
                description="Role-based access control, data fiduciary duties, and cross-border transfers.",
                duration="2 hours",
                sub_concepts=["Role-based access", "Fiduciary compliance", "Cross-border rules"]
            ),
            Module(
                id="mod-dp-4",
                title="Incident Response & Regulatory Audits",
                description="Data breach notification timelines, audit trails, and penalty frameworks.",
                duration="2 hours",
                sub_concepts=["Breach notification", "Audit logging", "Enforcement penalties"]
            )
        ]
    )
}

# --- Pre-seeded Learner Enrollments & Content Progress ---
ENROLLMENTS_DB: Dict[str, Dict[str, ContentEnrollmentProgress]] = {
    "learner-1": {
        "python-data": ContentEnrollmentProgress(
            enrollment_id="enr-l1-pd",
            topic_id="python-data",
            topic_title="Python for Data Analysis",
            category="Data Science & Engineering",
            total_modules=4,
            completed_modules_count=2,
            current_module_id="mod-pd-3",
            current_module_title="Module 3: Advanced Grouping, Aggregation & Pivot Tables",
            progress_percentage=55,
            status="in_progress",
            last_accessed=datetime.now().strftime("%Y-%m-%d %H:%M"),
            modules=[
                ModuleProgress(module_id="mod-pd-1", module_title="Pandas Fundamentals", status="completed", completed_at="2026-08-20 14:30"),
                ModuleProgress(module_id="mod-pd-2", module_title="Data Cleaning & Imputation", status="completed", completed_at="2026-08-22 16:45"),
                ModuleProgress(module_id="mod-pd-3", module_title="Advanced Grouping & Pivot Tables", status="in_progress"),
                ModuleProgress(module_id="mod-pd-4", module_title="Exploratory Data Analysis", status="locked")
            ],
            has_taken_initial_assessment=True,
            latest_score=35.0,
            current_level=SkillLevel.BEGINNER,
            weak_sub_concepts=["groupby aggregations", "Pivot tables", "Missing value imputation"],
            has_taken_retest=False
        ),
        "data-privacy": ContentEnrollmentProgress(
            enrollment_id="enr-l1-dp",
            topic_id="data-privacy",
            topic_title="Data Privacy & Governance (DPDP & GDPR)",
            category="Governance & Compliance",
            total_modules=4,
            completed_modules_count=1,
            current_module_id="mod-dp-2",
            current_module_title="Module 2: Anonymization & Pseudonymization Techniques",
            progress_percentage=25,
            status="in_progress",
            last_accessed=datetime.now().strftime("%Y-%m-%d %H:%M"),
            modules=[
                ModuleProgress(module_id="mod-dp-1", module_title="Principles of Data Privacy", status="completed", completed_at="2026-08-21 11:00"),
                ModuleProgress(module_id="mod-dp-2", module_title="Anonymization Techniques", status="in_progress"),
                ModuleProgress(module_id="mod-dp-3", module_title="Access Control Obligations", status="locked"),
                ModuleProgress(module_id="mod-dp-4", module_title="Incident Response", status="locked")
            ],
            has_taken_initial_assessment=False
        )
    },
    "learner-2": {
        "survey-design": ContentEnrollmentProgress(
            enrollment_id="enr-l2-sd",
            topic_id="survey-design",
            topic_title="Survey Design & Sampling Methods",
            category="Research Methodology",
            total_modules=4,
            completed_modules_count=3,
            current_module_id="mod-sd-4",
            current_module_title="Module 4: Pilot Testing & Field Protocol Execution",
            progress_percentage=80,
            status="in_progress",
            last_accessed=datetime.now().strftime("%Y-%m-%d %H:%M"),
            modules=[
                ModuleProgress(module_id="mod-sd-1", module_title="Questionnaire Framing", status="completed", completed_at="2026-08-18 10:15"),
                ModuleProgress(module_id="mod-sd-2", module_title="Probability Sampling", status="completed", completed_at="2026-08-20 15:30"),
                ModuleProgress(module_id="mod-sd-3", module_title="Mitigating Sampling Bias", status="completed", completed_at="2026-08-23 09:40"),
                ModuleProgress(module_id="mod-sd-4", module_title="Pilot Testing Execution", status="in_progress")
            ],
            has_taken_initial_assessment=True,
            latest_score=68.0,
            current_level=SkillLevel.INTERMEDIATE,
            weak_sub_concepts=["Sampling bias", "Non-response weighting"],
            has_taken_retest=True,
            retest_score=88.0,
            retest_level=SkillLevel.ADVANCED
        )
    },
    "learner-3": {
        "python-data": ContentEnrollmentProgress(
            enrollment_id="enr-l3-pd",
            topic_id="python-data",
            topic_title="Python for Data Analysis",
            category="Data Science & Engineering",
            total_modules=4,
            completed_modules_count=1,
            current_module_id="mod-pd-2",
            current_module_title="Module 2: Data Cleaning & Missing Value Imputation",
            progress_percentage=30,
            status="in_progress",
            last_accessed=datetime.now().strftime("%Y-%m-%d %H:%M"),
            modules=[
                ModuleProgress(module_id="mod-pd-1", module_title="Pandas Fundamentals", status="completed", completed_at="2026-08-23 18:00"),
                ModuleProgress(module_id="mod-pd-2", module_title="Data Cleaning & Imputation", status="in_progress"),
                ModuleProgress(module_id="mod-pd-3", module_title="Advanced Grouping", status="locked"),
                ModuleProgress(module_id="mod-pd-4", module_title="Exploratory Data Analysis", status="locked")
            ],
            has_taken_initial_assessment=True,
            latest_score=40.0,
            current_level=SkillLevel.BEGINNER,
            weak_sub_concepts=["Missing value imputation", "Dtype conversion"],
            has_taken_retest=False
        )
    }
}

# --- In-Memory Quizzes Store ---
QUIZZES_DB: Dict[str, Quiz] = {}
USER_ATTEMPTS_DB: List[Dict[str, Any]] = []

# --- Database Helper Functions ---
def get_user_by_id(user_id: str) -> Optional[UserResponse]:
    u = USERS_DB.get(user_id)
    if not u:
        return None
    return UserResponse(**{k: v for k, v in u.items() if k != "password"})

def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    for u in USERS_DB.values():
        if u["email"].lower() == email.lower():
            return u
    return None

def get_learner_progress_detail(learner_id: str) -> Optional[LearnerProgressDetail]:
    learner_data = USERS_DB.get(learner_id)
    if not learner_data or learner_data["role"] != UserRole.LEARNER:
        return None
    
    learner = UserResponse(**{k: v for k, v in learner_data.items() if k != "password"})
    trainer = None
    if learner.trainer_id:
        t_data = USERS_DB.get(learner.trainer_id)
        if t_data:
            trainer = UserResponse(**{k: v for k, v in t_data.items() if k != "password"})
            
    enrollments_dict = ENROLLMENTS_DB.get(learner_id, {})
    enrollments = list(enrollments_dict.values())
    
    overall_progress = 0
    completed_count = 0
    in_progress_count = 0
    
    if enrollments:
        overall_progress = int(sum(e.progress_percentage for e in enrollments) / len(enrollments))
        completed_count = sum(1 for e in enrollments if e.progress_percentage >= 100)
        in_progress_count = sum(1 for e in enrollments if 0 < e.progress_percentage < 100)
        
    return LearnerProgressDetail(
        learner=learner,
        trainer=trainer,
        enrollments=enrollments,
        overall_progress=overall_progress,
        completed_courses_count=completed_count,
        in_progress_courses_count=in_progress_count
    )

def get_trainer_with_learners(trainer_id: str) -> Optional[TrainerWithLearners]:
    t_data = USERS_DB.get(trainer_id)
    if not t_data or t_data["role"] != UserRole.TRAINER:
        return None
        
    trainer = UserResponse(**{k: v for k, v in t_data.items() if k != "password"})
    specializations = t_data.get("specializations", [])
    
    # Find all learners assigned to this trainer
    assigned_learners: List[LearnerProgressDetail] = []
    for uid, udata in USERS_DB.items():
        if udata.get("role") == UserRole.LEARNER and udata.get("trainer_id") == trainer_id:
            lp = get_learner_progress_detail(uid)
            if lp:
                assigned_learners.append(lp)
                
    avg_prog = 0
    if assigned_learners:
        avg_prog = int(sum(l.overall_progress for l in assigned_learners) / len(assigned_learners))
        
    return TrainerWithLearners(
        trainer=trainer,
        specializations=specializations,
        learners_count=len(assigned_learners),
        learners=assigned_learners,
        avg_learner_progress=avg_prog
    )

def get_manager_hierarchy() -> ManagerHierarchyView:
    mgr_data = USERS_DB["manager-1"]
    manager = UserResponse(**{k: v for k, v in mgr_data.items() if k != "password"})
    
    trainers_list: List[TrainerWithLearners] = []
    for uid, udata in USERS_DB.items():
        if udata.get("role") == UserRole.TRAINER:
            twl = get_trainer_with_learners(uid)
            if twl:
                trainers_list.append(twl)
                
    total_learners = sum(t.learners_count for t in trainers_list)
    avg_org = 0
    if trainers_list:
        avg_org = int(sum(t.avg_learner_progress for t in trainers_list) / len(trainers_list))
        
    return ManagerHierarchyView(
        manager=manager,
        total_trainers=len(trainers_list),
        total_learners=total_learners,
        avg_org_progress=avg_org,
        trainers=trainers_list
    )

def get_admin_overview() -> AdminSystemOverview:
    all_learners: List[LearnerProgressDetail] = []
    for uid, udata in USERS_DB.items():
        if udata.get("role") == UserRole.LEARNER:
            lp = get_learner_progress_detail(uid)
            if lp:
                all_learners.append(lp)
                
    trainers_list: List[TrainerWithLearners] = []
    for uid, udata in USERS_DB.items():
        if udata.get("role") == UserRole.TRAINER:
            twl = get_trainer_with_learners(uid)
            if twl:
                trainers_list.append(twl)
                
    total_managers = sum(1 for u in USERS_DB.values() if u["role"] == UserRole.MANAGER)
    
    # Calculate avg org score across assessments
    scores = []
    for enr_dict in ENROLLMENTS_DB.values():
        for enr in enr_dict.values():
            if enr.latest_score is not None:
                scores.append(enr.latest_score)
            if enr.retest_score is not None:
                scores.append(enr.retest_score)
    avg_score = round(sum(scores) / len(scores), 1) if scores else 72.5
    
    return AdminSystemOverview(
        total_users=len(USERS_DB),
        total_learners=len(all_learners),
        total_trainers=len(trainers_list),
        total_managers=total_managers,
        total_courses=len(TOPICS_DB),
        active_assessments_count=len(scores),
        avg_org_score=avg_score,
        learners=all_learners,
        trainers=trainers_list,
        all_topics=list(TOPICS_DB.values())
    )
