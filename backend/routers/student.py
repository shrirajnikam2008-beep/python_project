"""
Router for student profile management (Person 3).
Identifies user via X-User-Id header and persists state in SQLite.
"""
from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.orm import Session
from backend.core.database import get_db
from backend.models.profile import Profile
from backend.schemas.profile import StudentProfile

router = APIRouter(prefix="/api/student", tags=["Student"])

@router.post("/profile", response_model=StudentProfile)
def save_profile(
    profile: StudentProfile,
    x_user_id: str = Header(..., alias="X-User-Id"),
    db: Session = Depends(get_db),
):
    """
    Creates or updates the student's profile, indexed by user ID.
    """
    db_profile = db.query(Profile).filter(Profile.user_id == x_user_id).first()
    if not db_profile:
        db_profile = Profile(user_id=x_user_id)
        db.add(db_profile)

    db_profile.name = profile.name
    db_profile.program = profile.program
    db_profile.branch = profile.branch
    db_profile.semester = profile.semester
    db_profile.cgpa = profile.cgpa
    db_profile.credits_completed = profile.credits_completed
    db_profile.current_skills = profile.current_skills
    db_profile.selected_destination_id = profile.selected_destination_id

    db.commit()
    db.refresh(db_profile)

    return StudentProfile(
        name=db_profile.name,
        program=db_profile.program,
        branch=db_profile.branch,
        semester=db_profile.semester,
        cgpa=db_profile.cgpa,
        credits_completed=db_profile.credits_completed,
        current_skills=db_profile.current_skills,
        selected_destination_id=db_profile.selected_destination_id,
    )

@router.get("/profile", response_model=StudentProfile)
def get_profile(
    x_user_id: str = Header(..., alias="X-User-Id"),
    db: Session = Depends(get_db),
):
    """
    Retrieves the saved profile for the given user, or 404 if not found.
    """
    db_profile = db.query(Profile).filter(Profile.user_id == x_user_id).first()
    if not db_profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")

    return StudentProfile(
        name=db_profile.name,
        program=db_profile.program,
        branch=db_profile.branch,
        semester=db_profile.semester,
        cgpa=db_profile.cgpa,
        credits_completed=db_profile.credits_completed,
        current_skills=db_profile.current_skills,
        selected_destination_id=db_profile.selected_destination_id,
    )
