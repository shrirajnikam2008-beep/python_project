# Waypoint System Architecture

## Overview
Waypoint separates modern web presentation (Next.js) from analytical computation and AI intelligence (FastAPI + Python).

```
Next.js (React Flow + Tailwind) <---> FastAPI REST API <---> SQLite / Datasets
                                               |
                                               +---> Deterministic Engines (Skill Gap, Route)
                                               +---> ML Layer (Clustering, Vector Similarity)
                                               +---> Explainable AI (Gemini API)
```
