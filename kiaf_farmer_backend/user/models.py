import uuid
from django.utils.translation import gettext_lazy as _
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from rest_framework_simplejwt.tokens import RefreshToken


class LowercaseEmailField(models.EmailField):
    """
    Override EmailField to convert emails to lowercase before saving.
    """
    def to_python(self, value):
        """
        Convert email to lowercase.
        """
        value = super(LowercaseEmailField, self).to_python(value)
        # Value can be None so check that it's a string before lower casing.
        if isinstance(value, str):
            return value.lower()
        return value


class UserManager(BaseUserManager):
    """Manage user profiles"""

    def create_user(self, email, name, password=None):
        """Create and save a new user"""
        if not email:
            raise ValueError('User must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, name=name)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, name, password):
        """Create and save a new superuser"""
        user = self.create_user(email, name, password)

        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user


AUTH_PROVIDERS = {'facebook': 'facebook', 'google': 'google',
                  'twitter': 'twitter', 'email': 'email'}

USER_TYPE = [
    ('admin', 'admin'),
    ('agent', 'agent')
]


class User(AbstractBaseUser, PermissionsMixin):
    """Custom user model"""

    class CustomUserType(models.TextChoices):
        AGENT_ADMIN = 'agent_admin', _('agent_admin')
        AGENT = 'agent', _('agent')

    # Fields able to change
    email = LowercaseEmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    profile_image = models.FileField(upload_to='file_storage', null=True, blank=True)
    # Auto generated or set via admin/system
    unique_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    auth_provider = models.CharField(max_length=255, blank=False, null=False, default=AUTH_PROVIDERS.get('email'))
    user_type = models.CharField(max_length=20, choices=CustomUserType.choices, default=CustomUserType.AGENT)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.email + ' | ' + self.user_type

    def tokens(self):
        refresh = RefreshToken.for_user(self)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }
