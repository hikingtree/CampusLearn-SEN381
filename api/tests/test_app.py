import pytest
from app import app  # adjust if your Flask entry file is named differently

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_create_topic(client):
    response = client.post('/topics', json={"name": "Python Basics"})
    assert response.status_code == 200
    assert "Python Basics" in response.get_json()["name"]
