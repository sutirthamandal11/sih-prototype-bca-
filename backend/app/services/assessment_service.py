import uuid
from datetime import datetime
from typing import List, Dict, Any, Tuple
from app.models.schemas import (
    Quiz, Question, SanitizedQuestion, SanitizedQuizResponse, 
    SkillLevel, Difficulty, RecommendationItem, QuizResultResponse
)
from app.services.db import TOPICS_DB, QUIZZES_DB, USER_ATTEMPTS_DB, ENROLLMENTS_DB

# Canned fallback quizzes for bulletproof demo
MOCK_QUESTION_BANK: Dict[str, List[Question]] = {
    "python-data": [
        Question(
            id="pd-q1",
            text="Which Pandas method is most efficient to filter rows in a DataFrame where column 'age' > 30 and 'dept' == 'Sales'?",
            options=[
                "df.loc[(df['age'] > 30) & (df['dept'] == 'Sales')]",
                "df.filter(age > 30 and dept == 'Sales')",
                "df.where(age > 30, dept == 'Sales')",
                "df[df.age > 30 or df.dept == 'Sales']"
            ],
            correct_option_index=0,
            difficulty=Difficulty.EASY,
            sub_concept="Index slicing & boolean indexing"
        ),
        Question(
            id="pd-q2",
            text="When dealing with missing values in a skewed continuous distribution, which imputation strategy is generally preferred to preserve distribution shape?",
            options=[
                "Global mean imputation",
                "Median or Iterative/MICE imputation",
                "Fill with constant 0",
                "Drop all columns containing any NaN"
            ],
            correct_option_index=1,
            difficulty=Difficulty.MEDIUM,
            sub_concept="Missing value imputation"
        ),
        Question(
            id="pd-q3",
            text="In pandas, how does `df.groupby('dept')['salary'].transform('mean')` differ from `df.groupby('dept')['salary'].mean()`?",
            options=[
                "It is deprecated and produces identical output to mean()",
                "It returns a Series with the same index and length as the original DataFrame",
                "It calculates geometric mean instead of arithmetic mean",
                "It only works on numerical numpy arrays"
            ],
            correct_option_index=1,
            difficulty=Difficulty.HARD,
            sub_concept="groupby aggregations"
        ),
        Question(
            id="pd-q4",
            text="What is the key advantage of using `df.pivot_table()` over `df.pivot()` in pandas?",
            options=[
                "pivot_table handles duplicate index/column combination values by applying an aggregation function",
                "pivot_table requires less memory",
                "pivot only accepts strings whereas pivot_table accepts integers",
                "There is no difference"
            ],
            correct_option_index=0,
            difficulty=Difficulty.MEDIUM,
            sub_concept="Pivot tables"
        ),
        Question(
            id="pd-q5",
            text="Which Interquartile Range (IQR) formula is standard for identifying severe statistical outliers?",
            options=[
                "Values below Q1 - 1.5*IQR or above Q3 + 1.5*IQR",
                "Values below Mean - 1*Std or above Mean + 1*Std",
                "Values outside median +/- 0.5*IQR",
                "Values in the top 25th percentile"
            ],
            correct_option_index=0,
            difficulty=Difficulty.EASY,
            sub_concept="Outlier detection"
        )
    ],
    "survey-design": [
        Question(
            id="sd-q1",
            text="When should Stratified Random Sampling be chosen over Simple Random Sampling?",
            options=[
                "When the target population has distinct sub-groups with high internal homogeneity and high between-group variance",
                "When you have zero prior demographic information about the population",
                "Only when conducting telephone-based automated surveys",
                "When minimizing the total number of sample groups to 1"
            ],
            correct_option_index=0,
            difficulty=Difficulty.EASY,
            sub_concept="Stratified sampling"
        ),
        Question(
            id="sd-q2",
            text="What type of survey error occurs when respondents who decline to participate hold systematically different attitudes than those who respond?",
            options=[
                "Sampling frame mismatch error",
                "Non-response bias",
                "Cognitive acquiescence error",
                "Enumerator transcription error"
            ],
            correct_option_index=1,
            difficulty=Difficulty.MEDIUM,
            sub_concept="Sampling bias & non-response"
        ),
        Question(
            id="sd-q3",
            text="Why is cognitive pre-testing utilized in questionnaire pilot phases?",
            options=[
                "To verify if respondents interpret survey questions as the researchers intended (think-aloud protocol)",
                "To test the server database read-write latency",
                "To calculate statistical significance p-values of preliminary hypotheses",
                "To enforce mandatory survey completion"
            ],
            correct_option_index=0,
            difficulty=Difficulty.HARD,
            sub_concept="Cognitive pre-testing"
        ),
        Question(
            id="sd-q4",
            text="What is the primary danger of using double-barreled questions in public opinion surveys?",
            options=[
                "They force respondents to answer two separate issues with a single response, confounding construct validity",
                "They make the survey too visually appealing",
                "They prevent statistical software from computing frequency tables",
                "They violate copyright regulations"
            ],
            correct_option_index=0,
            difficulty=Difficulty.MEDIUM,
            sub_concept="Construct validity"
        ),
        Question(
            id="sd-q5",
            text="How does Post-Stratification weighting correct for survey imbalances?",
            options=[
                "By adjusting sample weights so demographic distributions match known census population benchmarks",
                "By deleting unrepresentative survey respondents completely",
                "By duplicating random survey rows until quotas match",
                "By asking respondents to retake the survey"
            ],
            correct_option_index=0,
            difficulty=Difficulty.HARD,
            sub_concept="Non-response weighting"
        )
    ],
    "data-privacy": [
        Question(
            id="dp-q1",
            text="What is the core principle of 'Data Minimization' under the DPDP Act and GDPR?",
            options=[
                "Collecting only personal data that is strictly necessary, adequate, and relevant for the specified purpose",
                "Storing all collected data for a minimum of 20 years",
                "Compressing database tables using gzip algorithms",
                "Restricting data access to only 1 employee in an organization"
            ],
            correct_option_index=0,
            difficulty=Difficulty.EASY,
            sub_concept="Data minimization"
        ),
        Question(
            id="dp-q2",
            text="In data anonymization, a dataset satisfies 'k-anonymity' if:",
            options=[
                "Each combination of quasi-identifiers occurs in at least k distinct records within the released dataset",
                "Exactly k columns are encrypted with RSA keys",
                "No individual can be identified with less than k attempts",
                "The database contains exactly k rows"
            ],
            correct_option_index=0,
            difficulty=Difficulty.HARD,
            sub_concept="k-anonymity"
        ),
        Question(
            id="dp-q3",
            text="Under the DPDP Act 2023, what is the role of a 'Data Fiduciary'?",
            options=[
                "The entity that determines the purpose and means of processing personal data",
                "The end-user whose data is being collected",
                "An external third-party hacker",
                "The legal auditor appointed by the High Court"
            ],
            correct_option_index=0,
            difficulty=Difficulty.MEDIUM,
            sub_concept="Fiduciary compliance"
        ),
        Question(
            id="dp-q4",
            text="Which mechanism prevents Re-Identification attacks when combining multiple public databases?",
            options=[
                "Differential privacy with calibrated Laplacian/Gaussian noise",
                "Simple Base64 encoding of names",
                "Removing only the telephone number column",
                "Sorting the table in descending alphabetical order"
            ],
            correct_option_index=0,
            difficulty=Difficulty.HARD,
            sub_concept="Differential privacy"
        ),
        Question(
            id="dp-q5",
            text="What constitutes a valid 'Consent Notice' when onboarding users?",
            options=[
                "Itemized, clear, plain-language description of data collected, purpose, and withdrawal procedure",
                "A 50-page pre-checked checkbox with legalese",
                "A pop-up stating 'by using this site you waive all rights'",
                "Implied verbal acknowledgment"
            ],
            correct_option_index=0,
            difficulty=Difficulty.EASY,
            sub_concept="Notice and consent"
        )
    ]
}

