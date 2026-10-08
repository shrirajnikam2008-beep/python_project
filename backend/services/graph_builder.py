"""Turns one route into the nodes and edges the React Flow map draws."""
from backend.schemas.route import Graph, GraphNode, GraphEdge, NodeData, NodePosition
from backend.services.skill_gap import analyze_gaps
from backend.services.route_builder import build_routes

CENTER_X = 340
X_SPACING = 180
Y_START = 20
Y_SPACING = 100


def build_graph(route_id, destination_id, current_skills, skill_levels=None, data=None):
    if data is None:
        from backend.services import data_loader as data

    skills, gaps = analyze_gaps(destination_id, current_skills, skill_levels, data)
    by_id = {s.id: s for s in skills}

    route = None
    for r in build_routes(destination_id, current_skills, skill_levels, data):
        if r.id == route_id:
            route = r
    if route is None:
        raise ValueError(f"Unknown route: {route_id}")

    # Which skills become nodes: the route skills + the prerequisites the student already has
    node_ids = [st.skill_id for st in route.steps]
    for sid in list(node_ids):
        for p in by_id[sid].prerequisites:
            if p not in node_ids:
                node_ids.append(p)

    prereqs = {sid: [p for p in data.get_prerequisites(sid) if p in node_ids] for sid in node_ids}

    # Layer = longest prerequisite chain. y depends on the layer.
    layer = {}

    def layer_of(sid):
        if sid not in layer:
            layer[sid] = 1 + max([layer_of(p) for p in prereqs[sid]], default=0)
        return layer[sid]

    for sid in node_ids:
        layer_of(sid)
    goal_layer = max(layer.values(), default=0) + 1

    # Position: spread the nodes of one layer 180px apart, centred on x = 340
    nodes = [GraphNode(id="start", position=NodePosition(x=CENTER_X, y=Y_START),
                       data=NodeData(skill_id="start", label="Start", category="",
                                     status="completed", priority="none", is_start=True))]
    for level in range(1, goal_layer):
        row = [sid for sid in node_ids if layer[sid] == level]
        for i, sid in enumerate(row):
            x = int(CENTER_X + (i - (len(row) - 1) / 2) * X_SPACING)
            s = by_id.get(sid)
            if s is not None:
                info = dict(label=s.name, category=s.category, status=s.status, priority=s.priority)
            else:  # a prerequisite that is not part of this destination
                k = data.get_skill(sid)
                info = dict(label=k["name"], category=k["category"], status="completed", priority="none")
            nodes.append(GraphNode(id=sid, position=NodePosition(x=x, y=Y_START + level * Y_SPACING),
                                   data=NodeData(skill_id=sid, **info)))
    title = data.get_destination(destination_id).get("title", destination_id)
    nodes.append(GraphNode(id="goal", position=NodePosition(x=CENTER_X, y=Y_START + goal_layer * Y_SPACING),
                           data=NodeData(skill_id="goal", label=title, category="",
                                         status="locked", priority="none", is_goal=True)))

    # Edges: prerequisite -> skill, start -> first skills, last skills -> goal
    status_of = {n.id: n.data.status for n in nodes}
    edges = []

    def add_edge(source, target):
        animated = status_of[target] in ("next", "in-progress")
        edges.append(GraphEdge(id=f"e-{source}-{target}", source=source, target=target, animated=animated))

    needed_by_someone = set()
    for sid in node_ids:
        for p in prereqs[sid]:
            add_edge(p, sid)
            needed_by_someone.add(p)
        if not prereqs[sid]:
            add_edge("start", sid)
    for sid in node_ids:
        if sid not in needed_by_someone:
            add_edge(sid, "goal")
    if not node_ids:
        add_edge("start", "goal")

    return Graph(nodes=nodes, edges=edges)