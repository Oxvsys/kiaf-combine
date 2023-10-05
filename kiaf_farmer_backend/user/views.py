import jwt
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import generics
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from app.settings import BASE_DIR
from .models import User
from .serializers import ChangePasswordSerializer, MyTokenObtainPainSerializer, UserSerializer, \
    EmailVerificationSerializer, RequestPasswordResetEmailSerializer, SetNewPasswordSerializer, UserProfileSerializer
from .utils import Util


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPainSerializer


class UserRegisterView(generics.GenericAPIView):
    serializer_class = UserSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user_data = serializer.data

        result = Util.send_email_verification_link(email=user_data['email'])
        message = ''
        if result:
            message = 'We have sent you an email'
        else:
            message = 'Unable to send an email'
        return Response({'message': message, 'user_data': user_data, 'email_sent': result},
                        status=status.HTTP_201_CREATED)


class ResendEmailVerificationLink(APIView):

    def post(self, request, format=None):
        email = request.data['email']
        sent = False
        user_queryset = User.objects.filter(email=email)
        if len(user_queryset) != 1:
            return Response({"email_sent": sent, "message": "Email does not exists"})

        user = user_queryset[0]

        if user.is_verified:
            return Response({"email_sent": sent, "message": "Email already verified"})

        sent = Util.send_email_verification_link(email=user_queryset[0].email)
        message = ""
        if not sent:
            message = "SMTP Error"
        else:
            message = "We have sent you verification link on " + user.email
        return Response({"email_sent": sent, "message": message})


class VerifyEmailView(APIView):
    serializer_class = EmailVerificationSerializer

    token_param_config = openapi.Parameter('token', in_=openapi.IN_QUERY, description='Description',
                                           type=openapi.TYPE_STRING)

    @swagger_auto_schema(manual_parameters=[token_param_config])
    def get(self, request):
        token = request.GET.get('token')
        try:
            # payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["RS256"])
            with open(BASE_DIR / "id_rsa.pub") as pubkey_file:
                payload = jwt.decode(token, key=pubkey_file.read(), algorithms='RS256')
                user = User.objects.get(id=payload['user_id'])
                if not user.is_verified:
                    user.is_verified = True
                    user.save()
                return Response({'email': 'Successfully activated'}, status=status.HTTP_200_OK)
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Activation link is expired'}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.exceptions.DecodeError:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordAPIView(generics.UpdateAPIView):
    queryset = User.objects.all()
    permission_classes = (IsAuthenticated,)
    model = User
    serializer_class = ChangePasswordSerializer

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"error": "Wrong Password"}, status=status.HTTP_400_BAD_REQUEST)
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            response = {
                'status': 'success',
                'message': 'Password updated successfully',
            }
            return Response(response, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RequestPasswordResetEmailView(generics.GenericAPIView):
    serializer_class = RequestPasswordResetEmailSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        email = request.data.get('email', '')
        if User.objects.filter(email=email, is_verified=True).exists():
            user = User.objects.get(email=email)
            sent = Util.send_forgot_password_link(user)
            message = ""
            if not sent:
                message = "SMTP Error"
            else:
                message = 'Password reset link sent to your email ' + user.email
            return Response({'email_sent': sent, 'message': message}, status=status.HTTP_200_OK)
        return Response({'error': 'User not found! Please enter valid email address'}, status=status.HTTP_404_NOT_FOUND)


class PasswordTokenCheckView(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer

    def get(self, request, uidb64, token):
        try:
            id = smart_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                return Response({'error': 'Token is not valid, please request a new one'},
                                status=status.HTTP_401_UNAUTHORIZED)
            return Response({'success': True, 'message': 'Credentials Valid', 'uidb64': uidb64, 'token': token},
                            status=status.HTTP_200_OK)

        except DjangoUnicodeDecodeError:
            return Response({'error': 'Token is not valid, please request a new one'},
                            status=status.HTTP_401_UNAUTHORIZED)


class SetNewPasswordView(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer

    def patch(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'success': True, 'message': 'Password reset successfully!'}, status=status.HTTP_200_OK)


class UserProfileUpdate(generics.UpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserProfileSerializer
    model = User

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def get_queryset(self):
        if self.request.user is None:
            queryset = User.objects.none()
        else:
            queryset = User.objects.filter(user=self.request.user.id)
        return queryset
