from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.shortcuts import get_object_or_404
from django.utils.encoding import force_str
from django.utils.translation import gettext_lazy as _
from django.utils.http import urlsafe_base64_decode
from drf_recaptcha.fields import ReCaptchaV2Field

from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import User, AUTH_PROVIDERS
from .utils import Util, NO_ACTIVE_ACCOUNT


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=100, min_length=6, write_only=True)
    recaptcha = ReCaptchaV2Field()

    class Meta:
        model = User
        fields = ['email', 'name', 'password', 'recaptcha']

    def validate(self, attrs):
        attrs.pop("recaptcha")
        return attrs

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class EmailVerificationSerializer(serializers.ModelSerializer):
    token = serializers.CharField(max_length=1000)

    class Meta:
        model = User
        fields = ['token']


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    class Meta:
        model = User


class RequestPasswordResetEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(min_length=2)

    class Meta:
        fields = ['email']


class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(min_length=6, max_length=100, write_only=True)
    token = serializers.CharField(min_length=1)
    uidb64 = serializers.CharField(min_length=1)

    class Meta:
        fields = ['password', 'token', 'uidb64']

    def validate(self, attrs):
        try:
            password = attrs.get('password')
            token = attrs.get('token')
            uidb64 = attrs.get('uidb64')

            id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=id)

            if not PasswordResetTokenGenerator().check_token(user, token):
                raise AuthenticationFailed('The reset link is invalid', 401)
            user.set_password(password)
            user.save()

            return user
        except Exception:
            raise AuthenticationFailed('The reset link is invalid', 401)
        return super().validate(attrs)


class MyTokenObtainPainSerializer(TokenObtainPairSerializer):

    default_error_messages = {
        'no_active_account': _(NO_ACTIVE_ACCOUNT)
    }

    def validate(self, attrs):
        data = super(MyTokenObtainPainSerializer, self).validate(attrs)
        email = attrs['email']
        user = get_object_or_404(User, email=email, auth_provider=AUTH_PROVIDERS.get('email'))

        if not user.is_verified:
            raise serializers.ValidationError('Please verify your email before login')
        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        return Util.get_token(token, user)


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        ordering = ['-id']
        model = User
        fields = (
            'name',
            'profile_image',
        )
