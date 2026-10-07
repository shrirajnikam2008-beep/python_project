"""
Integration tests for Student Profile persistence API (Person 3).
"""
import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_profile_post_and_get():
    user_a = "user_test_alpha"
    payload = {
        "name": "Alex",
        "program": "B.Tech Computer Science",
        "branch": "Computer Science",
        "semester": 5,
        "cgpa": 8.5,
        "creditsCompleted": 60,
        "currentSkills": ["python", "git"],
        "selectedDestinationId": "ai-ml-engineer",
    }

    # 1. Post profile
    res_post = client.post(
        "/api/student/profile",
        json=payload,
        headers={"X-User-Id": user_a},
    )
    assert res_post.status_code == 200
    data = res_post.json()
    assert data["name"] == "Alex"
    assert data["selectedDestinationId"] == "ai-ml-engineer"

    # 2. Get profile
    res_get = client.get(
        "/api/student/profile",
        headers={"X-User-Id": user_a},
    )
    assert res_get.status_code == 200
    assert res_get.json()["name"] == "Alex"

    # 3. Post again to update
    payload["semester"] = 6
    res_update = client.post(
        "/api/student/profile",
        json=payload,
        headers={"X-User-Id": user_a},
    )
    assert res_update.status_code == 200
    assert res_update.json()["semester"] == 6

    # 4. Second user id does not see user A's profile
    user_b = "user_test_beta"
    res_b = client.get(
        "/api/student/profile",
        headers={"X-User-Id": user_b},
    )
    assert res_b.status_code == 404

def test_destinations_api():
    res = client.get("/api/destinations")
    assert res.status_code == 200
    dests = res.json()
    assert len(dests) >= 8
    ids = [d["id"] for d in dests]
    assert "ai-ml-engineer" in ids
    assert "cybersecurity-engineer" in ids
