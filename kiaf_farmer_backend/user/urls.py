from django.urls import path, include
from rest_framework.routers import DefaultRouter

from user import views, agent_views

router = DefaultRouter()
router.register('agent_details', agent_views.AgentViewSet, basename='agent_details')

urlpatterns = [
    path('profile/', views.UserProfileUpdate().as_view(), name='profile'),
    path('register/', views.UserRegisterView().as_view(), name='register'),
    path('verify_email/', views.VerifyEmailView().as_view(), name='verify_email'),
    path('resend_email_verification_link/', views.ResendEmailVerificationLink.as_view(), name='resend_email_verification_link'),
    path('change_password/', views.ChangePasswordAPIView.as_view(), name='change_password'),
    path('request_reset_email/', views.RequestPasswordResetEmailView.as_view(), name='request_reset_email'),
    path('password_reset/<uidb64>/<token>/', views.PasswordTokenCheckView.as_view(), name='password_reset_confirm'),
    path('password_reset_complete/', views.SetNewPasswordView.as_view(), name='password_reset_complete'),
    path('', include(router.urls), name='agent')
]
