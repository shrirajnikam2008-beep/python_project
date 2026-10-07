"""
Unit tests for the Route Builder and React Flow Graph Engine (Person 2).
"""
from backend.services.route_builder import build_routes, build_route_graph

def test_routes_hierarchy_and_prerequisites():
    routes = build_routes(
        destination_id="ai-ml-engineer",
        current_skills=["python", "cpp", "html-css", "git"],
    )

    assert len(routes) == 3
    fast = next(r for r in routes if r.id == "fast-track")
    balanced = next(r for r in routes if r.id == "balanced")
    foundation = next(r for r in routes if r.id == "foundation-first")

    # Fast Track weeks <= Balanced <= Foundation First
    assert fast.total_weeks <= balanced.total_weeks <= foundation.total_weeks

    # Balanced is recommended
    assert balanced.is_recommended is True
    assert fast.is_recommended is False

    # Check skill sets inclusion
    fast_sids = {s.skill_id for s in fast.steps}
    balanced_sids = {s.skill_id for s in balanced.steps}
    foundation_sids = {s.skill_id for s in foundation.steps}

    assert fast_sids.issubset(balanced_sids)
    assert balanced_sids.issubset(foundation_sids)

    # In every route, each skill starts after its prerequisites have finished
    for r in routes:
        step_map = {s.skill_id: (s.week_start, s.week_end) for s in r.steps}
        # In Fast Track, machine-learning must end after data-structures
        if "data-structures" in step_map and "machine-learning" in step_map:
            assert step_map["machine-learning"][0] > step_map["data-structures"][1]

def test_graph_structure():
    graph = build_route_graph(
        route_id="balanced",
        destination_id="ai-ml-engineer",
        current_skills=["python", "git"],
    )

    node_ids = {n.id for n in graph.nodes}
    assert "start" in node_ids
    assert "goal" in node_ids

    # All edge endpoints exist
    for e in graph.edges:
        assert e.source in node_ids
        assert e.target in node_ids
