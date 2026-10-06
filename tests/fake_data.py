"""Small copy of the AI/ML data so the tests do not need the CSV files.
It has the same functions as services/data_loader.py (Person 3)."""

# skill: (estimated weeks, prerequisites)
SKILLS = {
    "python": (0, []),
    "git": (0, []),
    "data-structures": (3, ["python"]),
    "linear-algebra": (4, []),
    "statistics": (4, ["linear-algebra"]),
    "sql": (2, ["data-structures"]),
    "data-analysis": (3, ["python", "sql", "statistics"]),
    "machine-learning": (6, ["python", "data-structures", "statistics", "linear-algebra", "data-analysis"]),
    "deep-learning": (5, ["machine-learning", "linear-algebra"]),
    "mlops": (3, ["machine-learning", "git"]),
    "cloud-basics": (2, ["git"]),
    "nlp": (3, ["deep-learning"]),
    "computer-vision": (3, ["deep-learning"]),
}

# (skill, required level, importance)
REQUIREMENTS = [
    ("python", "Intermediate", "core"),
    ("git", "Beginner", "supporting"),
    ("data-structures", "Intermediate", "core"),
    ("linear-algebra", "Intermediate", "core"),
    ("statistics", "Intermediate", "core"),
    ("sql", "Intermediate", "core"),
    ("data-analysis", "Intermediate", "core"),
    ("machine-learning", "Advanced", "core"),
    ("deep-learning", "Intermediate", "core"),
    ("mlops", "Beginner", "supporting"),
    ("cloud-basics", "Beginner", "supporting"),
    ("nlp", "Beginner", "optional"),
    ("computer-vision", "Beginner", "optional"),
]

ALEX = ["python", "cpp", "html-css", "git"]

# a student who already has everything (machine-learning needs Advanced)
EVERYTHING = list(SKILLS)
EVERYTHING_LEVELS = {"machine-learning": "Advanced"}


class FakeData:
    def get_destination(self, destination_id):
        if destination_id == "ai-ml-engineer":
            return {"id": destination_id, "title": "AI/ML Engineer"}
        return None

    def get_requirements(self, destination_id):
        return [{"skillId": s, "requiredLevel": level, "importance": imp}
                for s, level, imp in REQUIREMENTS]

    def get_skill(self, skill_id):
        return {"id": skill_id, "name": skill_id.replace("-", " ").title(), "category": "General",
                "description": "", "whyItMatters": "", "estimatedWeeks": SKILLS[skill_id][0]}

    def get_prerequisites(self, skill_id):
        return SKILLS[skill_id][1]

    def get_dependents(self, skill_id):
        return [s for s in SKILLS if skill_id in SKILLS[s][1]]