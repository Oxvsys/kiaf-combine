from django.urls import path, include
from rest_framework.routers import DefaultRouter

from farmer import views

router = DefaultRouter()

router.register('farmer_info', views.FarmerViewSet, basename='farmer_info')
router.register('crop', views.CropViewSet, basename='crop')
router.register('live_stock', views.LiveStockViewSet, basename='live_stock')


urlpatterns = [
    path('', include(router.urls), name='farmer'),
    path('mobile_no_exist/', views.FarmerMobileAPIView.as_view(), name='mobile_no_exist'),
    path('survey_no_exist/', views.FarmerSurveyNumberAPIView.as_view(), name='survey_no_exist'),
    path('farmer_analytics/', views.FarmerAnalyticsAPIView.as_view(), name='farmer_analytics'),
    path('otp/', views.OTPOperation.as_view(), name='check_user_status'),
]
