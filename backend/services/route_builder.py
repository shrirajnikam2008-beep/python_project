"""
Route Builder & Topological DAG Graph Generator (Person 2):
Constructs Fast Track, Balanced, and Foundation First schedules, and generates
React Flow canvas nodes and edges matching frontend/lib/types.ts.
"""
from backend.services.skill_gap import analyze_gaps
from backend.services.data_loader import (
    get_skill,
    get_destination,
    get_prerequisites,
)
from backend.core.config import settings
from backend.schemas.route import (
    Route,
    RouteStep,
    RouteNode,
    RouteEdge,
    RouteNodePosition,
    RouteNodeData,
    RouteGraphResponse,
)

ROUTE_CONFIGS = [
    {
        "id": "fast-track",
        "name": "Fast Track",
        "tagline": "Move fast. Cover the critical essentials.",
        "description": "High-intensity accelerated plan covering critical path skills with minimal conceptual detour.",
        "workload": "High",
        "slots": settings.fast_track_slots,
        "pace": settings.fast_track_pace,
        "isRecommended": False,
        "allowedPriorities": {"critical", "high"},
        "includeSupporting": False,
    },
    {
        "id": "balanced",
        "name": "Balanced Route",
        "tagline": "Steady progress, solid foundations.",
        "description": "A well-paced route that balances depth and speed. Covers all critical and supporting engineering skills.",
        "workload": "Medium",
        "slots": settings.balanced_slots,
        "pace": settings.balanced_pace,
        "isRecommended": True,
        "allowedPriorities": {"critical", "high"},
        "includeSupporting": True,
    },
    {
        "id": "foundation-first",
        "name": "Foundation First",
        "tagline": "Build deep roots before reaching high.",
        "description": "A thorough, conceptual route ensuring complete mastery of all foundational and advanced topics.",
        "workload": "Low",
        "slots": settings.foundation_slots,
        "pace": settings.foundation_pace,
        "isRecommended": False,
        "allowedPriorities": {"critical", "high", "recommended"},
        "includeSupporting": True,
    },
]

def build_routes(
    destination_id: str,
    current_skills: list[str],
    skill_levels: dict[str, str] = None,
) -> list[Route]:
    """
    Builds the 3 weekly study plans (Fast Track, Balanced, Foundation First).
    """
    skills, gaps = analyze_gaps(destination_id, current_skills, skill_levels)
    if not skills:
        return []

    gaps_by_id = {g.skill_id: g for g in gaps}
    skills_by_id = {s.id: s for s in skills}

    routes = []
    for cfg in ROUTE_CONFIGS:
        # Step 1: Pick skills based on route criteria
        chosen_sids = set()
        for g in gaps:
            if g.priority in cfg["allowedPriorities"]:
                chosen_sids.add(g.skill_id)
            elif cfg["includeSupporting"] and g.priority == "recommended":
                chosen_sids.add(g.skill_id)

        # Ensure all gap prerequisites of chosen skills are also included
        added = True
        while added:
            added = False
            for sid in list(chosen_sids):
                for pid in get_prerequisites(sid):
                    if pid in gaps_by_id and pid not in chosen_sids:
                        chosen_sids.add(pid)
                        added = True

        # Step 2: Schedule chosen skills week by week
        # Skill duration: max(1, round(estimatedWeeks * pace))
        durations = {}
        for sid in chosen_sids:
            sk = skills_by_id.get(sid) or get_skill(sid)
            raw_wks = sk.estimated_weeks if hasattr(sk, "estimated_weeks") else sk.get("estimatedWeeks", 3)
            durations[sid] = max(1, round(raw_wks * cfg["pace"]))

        # Weekly scheduling loop
        steps = []
        finished_weeks = {}  # sid -> weekEnd
        in_progress = {}     # sid -> (weekStart, weekEnd)
        current_week = 1
        remaining_sids = set(chosen_sids)

        while remaining_sids or in_progress:
            # Check completed skills this week
            completed_now = [sid for sid, (ws, we) in in_progress.items() if we < current_week]
            for sid in completed_now:
                finished_weeks[sid] = in_progress[sid][1]
                del in_progress[sid]

            # Available slots
            free_slots = cfg["slots"] - len(in_progress)

            # Find skills whose prerequisites are all finished
            eligible = []
            for sid in remaining_sids:
                prereqs = get_prerequisites(sid)
                # Unmet if prerequisite is in chosen_sids but not in finished_weeks
                unmet = [p for p in prereqs if p in chosen_sids and p not in finished_weeks]
                if not unmet:
                    eligible.append(sid)

            # Sort eligible by priority (Critical first) and longer duration
            prio_rank = {"critical": 0, "high": 1, "recommended": 2}
            eligible.sort(
                key=lambda s: (
                    prio_rank.get(gaps_by_id.get(s).priority if s in gaps_by_id else "recommended", 3),
                    -durations.get(s, 3),
                )
            )

            # Fill free slots
            for sid in eligible[:free_slots]:
                w_start = current_week
                w_end = current_week + durations[sid] - 1
                in_progress[sid] = (w_start, w_end)
                remaining_sids.remove(sid)
                steps.append(RouteStep(skill_id=sid, week_start=w_start, week_end=w_end))

            current_week += 1
            if current_week > 100:  # safety break against infinite loop
                break

        total_weeks = max([s.week_end for s in steps], default=12)

        routes.append(
            Route(
                id=cfg["id"],
                name=cfg["name"],
                tagline=cfg["tagline"],
                description=cfg["description"],
                workload=cfg["workload"],
                total_weeks=total_weeks,
                skill_count=len(steps),
                steps=steps,
                is_recommended=cfg["isRecommended"],
            )
        )

    return routes

