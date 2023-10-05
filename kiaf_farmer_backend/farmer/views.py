import http.client
import json

from decouple import config
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from rest_framework import status
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from farmer import models
from farmer import serializeres
from farmer.permissions import IsAgentOwnerPermission
from farmer.paginations import FarmerPagination
from user.models import User


class CropViewSet(ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = serializeres.CropSerializer
    queryset = models.Crop.objects.all()
    http_method_names = ['get', 'post', 'put', 'patch', 'head', 'delete']


class LiveStockViewSet(ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = serializeres.LiveStockSerializer
    queryset = models.LiveStock.objects.all()
    http_method_names = ['get', 'post', 'put', 'patch', 'head', 'delete']


class FarmerViewSet(ModelViewSet):
    permission_classes = (IsAuthenticated, IsAgentOwnerPermission)
    pagination_class = FarmerPagination
    serializer_class = serializeres.FarmerSerializer
    filter_backends = [SearchFilter]
    search_fields = ['first_name', 'fathers_name', 'family_name', 'form_no']
    http_method_names = ['get', 'post', 'put', 'patch', 'head', 'delete']

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def get_queryset(self):
        # For anonymous user
        queryset = None
        if self.request.user is None:
            queryset = models.Farmer.objects.none()
        # For logged in user
        if self.request.user.user_type == User.CustomUserType.AGENT:
            queryset = models.Farmer.objects.filter(created_by=self.request.user).order_by('-created_at')
        elif self.request.user.user_type == User.CustomUserType.AGENT_ADMIN:
            queryset = models.Farmer.objects.filter().order_by('-created_at')
        return queryset


class FarmerMobileAPIView(APIView):
    serializer_class = serializeres.FarmerMobileSerializer
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None):
        serializer = serializeres.FarmerMobileSerializer(data=request.data)
        if serializer.is_valid():
            if models.Farmer.objects.filter(mobile_nos=serializer.data['field'], discard=False):
                return Response(True)
            return Response(False)
        return Response(serializer.errors)


class FarmerSurveyNumberAPIView(APIView):
    serializer_class = serializeres.FarmerSurveyNumberSerializer
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None):
        serializer = serializeres.FarmerSurveyNumberSerializer(data=request.data)
        if serializer.is_valid():
            if models.Farmer.objects.filter(survey_no=serializer.data['field'], discard=False):
                return Response(True)
            return Response(False)
        return Response(serializer.errors)


class FarmerAnalyticsAPIView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):

        if request.user.user_type == User.CustomUserType.AGENT:
            total_agent_farmers = models.Farmer.objects.filter(created_by=self.request.user).count()
            total_agent_active_farmers = models.Farmer.objects.filter(created_by=self.request.user,
                                                                      discard=False).count()
            total_agent_inactive_farmers = total_agent_farmers - total_agent_active_farmers
            return Response({
                'total_agent_farmers': total_agent_farmers,
                'total_registered_farmers': total_agent_active_farmers,
                'total_discarded_farmers': total_agent_inactive_farmers,
            }, status=status.HTTP_200_OK)

        elif request.user.user_type == User.CustomUserType.AGENT_ADMIN:
            total_farmers = models.Farmer.objects.all().count()
            total_registered_farmers = models.Farmer.objects.filter(discard=False).count()
            total_discarded_farmers = models.Farmer.objects.filter(discard=True).count()
            total_agents = User.objects.filter(user_type=User.CustomUserType.AGENT).count()
            total_active_agents = User.objects.filter(user_type=User.CustomUserType.AGENT, is_active=True).count()
            total_inactive_agents = total_agents - total_active_agents
            return Response({
                'total_farmers': total_farmers,
                'total_active_farmers': total_registered_farmers,
                'total_inactive_farmers': total_discarded_farmers,
                'total_agents': total_agents,
                'total_active_agents': total_active_agents,
                'total_inactive_agents': total_inactive_agents
            }, status=status.HTTP_200_OK)

        return Response({'error': 'Bad Request'}, status=status.HTTP_400_BAD_REQUEST)


def check_and_update_if_user_can_request_OTP(farmer):
    # TODO Make 600 configurable
    if farmer.number_of_otp_retry_allowed == 0:
        print(timezone.now())
        print(farmer.last_otp_generated_at)
        print((timezone.now() - farmer.last_otp_generated_at).total_seconds())
        if (timezone.now() - farmer.last_otp_generated_at).total_seconds() < 600:
            return False

        farmer.number_of_otp_retry_allowed = 3

    farmer.number_of_otp_retry_allowed -= 1

    farmer.last_otp_generated_at = timezone.now()
    farmer.save()
    return True


class OTPOperation(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        try:
            id = request.GET.get('id')
            farmer = models.Farmer.objects.get(id=id)
        except KeyError:
            return Response({"message": "ID not sent"}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({"message": "Farmer ID can not be blank"}, status=status.HTTP_404_NOT_FOUND)
        except ObjectDoesNotExist:
            return Response({"message": "Farmer not found"}, status=status.HTTP_404_NOT_FOUND)
        except:
            return Response({"message": "Bad Request"}, status=status.HTTP_400_BAD_REQUEST)

        if not check_and_update_if_user_can_request_OTP(farmer):
            return Response({"msg": "OTP limit reached! Try again after sometime"}, status.HTTP_400_BAD_REQUEST)

        conn = http.client.HTTPConnection("2factor.in")
        payload = ""
        headers = {'content-type': "application/x-www-form-urlencoded"}
        api_key = config('OTP_SERVICE_API_KEY_PROPERTY')
        if api_key is None:
            return Response({"msg": "OTP API Key not set"}, status.HTTP_400_BAD_REQUEST)
        conn.request("GET", "/API/V1/" + api_key + "/SMS/" + farmer.mobile_nos + "/AUTOGEN", payload,
                     headers)
        res = conn.getresponse()
        data = json.loads(res.read().decode("utf-8"))
        farmer.otp_session_id = data['Details']
        farmer.save()

        response = {'status': data['Status']}
        return Response(response, status.HTTP_200_OK)

    def post(self, request):
        id = request.data['id']
        otp_key = request.data['sms_otp']

        if "sms_otp" not in request.data:
            return Response({"msg": "OTP not present"}, status.HTTP_400_BAD_REQUEST)
        farmer = models.Farmer.objects.get(id=id)

        conn = http.client.HTTPConnection("2factor.in")

        payload = ""

        headers = {'content-type': "application/x-www-form-urlencoded"}
        api_key = config('OTP_SERVICE_API_KEY_PROPERTY')
        if api_key is None:
            return Response({"msg": "OTP API Key not set"}, status.HTTP_400_BAD_REQUEST)
        if farmer.otp_session_id is None:
            return Response({"msg": "No session Id found"}, status.HTTP_400_BAD_REQUEST)

        conn.request("GET",
                     "/API/V1/" + api_key + "/SMS/VERIFY/" + farmer.otp_session_id + "/" + otp_key,
                     payload, headers)

        res = conn.getresponse()
        data = json.loads(res.read().decode("utf-8"))
        if res.status == 200 and data['Status'].lower() == 'success':
            farmer.mobile_nos_verified = True
            farmer.save()

        response = {
            "mobile_nos_verified": farmer.mobile_nos_verified,
            "msg": data['Details'],
        }
        return Response(response, res.status)
