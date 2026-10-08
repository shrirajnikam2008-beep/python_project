"""
Pure Python SQLite database adapter for student profiles.
Bypasses native C-extension DLL policy restrictions on Python 3.14 Windows while maintaining identical SQLite storage and API contracts.
"""
import sqlite3
import json
import os
from datetime import datetime
from backend.core.config import settings

DB_FILE = "waypoint.db"

def get_connection():
    conn = sqlite3.connect(DB_FILE, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    with conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS profiles (
                user_id TEXT PRIMARY KEY,
                name TEXT NOT NULL DEFAULT 'Student',
                program TEXT,
                branch TEXT,
                semester INTEGER DEFAULT 1,
                cgpa REAL DEFAULT 0.0,
                credits_completed INTEGER DEFAULT 0,
                current_skills TEXT NOT NULL DEFAULT '[]',
                selected_destination_id TEXT NOT NULL DEFAULT 'ai-ml-engineer',
                updated_at TEXT
            )
        """)
    conn.close()

# Initialize tables immediately
init_db()

class ProfileRepository:
    @staticmethod
    def get_by_user_id(user_id: str):
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM profiles WHERE user_id = ?", (user_id,))
        row = cur.fetchone()
        conn.close()
        if not row:
            return None
        data = dict(row)
        data["current_skills"] = json.loads(data.get("current_skills") or "[]")
        return data

    @staticmethod
    def upsert(user_id: str, profile_data: dict):
        conn = get_connection()
        now = datetime.utcnow().isoformat()
        current_skills_json = json.dumps(profile_data.get("current_skills", []))
        with conn:
            conn.execute("""
                INSERT INTO profiles (
                    user_id, name, program, branch, semester, cgpa,
                    credits_completed, current_skills, selected_destination_id, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(user_id) DO UPDATE SET
                    name=excluded.name,
                    program=excluded.program,
                    branch=excluded.branch,
                    semester=excluded.semester,
                    cgpa=excluded.cgpa,
                    credits_completed=excluded.credits_completed,
                    current_skills=excluded.current_skills,
                    selected_destination_id=excluded.selected_destination_id,
                    updated_at=excluded.updated_at
            """, (
                user_id,
                profile_data.get("name", "Student"),
                profile_data.get("program"),
                profile_data.get("branch"),
                profile_data.get("semester", 1),
                profile_data.get("cgpa", 0.0),
                profile_data.get("credits_completed", 0),
                current_skills_json,
                profile_data.get("selected_destination_id", "ai-ml-engineer"),
                now
            ))
        conn.close()
        return ProfileRepository.get_by_user_id(user_id)

# Compatibility stub for main.py Base and engine
class DummyMeta:
    def create_all(self, bind=None):
        init_db()

class DummyBase:
    metadata = DummyMeta()

Base = DummyBase()
engine = None

def get_db():
    yield None
