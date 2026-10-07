"""
SQLAlchemy Profile model storing persistent student onboarding and profile state.
"""
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, JSON
from backend.core.database import Base

class Profile(Base):
    __tablename__ = "profiles"

    user_id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, default="Student")
    program = Column(String, nullable=True)
    branch = Column(String, nullable=True)
    semester = Column(Integer, nullable=True, default=1)
    cgpa = Column(Float, nullable=True, default=0.0)
    credits_completed = Column(Integer, nullable=True, default=0)
    current_skills = Column(JSON, nullable=False, default=list)
    selected_destination_id = Column(String, nullable=False, default="ai-ml-engineer")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
