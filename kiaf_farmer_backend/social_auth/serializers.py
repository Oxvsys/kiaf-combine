from decouple import config
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed

from . import google, facebook, twitterhelper
from .register import register_social_user


class FacebookSocialAuthSerializer(serializers.Serializer):
    """ Handles serialization of facebook related data """

    auth_token = serializers.CharField()

    def validate_auth_token(self, auth_token):
        user_data = facebook.Facebook.validate(auth_token)

        try:
            user_id = user_data['id']
            email = user_data['email']
            name = user_data['name']
            picture = user_data['picture']['data']['url']
            provider = 'facebook'
            return register_social_user(
                provider=provider,
                user_id=user_id,
                email=email,
                name=name,
                picture=picture
            )
        except Exception as identifier:
            raise serializers.ValidationError(
                'The token is invalid or expired. Please Login again'
            )


class GoogleSocialAuthSerializer(serializers.Serializer):
    auth_token = serializers.CharField()

    def validate_auth_token(self, auth_token):
        user_data = google.Google.validate(auth_token)
        try:
            user_data['sub']
        except:
            raise serializers.ValidationError(
                'The token is invalid or expired. Please Login again'
            )

        if user_data['aud'] != config('GOOGLE_CLIENT_ID'):
            raise AuthenticationFailed('Invalid User')

        user_id = user_data['sub']
        email = user_data['email']
        name = user_data['name']
        picture = user_data['picture']
        provider = 'google'

        return register_social_user(
            provider=provider,
            user_id=user_id,
            email=email,
            name=name,
            picture=picture
        )


class TwitterSocialAuthSerializer(serializers.Serializer):
    access_token_key = serializers.CharField()
    access_token_secret = serializers.CharField()

    def validate(self, attrs):

        access_token_key = attrs.get('access_token_key')
        access_token_secret = attrs.get('access_token_secret')

        user_data = twitterhelper.TwitterAuthTokenVerification.validate_twitter_auth_token(
            access_token_key, access_token_secret
        )

        try:
            user_id = user_data['id']
            email = user_data['email']
            name = user_data['name']
            provider = 'twitter'
        except:
            raise serializers.ValidationError(
                'The token is invalid or expired. Please Login again'
            )

        return register_social_user(
            provider=provider,
            user_id=user_id,
            email=email,
            name=name
        )
