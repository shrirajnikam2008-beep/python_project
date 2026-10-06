"""
Route Builder: generates 2-4 alternative learning routes using prerequisite graphs and scoring.
"""
"""Route builder: turns the skill gaps into 3 week-by-week study plans."""
from backend.schemas.route import Route, RouteStep
from backend.services.skill_gap import analyze_gaps, PRIORITY_ORDER, LEVELS

# Change slots / pace here to tune the routes (study slots = skills studied at once)
ROUTE_TYPES = [
    {"id": "fast-track", "name": "Fast Track", "workload": "High", "slots": 3, "pace": 0.7,
     "tagline": "Shortest path to your goal",
     "description": "Only the most important skills, studied quickly."},
    {"id": "balanced", "name": "Balanced", "workload": "Medium", "slots": 2, "pace": 1.0,
     "tagline": "Best mix of speed and depth",
     "description": "Important skills plus supporting ones at a steady pace."},
    {"id": "foundation-first", "name": "Foundation First", "workload": "Low", "slots": 2, "pace": 1.3,
     "tagline": "Slow and thorough",
     "description": "Every missing skill, with extra time to learn each one well."},
]


def pick_skills(route_id, gap_skills):
    """Step 1: which gap skills go into this route."""
    chosen = set()
    for sid, skill in gap_skills.items():
        important = skill.priority in ("critical", "high")
        if route_id == "fast-track" and important:
            chosen.add(sid)
        elif route_id == "balanced" and (important or skill.importance == "supporting"):
            chosen.add(sid)
        elif route_id == "foundation-first":
            chosen.add(sid)
    return chosen


def add_missing_prerequisites(chosen, gap_skills):
    """Step 2: a route must never skip a prerequisite."""
    changed = True
    while changed:
        changed = False
        for sid in list(chosen):
            for p in gap_skills[sid].prerequisites:
                if p in gap_skills and p not in chosen:
                    chosen.add(p)
                    changed = True
    return chosen


def schedule(chosen, gap_skills, slots, pace):
    """Steps 3 and 4: week by week, start every skill whose prerequisites are finished."""
    weeks = {}
    for sid in chosen:
        weeks[sid] = max(1, round(gap_skills[sid].estimated_weeks * pace))

    def importance_order(sid):  # most important first
        s = gap_skills[sid]
        gap = LEVELS[s.required_level] - LEVELS[s.current_level]
        return (PRIORITY_ORDER[s.priority], -gap, s.name.lower())

    start, end = {}, {}
    week = 1
    while len(start) < len(chosen):
        running = [s for s in start if end[s] >= week]
        free_slots = slots - len(running)

        ready = []
        for sid in chosen:
            if sid in start:
                continue
            # every prerequisite that is in this route must have finished before this week
            if all(p not in chosen or (p in end and end[p] < week)
                   for p in gap_skills[sid].prerequisites):
                ready.append(sid)
        ready.sort(key=importance_order)

        for sid in ready[:free_slots]:
            start[sid] = week
            end[sid] = week + weeks[sid] - 1

        week += 1
        if week > 1000:
            raise ValueError("Prerequisite cycle in the data")

    steps = [RouteStep(skill_id=sid, week_start=start[sid], week_end=end[sid]) for sid in chosen]
    steps.sort(key=lambda st: (st.week_start, st.skill_id))
    return steps


def build_routes(destination_id, current_skills, skill_levels=None, data=None):
    skills, gaps = analyze_gaps(destination_id, current_skills, skill_levels, data)
    gap_skills = {g.skill_id: g.skill for g in gaps}

    routes = []
    for config in ROUTE_TYPES:
        chosen = pick_skills(config["id"], gap_skills)
        chosen = add_missing_prerequisites(chosen, gap_skills)
        steps = schedule(chosen, gap_skills, config["slots"], config["pace"])
        routes.append(Route(
            id=config["id"],
            name=config["name"],
            tagline=config["tagline"],
            description=config["description"],
            workload=config["workload"],
            total_weeks=max([st.week_end for st in steps], default=0),  # Step 5
            skill_count=len(steps),
            steps=steps,
            is_recommended=(config["id"] == "balanced"),
        ))
    return routes