# Retest questions specifically targeting weak concepts
RETEST_QUESTION_BANK: Dict[str, List[Question]] = {
    "python-data": [
        Question(
            id="pd-rt-1",
            text="[Targeted Retest] You want to compute the running sum within each department without collapsing rows. Which groupby pattern should you write?",
            options=[
                "df.groupby('dept')['salary'].cumsum()",
                "df.groupby('dept').sum().to_frame()",
                "df.aggregate(dept=['salary'])",
                "df.filter(group='dept')"
            ],
            correct_option_index=0,
            difficulty=Difficulty.MEDIUM,
            sub_concept="groupby aggregations"
        ),
        Question(
            id="pd-rt-2",
            text="[Targeted Retest] Which pandas pivot table aggregation creates multi-column statistical breakdowns simultaneously?",
            options=[
                "df.pivot_table(index='dept', columns='year', values='sales', aggfunc=['mean', 'median', 'count'])",
                "df.pivot(index='dept', columns='year', values='sales')",
                "df.crosstab(sales, year, dept)",
                "df.unstack(agg='all')"
            ],
            correct_option_index=0,
            difficulty=Difficulty.MEDIUM,
            sub_concept="Pivot tables"
        ),
        Question(
            id="pd-rt-3",
            text="[Targeted Retest] When forward-filling (`ffill()`) time-series data with missing timestamps, what critical caveat must be checked first?",
            options=[
                "Ensure DataFrame is sorted chronologically to avoid lookahead bias",
                "Convert all numerical columns to floats",
                "Verify there are no negative values",
                "Drop all index labels"
            ],
            correct_option_index=0,
            difficulty=Difficulty.HARD,
            sub_concept="Missing value imputation"
        ),
        Question(
            id="pd-rt-4",
            text="[Targeted Retest] How do you filter a DataFrame by checking if a string column contains a regex pattern while handling nulls safely?",
            options=[
                "df[df['email'].str.contains(r'@gov\\.in$', na=False)]",
                "df[df['email'].regex('@gov.in')]",
                "df.filter(regex='email == @gov.in')",
                "df.where(email.match('@gov.in'))"
            ],
            correct_option_index=0,
            difficulty=Difficulty.EASY,
            sub_concept="Index slicing & boolean indexing"
        ),
        Question(
            id="pd-rt-5",
            text="[Targeted Retest] What happens when you perform `df.groupby('category', as_index=False).agg({'revenue': 'sum'})`?",
            options=[
                "It retains 'category' as a regular column instead of making it the index of the resulting DataFrame",
                "It causes a runtime error because as_index is not supported with agg",
                "It replaces nulls with zeroes before grouping",
                "It converts all numerical output to categorical types"
            ],
            correct_option_index=0,
            difficulty=Difficulty.MEDIUM,
            sub_concept="groupby aggregations"
        )
    ]
}

