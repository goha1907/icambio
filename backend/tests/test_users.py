"""
Tests for the users app.
"""
import pytest
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status

User = get_user_model()


@pytest.mark.django_db
class TestUserModel:
    """Test the User model."""

    def test_create_user_with_email(self, user_data):
        """Test creating a user with email."""
        user = User.objects.create_user(**user_data)
        
        assert user.email == user_data['email']
        assert user.supabase_user_id == user_data['supabase_user_id']
        assert user.username == user_data['username']
        assert user.is_active is True
        assert user.is_staff is False
        assert user.is_superuser is False

    def test_user_str_representation(self, user):
        """Test the string representation of user."""
        assert str(user) == user.email

    def test_user_get_full_name(self, user):
        """Test getting user's full name."""
        expected_name = f"{user.first_name} {user.last_name}".strip()
        assert user.get_full_name() == expected_name


@pytest.mark.django_db
class TestUserViews:
    """Test the User API views."""

    def test_get_user_profile_authenticated(
        self, authenticated_api_client, user
    ):
        """Test getting user profile when authenticated."""
        url = reverse('users:profile')
        response = authenticated_api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['email'] == user.email

    def test_get_user_profile_unauthenticated(self, api_client):
        """Test getting user profile when not authenticated."""
        url = reverse('users:profile')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_update_user_profile(self, authenticated_api_client, user):
        """Test updating user profile."""
        url = reverse('users:profile')
        data = {
            'username': 'updated_username',
            'first_name': 'Updated',
            'last_name': 'Name'
        }
        response = authenticated_api_client.patch(url, data)
        
        assert response.status_code == status.HTTP_200_OK
        
        # Refresh user from database
        user.refresh_from_db()
        assert user.username == 'updated_username'
        assert user.first_name == 'Updated'
        assert user.last_name == 'Name'


@pytest.mark.django_db
class TestSupabaseAuthentication:
    """Test Supabase JWT authentication."""

    def test_authentication_with_valid_jwt(
        self, api_client, mock_supabase_jwt
    ):
        """Test authentication with valid JWT token."""
        # This would test the actual JWT authentication flow
        # For now, it's a placeholder showing the testing approach
        # The actual test would require mocking the JWT validation
        # and testing the authentication flow
        pass

    def test_authentication_with_invalid_jwt(self, api_client):
        """Test authentication with invalid JWT token."""
        url = reverse('users:profile')
        headers = {'HTTP_AUTHORIZATION': 'Bearer invalid-jwt-token'}
        response = api_client.get(url, **headers)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED 