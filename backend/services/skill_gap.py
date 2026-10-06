"""Skill gap engine: compares what the student has with what the destination needs.
No AI, no randomness - the same input always gives the same output."""
from backend.schemas.skill import Skill, SkillGap

LEVELS = {"None": 0, "Beginner": 1, "Intermediate": 2, "Advanced": 3}
LEVEL_NAMES = ["None", "Beginner", "Intermediate", "Advanced"]
PRIORITY_ORDER = {"critical": 0, "high": 1, "recommended": 2}


def analyze_gaps(destination_id, current_skills, skill_levels=None, data=None):
    """Returns (skills, gaps).
    skills = every skill the destination needs, filled in for this student
    gaps   = only the skills the student is missing, most important first"""
    if data is None:
        from backend.services import data_loader as data  # Person 3's file

    if data.get_destination(destination_id) is None:
        raise ValueError(f"Unknown destination: {destination_id}")

    skill_levels = skill_levels or {}
    requirements = data.get_requirements(destination_id)

    # Steps 1 and 2: current level and gap number for every required skill
    current = {}
    gap_size = {}
    for req in requirements:
        sid = req["skillId"]
        if sid in skill_levels:                 # exact level given
            current[sid] = LEVELS[skill_levels[sid]]
        elif sid in current_skills:             # listed skill = Intermediate
            current[sid] = 2
        else:                                   # not listed = None
            current[sid] = 0
        gap_size[sid] = LEVELS[req["requiredLevel"]] - current[sid]

    gap_ids = [sid for sid in gap_size if gap_size[sid] > 0]

    # Step 4: blocksCount = how many other missing skills need this one first
    blocks = {}
    for sid in gap_ids:
        blocks[sid] = sum(1 for other in gap_ids if sid in data.get_prerequisites(other))

    skills = []
    gaps = []
    for req in requirements:
        sid = req["skillId"]
        info = data.get_skill(sid)
        prereqs = data.get_prerequisites(sid)

        # Step 5: priority
        if sid not in gap_ids:
            priority = "none"
        elif blocks[sid] >= 2:
            priority = "critical"
        elif req["importance"] == "core":
            priority = "high"
        else:
            priority = "recommended"

        # Step 3: full or partial
        kind = "full" if current[sid] == 0 else "partial"

        # Step 6: status for the map
        if sid not in gap_ids:
            status = "completed"
        elif kind == "partial":
            status = "in-progress"
        elif any(p in gap_ids for p in prereqs):
            status = "locked"
        else:
            status = "next"

        skill = Skill(
            id=sid,
            name=info["name"],
            category=info["category"],
            description=info["description"],
            current_level=LEVEL_NAMES[current[sid]],
            required_level=req["requiredLevel"],
            status=status,
            priority=priority,
            importance=req["importance"],
            prerequisites=prereqs,
            dependents=data.get_dependents(sid),
            estimated_weeks=info["estimatedWeeks"],
            why_it_matters=info["whyItMatters"],
        )
        skills.append(skill)

        if sid in gap_ids:
            # Step 8: fixed sentence template with real numbers (no LLM)
            text = (f"Required {req['requiredLevel']}, currently at {LEVEL_NAMES[current[sid]]} "
                    f"(gap {gap_size[sid]}). Blocks {blocks[sid]} downstream skills you need.")
            gaps.append(SkillGap(skill_id=sid, skill=skill, priority=priority, gap=kind,
                                 gap_size=gap_size[sid], blocks_count=blocks[sid],
                                 gap_explanation=text))

    # Step 7: sort - priority, then bigger gap first, then name
    gaps.sort(key=lambda g: (PRIORITY_ORDER[g.priority],
                             -gap_size[g.skill_id],
                             g.skill.name.lower()))
    return skills, gaps