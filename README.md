# Waypoint
### Interactive Academic & Career Navigation Platform

Waypoint is an interactive academic and career navigation platform that helps students discover destinations, calculates deterministic skill gaps and optimal learning routes, analyzes crowd trails via clustering, monitors market skill demand signals, and matches curated scholarships and internships.

---

## Repository Structure

```
waypoint/
├── .devcontainer/         # GitHub Codespaces dev container configuration
├── README.md              # Project documentation and roadmap
├── requirements.txt       # Backend dependencies
├── .env.example           # Example environment variables
├── .gitignore             # Ignored files
│
├── frontend/              # Next.js + React + TypeScript web app
│   ├── app/               # Next.js App Router (pages & layouts)
│   ├── components/        # UI and Feature components
│   │   ├── interest-quiz/ # Destination discovery quiz
│   │   ├── route-map/     # Interactive node-and-path map (React Flow)
│   │   ├── crowd-trails/  # Cluster visualization of student journeys
│   │   ├── market-weather/# Skill-demand trend signals
│   │   ├── opportunities/ # Curated scholarships and internships
│   │   ├── dashboard/     # Student dashboard views
│   │   └── ui/            # Reusable UI primitives
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions and API client
│   ├── public/            # Static assets
│   └── styles/            # CSS styles
│
├── backend/               # FastAPI Python application
│   ├── main.py            # API entrypoint
│   ├── config.py          # App settings
│   ├── database.py        # Database connection & session setup
│   ├── models/            # Pydantic schemas
│   │   ├── student.py
│   │   ├── trail.py
│   │   ├── market_signal.py
│   │   └── opportunity.py
│   ├── services/          # Core business logic
│   │   ├── interest_discovery.py
│   │   ├── skill_gap.py
│   │   ├── route_builder.py
│   │   ├── crowd_trails.py
│   │   ├── market_weather.py
│   │   ├── opportunity_matcher.py
│   │   └── rerouting.py
│   ├── ml/                # Machine Learning algorithms
│   │   ├── feature_builder.py
│   │   ├── similarity.py
│   │   └── clustering.py
│   └── ai/                # LLM explanation integration
│       └── explainer.py
│
├── data/                  # Curated datasets
│   ├── skills.csv
│   ├── prerequisites.csv
│   ├── student_trails.csv
│   ├── market_signals.csv
│   └── opportunities.csv
│
├── tests/                 # Automated test suite (pytest)
│   ├── test_skill_gap.py
│   ├── test_route_builder.py
│   ├── test_clustering.py
│   ├── test_rerouting.py
│   └── test_opportunity_matcher.py
│
└── docs/                  # Architecture and technical documentation
    ├── architecture.md
    ├── methodology.md
    └── api.md
```

---

## GitHub Codespaces Quickstart

1. Open this repository in GitHub Codespaces.
2. The environment comes pre-configured with Python 3.11, Node.js 20, and all necessary VS Code extensions.
3. Start backend:
   ```bash
   uvicorn backend.main:app --reload --port 8000
   ```
4. Start frontend:
   ```bash
   cd frontend && npm install && npm run dev
   ```
