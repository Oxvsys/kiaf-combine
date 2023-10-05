from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from user import models
from user import permissions
from user import agent_serializers


class AgentViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, permissions.IsAgentAdminPermission)
    queryset = models.User.objects.filter(user_type="agent")
    serializer_class = agent_serializers.AgentSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'head', 'delete']
