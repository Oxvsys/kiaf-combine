from rest_framework import serializers
from user import models
from user.utils import Util


class AgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = ['id', 'email', 'name', 'profile_image', 'unique_id', 'is_verified', 'is_active',
                  'is_staff', 'created_at', 'updated_at', 'auth_provider']
        read_only_fields = ('unique_id', 'created_at', 'updated_at', 'auth_provider')

    def to_representation(self, data):
        data = super(AgentSerializer, self).to_representation(data)
        data['profile_image'] = Util.get_profile_image(data['profile_image'], data['name'])
        return data
