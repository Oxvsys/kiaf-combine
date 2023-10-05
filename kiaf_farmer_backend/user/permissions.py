from rest_framework.permissions import BasePermission


class IsObjOwnerPermission(BasePermission):
    message = "You cant access this data"

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class IsAgentAdminPermission(BasePermission):

    def has_permission(self, request, view):
        return request.user.user_type == "agent_admin"
