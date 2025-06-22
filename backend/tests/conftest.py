"""
Pytest configuration and common fixtures for Django backend tests.
"""
import pytest
from django.test import Client
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from unittest.mock import patch

User = get_user_model()


@pytest.fixture
def api_client():
    """Returns an API client for testing."""
    return APIClient()


@pytest.fixture
def web_client():
    """Returns a web client for testing."""
    return Client()


@pytest.fixture
def user_data():
    """Returns sample user data for testing."""
    return {
        'email': 'test@example.com',
        'supabase_user_id': 'test-supabase-id-123',
        'username': 'testuser',
        'first_name': 'Test',
        'last_name': 'User',
    }


@pytest.fixture
def user(user_data):
    """Creates and returns a test user."""
    return User.objects.create_user(**user_data)


@pytest.fixture
def authenticated_api_client(api_client, user):
    """Returns an API client with authenticated user."""
    # Mock the Supabase JWT authentication
    with patch(
        'users.authentication.SupabaseJWTAuthentication.authenticate'
    ) as mock_auth:
        mock_auth.return_value = (user, None)
        api_client.force_authenticate(user=user)
        yield api_client


@pytest.fixture
def mock_supabase_jwt():
    """Mock Supabase JWT validation."""
    with patch('users.authentication.jwt.decode') as mock_decode:
        mock_decode.return_value = {
            'sub': 'test-supabase-id-123',
            'email': 'test@example.com',
            'exp': 9999999999,  # Far future expiration
        }
        yield mock_decode 