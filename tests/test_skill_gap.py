import pytest

from backend.services.skill_gap import analyze_gaps
from tests.fake_data import FakeData, ALEX, EVERYTHING, EVERYTHING_LEVELS

data = FakeData()
DEST = "ai-ml-engineer"


def test_worked_example_priorities_and_status():
    skills, gaps = analyze_gaps(DEST, ALEX, data=data)
    expected = {  # skill: (priority, full/partial, status)
        "machine-learning": ("critical", "full", "locked"),
        "data-structures": ("critical", "full", "next"),
        "deep-learning": ("critical", "full", "locked"),
        "linear-algebra": ("critical", "full", "next"),
        "statistics": ("critical", "full", "locked"),
        "data-analysis": ("high", "full", "locked"),
        "sql": ("high", "full", "locked"),
        "mlops": ("recommended", "full", "locked"),
        "cloud-basics": ("recommended", "full", "next"),
        "nlp": ("recommended", "full", "locked"),
        "computer-vision": ("recommended", "full", "locked"),
    }
    assert len(gaps) == len(expected)
    for g in gaps:
        assert (g.priority, g.gap, g.skill.status) == expected[g.skill_id]


def test_worked_example_sort_order():
    _, gaps = analyze_gaps(DEST, ALEX, data=data)
    order = [g.skill_id for g in gaps]
    assert order[0] == "machine-learning"
    assert order[:5] == ["machine-learning", "data-structures", "deep-learning",
                         "linear-algebra", "statistics"]


def test_blocks_count_in_explanation():
    _, gaps = analyze_gaps(DEST, ALEX, data=data)
    text = {g.skill_id: g.gap_explanation for g in gaps}
    assert "Blocks 3" in text["linear-algebra"]
    assert "gap 3" in text["machine-learning"]


def test_worked_example_gap_and_blocks_columns():
    _, gaps = analyze_gaps(DEST, ALEX, data=data)
    got = {g.skill_id: (g.gap_size, g.blocks_count) for g in gaps}
    assert got == {
        "machine-learning": (3, 2), "data-structures": (2, 2), "deep-learning": (2, 2),
        "linear-algebra": (2, 3), "statistics": (2, 2), "data-analysis": (2, 1),
        "sql": (2, 1), "mlops": (1, 0), "cloud-basics": (1, 0),
        "nlp": (1, 0), "computer-vision": (1, 0),
    }


def test_skill_at_required_level_is_not_a_gap():
    _, gaps = analyze_gaps(DEST, ALEX, data=data)
    ids = [g.skill_id for g in gaps]
    assert "python" not in ids and "git" not in ids


def test_beginner_on_intermediate_skill_is_partial():
    _, gaps = analyze_gaps(DEST, ALEX, {"statistics": "Beginner"}, data=data)
    stat = [g for g in gaps if g.skill_id == "statistics"][0]
    assert stat.gap == "partial"
    assert stat.skill.status == "in-progress"


def test_student_with_no_skills():
    skills, gaps = analyze_gaps(DEST, [], data=data)
    assert len(gaps) == 13          # every required skill is a gap, no crash


def test_student_with_everything_has_no_gaps():
    skills, gaps = analyze_gaps(DEST, EVERYTHING, EVERYTHING_LEVELS, data=data)
    assert gaps == []


def test_unknown_destination():
    with pytest.raises(ValueError):
        analyze_gaps("not-a-career", ALEX, data=data)


def test_same_input_gives_same_output():
    a = analyze_gaps(DEST, ALEX, data=data)[1]
    b = analyze_gaps(DEST, ALEX, data=data)[1]
    assert [g.model_dump() for g in a] == [g.model_dump() for g in b]