def generate_assessment(topic_id: str, is_retest: bool = False, weak_sub_concepts: List[str] = []) -> Quiz:
    topic = TOPICS_DB.get(topic_id)
    topic_title = topic.title if topic else topic_id.replace("-", " ").title()
    
    quiz_id = f"quiz_{uuid.uuid4().hex[:8]}"
    
    if is_retest and topic_id in RETEST_QUESTION_BANK:
        questions = RETEST_QUESTION_BANK[topic_id]
    elif topic_id in MOCK_QUESTION_BANK:
        questions = MOCK_QUESTION_BANK[topic_id]
    else:
        # Fallback generic questions
        questions = [
            Question(
                id=f"gen-q1",
                text=f"What is the foundational principle underlying {topic_title}?",
                options=["Standardized methodology & consistency", "Ad-hoc guesswork", "Ignoring edge cases", "Manual spreadsheet tracking"],
                correct_option_index=0,
                difficulty=Difficulty.EASY,
                sub_concept="Foundational principles"
            ),
            Question(
                id=f"gen-q2",
                text=f"Which diagnostic metric evaluates reliability in {topic_title}?",
                options=["Standardized variance and error bounds", "Single-point estimates", "Uncalibrated subjective scores", "Arbitrary scoring"],
                correct_option_index=0,
                difficulty=Difficulty.MEDIUM,
                sub_concept="Reliability metrics"
            ),
            Question(
                id=f"gen-q3",
                text=f"When applying {topic_title} at enterprise scale, which trade-off is critical?",
                options=["Balancing computational/operational cost with precision", "Ignoring security protocols", "Eliminating all data validation", "Bypassing audit logs"],
                correct_option_index=0,
                difficulty=Difficulty.HARD,
                sub_concept="Scaling & trade-offs"
            )
        ]
        
    quiz = Quiz(
        quiz_id=quiz_id,
        topic_id=topic_id,
        topic_title=topic_title,
        is_retest=is_retest,
        target_weak_areas=weak_sub_concepts,
        questions=questions,
        created_at=datetime.now().isoformat()
    )
    
    QUIZZES_DB[quiz_id] = quiz
    return quiz

