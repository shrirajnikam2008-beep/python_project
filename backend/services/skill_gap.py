"""
Skill Gap Analysis Engine (Person 2):
Deterministic evaluation of student skill gaps, prerequisite blockers, and priority labels.
Follows the exact 8-step specification in Review 2 Backend Guide.
"""
from backend.services.data_loader import (
    get_requirements,
    get_skill,
    get_prerequisites,
    get_dependents,
)
from backend.schemas.skill import Skill, SkillGap

LEVEL_MAP = {"None": 0, "Beginner": 1, "Intermediate": 2, "Advanced": 3}
REVERSE_LEVEL_MAP = {0: "None", 1: "Beginner", 2: "Intermediate", 3: "Advanced"}

def analyze_gaps(
    destination_id: str,
    current_skills: list[str],
    skill_levels: dict[str, str] = None,
) -> tuple[list[Skill], list[SkillGap]]:
    """
    Returns (all_destination_skills, gaps_list)
    """
    if skill_levels is None:
        skill_levels = {}

    requirements = get_requirements(destination_id)
    if not requirements:
        return [], []

    # Map of current skills for this student
    curr_skill_set = set(current_skills or [])

    # First pass: collect raw skill info and determine student levels
    req_dict = {r["skillId"]: r for r in requirements}
    dest_skill_ids = set(req_dict.keys())

    # Calculate gap values and gap types
    skills_data = {}
    gap_skills = set()

    for sid, r in req_dict.items():
        sk_info = get_skill(sid)
        if not sk_info:
            continue

        req_lvl_str = r["requiredLevel"]
        req_lvl_val = LEVEL_MAP.get(req_lvl_str, 2)

        if sid in skill_levels:
            curr_lvl_str = skill_levels[sid]
            curr_lvl_val = LEVEL_MAP.get(curr_lvl_str, 0)
        elif sid in curr_skill_set:
            curr_lvl_str = "Intermediate"
            curr_lvl_val = 2
        else:
            curr_lvl_str = "None"
            curr_lvl_val = 0

        gap_num = req_lvl_val - curr_lvl_val
        is_gap = gap_num > 0
        if is_gap:
            gap_skills.add(sid)

        gap_type = "full" if curr_lvl_val == 0 else "partial"

        skills_data[sid] = {
            "id": sid,
            "name": sk_info["name"],
            "category": sk_info["category"],
            "description": sk_info["description"],
            "whyItMatters": sk_info["whyItMatters"],
            "estimatedWeeks": sk_info["estimatedWeeks"],
            "requiredLevel": req_lvl_str,
            "currentLevel": curr_lvl_str,
            "gapNum": gap_num,
            "isGap": is_gap,
            "gapType": gap_type,
            "importance": r["importance"],
            "prerequisites": get_prerequisites(sid),
            "dependents": [d for d in get_dependents(sid) if d in dest_skill_ids],
        }

    # Second pass: calculate blocks_count, priority, and status
    output_skills = []
    output_gaps = []

    for sid, sdata in skills_data.items():
        prereqs = sdata["prerequisites"]

        # Count how many other gap skills list this skill as a direct prerequisite
        blocks_count = 0
        for other_sid in gap_skills:
            if sid in get_prerequisites(other_sid):
                blocks_count += 1

        # Priority calculation
        if blocks_count >= 2:
            priority = "critical"
        elif sdata["importance"] == "core":
            priority = "high"
        else:
            priority = "recommended"

        # Status calculation
        if not sdata["isGap"]:
            status = "completed"
        elif sdata["gapType"] == "partial":
            status = "in-progress"
        else:
            # Check if any prerequisite is still a gap
            unmet_prereqs = [p for p in prereqs if p in gap_skills]
            if not unmet_prereqs:
                status = "next"
            else:
                status = "locked"

        skill_obj = Skill(
            id=sdata["id"],
            name=sdata["name"],
            category=sdata["category"],
            description=sdata["description"],
            current_level=sdata["currentLevel"],
            required_level=sdata["requiredLevel"],
            status=status,
            priority=priority,
            prerequisites=prereqs,
            dependents=sdata["dependents"],
            estimated_weeks=sdata["estimatedWeeks"],
            why_it_matters=sdata["whyItMatters"],
        )
        output_skills.append(skill_obj)

        if sdata["isGap"]:
            if blocks_count > 0:
                explanation = f"Required {sdata['requiredLevel']}, currently at {sdata['currentLevel']} (gap {sdata['gapNum']}). Blocks {blocks_count} other skills you need."
            else:
                explanation = f"Required {sdata['requiredLevel']}, currently at {sdata['currentLevel']} (gap {sdata['gapNum']}). Core milestone for this career track."

            gap_obj = SkillGap(
                skill_id=sid,
                skill=skill_obj,
                priority=priority,
                gap=sdata["gapType"],
                gap_explanation=explanation,
            )
            output_gaps.append(gap_obj)

    # Sort gaps: Critical -> High -> Recommended; then bigger gap; then name
    priority_order = {"critical": 0, "high": 1, "recommended": 2}
    output_gaps.sort(
        key=lambda g: (
            priority_order.get(g.priority, 3),
            -(LEVEL_MAP.get(g.skill.required_level, 0) - LEVEL_MAP.get(g.skill.current_level, 0)),
            g.skill.name,
        )
    )

    return output_skills, output_gaps
