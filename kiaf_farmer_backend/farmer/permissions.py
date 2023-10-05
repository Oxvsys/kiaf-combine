from rest_framework.permissions import BasePermission

from user.models import User


class IsObjOwnerPermission(BasePermission):
    message = "You cant access this data"

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class IsAgentOwnerPermission(BasePermission):
    message = "You cant access this data"

    def has_object_permission(self, request, view, obj):
        if request.user.user_type == User.CustomUserType.AGENT_ADMIN:
            return True
        return obj.created_by == request.user

    # def has_permission(self, request, view):
    #     user = request.user
    #     if (
    #             user.user_type == User.CustomUserType.AGENT or
    #             user.user_type == User.CustomUserType.AGENT_ADMIN
    #     ) and (request.method =='POST' or request.method == 'GET'):
    #         return True
    #     if user.user_type == User.CustomUserType.AGENT_ADMIN and request.method =='PUT':
    #         return True
    #     return False