def sanitize_quiz_for_client(quiz: Quiz) -> SanitizedQuizResponse:
    sanitized_questions = [
        SanitizedQuestion(
            id=q.id,
            text=q.text,
            options=q.options,
            difficulty=q.difficulty,
            sub_concept=q.sub_concept
        )
        for q in quiz.questions
    ]
    return SanitizedQuizResponse(
        quiz_id=quiz.quiz_id,
        topic_id=quiz.topic_id,
        topic_title=quiz.topic_title,
        is_retest=quiz.is_retest,
        target_weak_areas=quiz.target_weak_areas,
        total_questions=len(quiz.questions),
        questions=sanitized_questions
    )

def evaluate_submission(quiz: Quiz, user_answers: Dict[str, int]) -> Tuple[float, SkillLevel, List[str], List[str], List[Dict[str, Any]]]:
    correct_count = 0
    weak_sub_concepts: List[str] = []
    strong_sub_concepts: List[str] = []
    breakdown: List[Dict[str, Any]] = []
    
    for q in quiz.questions:
        user_selected = user_answers.get(q.id)
        is_correct = (user_selected == q.correct_option_index)
        
        if is_correct:
            correct_count += 1
            if q.sub_concept not in strong_sub_concepts:
                strong_sub_concepts.append(q.sub_concept)
        else:
            if q.sub_concept not in weak_sub_concepts:
                weak_sub_concepts.append(q.sub_concept)
                
        breakdown.append({
            "question_id": q.id,
            "question_text": q.text,
            "user_answer": q.options[user_selected] if user_selected is not None and user_selected < len(q.options) else "Unanswered",
            "correct_answer": q.options[q.correct_option_index],
            "is_correct": is_correct,
            "sub_concept": q.sub_concept,
            "difficulty": q.difficulty
        })
        
    total = len(quiz.questions)
    score_pct = round((correct_count / total) * 100, 1) if total > 0 else 0.0
    
    # Map score to level
    if score_pct <= 40.0:
        level = SkillLevel.BEGINNER
    elif score_pct <= 75.0:
        level = SkillLevel.INTERMEDIATE
    else:
        level = SkillLevel.ADVANCED
        
    return score_pct, level, weak_sub_concepts, strong_sub_concepts, breakdown

def generate_recommendations_for_weaknesses(topic_title: str, level: SkillLevel, weak_areas: List[str]) -> List[RecommendationItem]:
    recommendations: List[RecommendationItem] = []
    
    if not weak_areas:
        recommendations.append(
            RecommendationItem(
                title=f"Advanced Capstone Challenge in {topic_title}",
                type="Practice Project",
                reason="You demonstrated high proficiency across all tested sub-concepts. Deepen mastery through hands-on architectural problem sets.",
                target_sub_concept="Advanced Synthesis",
                estimated_minutes=45
            )
        )
        return recommendations
        
    for idx, weak_concept in enumerate(weak_areas[:3]):
        rec_types = ["Interactive Exercise", "Targeted Concept Guide", "Step-by-Step Walkthrough"]
        rec_type = rec_types[idx % len(rec_types)]
        
        recommendations.append(
            RecommendationItem(
                title=f"Mastering {weak_concept}: Core Principles & Patterns",
                type=rec_type,
                reason=f"Recommended because you missed assessment questions testing '{weak_concept}'. Reviewing this will boost your score on re-assessment.",
                target_sub_concept=weak_concept,
                estimated_minutes=15 + (idx * 5)
            )
        )
        
    return recommendations