def build_route_graph(
    route_id: str,
    destination_id: str,
    current_skills: list[str],
    skill_levels: dict[str, str] = None,
) -> RouteGraphResponse:
    """
    Builds topological nodes and edges for the React Flow map canvas.
    """
    routes = build_routes(destination_id, current_skills, skill_levels)
    selected_route = next((r for r in routes if r.id == route_id), None)
    if not selected_route and routes:
        selected_route = routes[0]

    skills, gaps = analyze_gaps(destination_id, current_skills, skill_levels)
    skills_map = {s.id: s for s in skills}
    dest_info = get_destination(destination_id)
    dest_title = dest_info["title"] if dest_info else "Target Career"

    # Identify nodes in graph:
    # 1. 'start'
    # 2. Completed prerequisite skills the student already possesses that are relevant
    # 3. Route gap skills
    # 4. 'goal'
    route_sids = [step.skill_id for step in selected_route.steps] if selected_route else list(skills_map.keys())

    # Include completed prerequisites
    completed_sids = set()
    for sid in route_sids:
        for pid in get_prerequisites(sid):
            if pid in (current_skills or []):
                completed_sids.add(pid)

    all_graph_sids = list(completed_sids) + route_sids

    # Compute topological layers from prerequisites
    layers = {}
    for sid in completed_sids:
        layers[sid] = 1

    def compute_layer(sid, visited):
        if sid in layers:
            return layers[sid]
        if sid in visited:
            return 1
        visited.add(sid)
        prereqs = [p for p in get_prerequisites(sid) if p in all_graph_sids]
        if not prereqs:
            l = 2
        else:
            l = max(compute_layer(p, visited) for p in prereqs) + 1
        layers[sid] = l
        return l

    for sid in route_sids:
        compute_layer(sid, set())

    # Group nodes by layer for symmetric horizontal centering
    grouped_by_layer = {}
    for sid, l in layers.items():
        grouped_by_layer.setdefault(l, []).append(sid)

    nodes: list[RouteNode] = []

    # 1. Start node
    nodes.append(
        RouteNode(
            id="start",
            type="skillNode",
            position=RouteNodePosition(x=340.0, y=20.0),
            data=RouteNodeData(
                skill_id="start",
                label="Start",
                category="Foundations",
                status="completed",
                priority="recommended",
                is_start=True,
            ),
        )
    )

    # 2. Skill nodes
    for l, sids in sorted(grouped_by_layer.items()):
        y_pos = 20.0 + l * 110.0
        n_items = len(sids)
        x_spacing = 180.0
        total_w = (n_items - 1) * x_spacing
        start_x = 340.0 - (total_w / 2.0)

        for i, sid in enumerate(sorted(sids)):
            x_pos = start_x + (i * x_spacing)
            sk = skills_map.get(sid) or get_skill(sid)

            if isinstance(sk, dict):
                label = sk["name"]
                cat = sk["category"]
                status = "completed" if sid in completed_sids else "next"
                prio = "recommended"
            else:
                label = sk.name
                cat = sk.category
                status = sk.status
                prio = sk.priority

            nodes.append(
                RouteNode(
                    id=sid,
                    type="skillNode",
                    position=RouteNodePosition(x=x_pos, y=y_pos),
                    data=RouteNodeData(
                        skill_id=sid,
                        label=label,
                        category=cat,
                        status=status,
                        priority=prio,
                    ),
                )
            )

    # 3. Goal node
    max_layer = max(layers.values(), default=2)
    goal_y = 20.0 + (max_layer + 1) * 110.0
    nodes.append(
        RouteNode(
            id="goal",
            type="skillNode",
            position=RouteNodePosition(x=340.0, y=goal_y),
            data=RouteNodeData(
                skill_id="goal",
                label=dest_title,
                category="Destination",
                status="locked",
                priority="critical",
                is_goal=True,
            ),
        )
    )

    # 4. Edges construction
    edges: list[RouteEdge] = []
    node_id_set = {n.id for n in nodes}

    # Internal edges
    has_incoming = set()
    has_outgoing = set()

    for sid in all_graph_sids:
        for pid in get_prerequisites(sid):
            if pid in node_id_set and sid in node_id_set:
                target_node = next((n for n in nodes if n.id == sid), None)
                is_anim = target_node and target_node.data.status in ("next", "in-progress")
                edges.append(
                    RouteEdge(
                        id=f"e-{pid}-{sid}",
                        source=pid,
                        target=sid,
                        type="smoothstep",
                        animated=is_anim,
                    )
                )
                has_incoming.add(sid)
                has_outgoing.add(pid)

    # Connect 'start' to nodes with no prerequisites
    for sid in all_graph_sids:
        if sid not in has_incoming:
            edges.append(
                RouteEdge(
                    id=f"e-start-{sid}",
                    source="start",
                    target=sid,
                    type="smoothstep",
                    animated=False,
                )
            )

    # Connect terminal nodes to 'goal'
    for sid in all_graph_sids:
        if sid not in has_outgoing:
            edges.append(
                RouteEdge(
                    id=f"e-{sid}-goal",
                    source=sid,
                    target="goal",
                    type="smoothstep",
                    animated=False,
                )
            )

    return RouteGraphResponse(nodes=nodes, edges=edges)
