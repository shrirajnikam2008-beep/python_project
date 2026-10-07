"""
Unit tests for the Skill Gap Engine (Person 2).
Tests the exact worked example for student Alex from Review 2 Backend Guide.
"""
from backend.services.skill_gap import analyze_gaps

def test_alex_worked_example():
    # Alex profile: skills python, cpp, html-css, git, destination ai-ml-engineer
    skills, gaps = analyze_gaps(
        destination_id="ai-ml-engineer",
        current_skills=["python", "cpp", "html-css", "git"],
    )

    gaps_map = {g.skill_id: g for g in gaps}
    skills_map = {s.id: s for s in skills}

    # 1. python and git should be satisfied (completed) and not in gaps
    assert "python" not in gaps_map
    assert "git" not in gaps_map
    assert skills_map["python"].status == "completed"
    assert skills_map["git"].status == "completed"

    # 2. Critical gaps with blocksCount >= 2
    assert "machine-learning" in gaps_map
    assert gaps_map["machine-learning"].priority == "critical"
    assert gaps_map["machine-learning"].skill.status == "locked"
    assert gaps_map["machine-learning"].gap == "full"

    assert "data-structures" in gaps_map
    assert gaps_map["data-structures"].priority == "critical"
    assert gaps_map["data-structures"].skill.status == "next"  # python is satisfied

    assert "deep-learning" in gaps_map
    assert gaps_map["deep-learning"].priority == "critical"
    assert gaps_map["deep-learning"].skill.status == "locked"

    assert "linear-algebra" in gaps_map
    assert gaps_map["linear-algebra"].priority == "critical"
    assert gaps_map["linear-algebra"].skill.status == "next"  # no prereqs

    assert "statistics" in gaps_map
    assert gaps_map["statistics"].priority == "critical"
    assert gaps_map["statistics"].skill.status == "locked"  # needs linear-algebra

    # 3. High priority gaps (core importance, blocksCount < 2)
    assert "data-analysis" in gaps_map
    assert gaps_map["data-analysis"].priority == "high"
    assert gaps_map["data-analysis"].skill.status == "locked"

    assert "sql" in gaps_map
    assert gaps_map["sql"].priority == "high"
    assert gaps_map["sql"].skill.status == "locked"

    # 4. Recommended gaps (supporting/optional)
    assert "mlops" in gaps_map
    assert gaps_map["mlops"].priority == "recommended"
    assert gaps_map["mlops"].skill.status == "locked"  # needs machine-learning

    assert "cloud-basics" in gaps_map
    assert gaps_map["cloud-basics"].priority == "recommended"
    assert gaps_map["cloud-basics"].skill.status == "next"  # only needs git, which Alex has

def test_zero_skills_student():
    skills, gaps = analyze_gaps(
        destination_id="ai-ml-engineer",
        current_skills=[],
    )
    assert len(skills) > 0
    assert len(gaps) == len(skills)

def test_all_skills_mastered():
    skills, gaps = analyze_gaps(
        destination_id="ai-ml-engineer",
        current_skills=["python", "git", "data-structures", "linear-algebra", "statistics", "sql", "data-analysis", "machine-learning", "deep-learning", "mlops", "cloud-basics", "nlp", "computer-vision"],
        skill_levels={"machine-learning": "Advanced"}
    )
    assert len(gaps) == 0
