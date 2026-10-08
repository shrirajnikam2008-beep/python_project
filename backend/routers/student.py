"""
Router for student profile management (Person 3).
Identifies user via X-User-Id header and persists state in SQLite.
"""
from fastapi import APIRouter, Header, HTTPException, status
from backend.core.database import ProfileRepository
from backend.schemas.profile import StudentProfile

router = APIRouter(prefix="/api/student", tags=["Student"])

@router.post("/profile", response_model=StudentProfile)
def save_profile(
    profile: StudentProfile,
    x_user_id: str = Header(..., alias="X-User-Id"),
):
    """
    Creates or updates the student's profile, indexed by user ID.
    """
    data = {
        "name": profile.name,
        "program": profile.program,
        "branch": profile.branch,
        "semester": profile.semester,
        "cgpa": profile.cgpa,
        "credits_completed": profile.credits_completed,
        "current_skills": profile.current_skills,
        "selected_destination_id": profile.selected_destination_id,
    }
    saved = ProfileRepository.upsert(x_user_id, data)
    return StudentProfile(**saved)

@router.get("/profile", response_model=StudentProfile)
def get_profile(
    x_user_id: str = Header(..., alias="X-User-Id"),
):
    """
    Retrieves the saved profile for the given user, or 404 if not found.
    """
    saved = ProfileRepository.get_by_user_id(x_user_id)
    if not saved:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")

    return StudentProfile(**saved)
