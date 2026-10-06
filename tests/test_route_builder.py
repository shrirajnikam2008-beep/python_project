from backend.services.skill_gap import analyze_gaps
from backend.services.route_builder import build_routes, add_missing_prerequisites
from backend.services.graph_builder import build_graph
from tests.fake_data import FakeData, ALEX, SKILLS, EVERYTHING, EVERYTHING_LEVELS

data = FakeData()
DEST = "ai-ml-engineer"


def routes_for(skills, levels=None):
    return {r.id: r for r in build_routes(DEST, skills, levels, data=data)}


def test_worked_example_fast_track():
    fast = routes_for(ALEX)["fast-track"]
    assert fast.skill_count == 7
    assert fast.total_weeks == 16
    steps = {s.skill_id: (s.week_start, s.week_end) for s in fast.steps}
    assert steps["data-structures"] == (1, 2)
    assert steps["linear-algebra"] == (1, 3)
    assert steps["sql"] == (3, 3)
    assert steps["statistics"] == (4, 6)
    assert steps["data-analysis"] == (7, 8)
    assert steps["machine-learning"] == (9, 12)
    assert steps["deep-learning"] == (13, 16)


def test_worked_example_counts():
    r = routes_for(ALEX)
    assert (r["balanced"].skill_count, r["balanced"].total_weeks) == (9, 22)
    assert (r["foundation-first"].skill_count, r["foundation-first"].total_weeks) == (11, 32)
    assert r["balanced"].is_recommended and not r["fast-track"].is_recommended


def test_skill_starts_after_its_prerequisites_end():
    for route in routes_for(ALEX).values():
        weeks = {s.skill_id: s for s in route.steps}
        for sid, step in weeks.items():
            for p in SKILLS[sid][1]:
                if p in weeks:
                    assert step.week_start > weeks[p].week_end


def test_fast_is_shorter_than_balanced_than_foundation():
    r = routes_for(ALEX)
    assert r["fast-track"].total_weeks < r["balanced"].total_weeks < r["foundation-first"].total_weeks


def test_routes_are_subsets_of_each_other():
    r = routes_for(ALEX)
    ids = {k: {s.skill_id for s in v.steps} for k, v in r.items()}
    assert ids["fast-track"] <= ids["balanced"] <= ids["foundation-first"]


def test_missing_prerequisite_is_pulled_in():
    _, gaps = analyze_gaps(DEST, ALEX, data=data)
    gap_skills = {g.skill_id: g.skill for g in gaps}
    chosen = add_missing_prerequisites({"deep-learning"}, gap_skills)
    assert {"machine-learning", "statistics", "linear-algebra"} <= chosen


def test_beginner_with_no_skills_gives_valid_routes():
    for route in routes_for([]).values():
        assert route.total_weeks > 0 and route.skill_count == len(route.steps)


def test_student_with_no_gaps_gives_empty_routes():
    for route in routes_for(EVERYTHING, EVERYTHING_LEVELS).values():
        assert route.steps == [] and route.total_weeks == 0


def test_same_input_gives_same_output():
    a = [r.model_dump() for r in build_routes(DEST, ALEX, data=data)]
    b = [r.model_dump() for r in build_routes(DEST, ALEX, data=data)]
    assert a == b


def has_cycle(graph):
    incoming = {n.id: 0 for n in graph.nodes}
    for e in graph.edges:
        incoming[e.target] += 1
    queue = [n for n in incoming if incoming[n] == 0]
    seen = 0
    while queue:
        node = queue.pop()
        seen += 1
        for e in graph.edges:
            if e.source == node:
                incoming[e.target] -= 1
                if incoming[e.target] == 0:
                    queue.append(e.target)
    return seen != len(graph.nodes)


def test_graph_is_valid_for_every_route_and_student():
    for skills, levels in ((ALEX, None), ([], None), (EVERYTHING, EVERYTHING_LEVELS)):
        for route_id in ("fast-track", "balanced", "foundation-first"):
            graph = build_graph(route_id, DEST, skills, levels, data=data)
            ids = {n.id for n in graph.nodes}
            assert all(e.source in ids and e.target in ids for e in graph.edges)
            assert sum(1 for n in graph.nodes if n.data.is_start) == 1
            assert sum(1 for n in graph.nodes if n.data.is_goal) == 1
            assert not has_cycle(graph)


def test_graph_has_completed_prerequisites_and_positions():
    graph = build_graph("fast-track", DEST, ALEX, data=data)
    nodes = {n.id: n for n in graph.nodes}
    assert nodes["python"].data.status == "completed"
    assert (nodes["start"].position.x, nodes["start"].position.y) == (340, 20)