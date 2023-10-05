from rest_framework import serializers
from farmer import models
from user.models import User
from user.utils import Util


class CropSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Crop
        fields = ['id', 'crop_name', 'crop_name_mr']


class LiveStockSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.LiveStock
        fields = ['id', 'live_stock_name', 'live_stock_name_mr']


class FarmerCropSerializer(serializers.Serializer):
    crop_id = serializers.PrimaryKeyRelatedField(queryset=models.Crop.objects.all())
    area = serializers.DecimalField(max_digits=5, decimal_places=2)
    crop_name = serializers.ReadOnlyField(source='crop.crop_name')

    class Meta:
        fields = ['crop_id', 'area', 'crop_name']


class FarmerLiveStockSerializer(serializers.Serializer):
    live_stock_id = serializers.PrimaryKeyRelatedField(queryset=models.LiveStock.objects.all())
    count = serializers.IntegerField()
    live_stock_name = serializers.ReadOnlyField(source='live_stock.live_stock_name')

    class Meta:
        fields = ['live_stock_id', 'count', 'live_stock_name']


class AgentSerializerForFarmer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'name', 'profile_image']

    def to_representation(self, data):
        data = super(AgentSerializerForFarmer, self).to_representation(data)
        data['profile_image'] = Util.get_profile_image(data['profile_image'], data['name'])
        return data


class FarmerSerializer(serializers.ModelSerializer):
    crops = FarmerCropSerializer(many=True, source='farmer_crop')
    live_stocks = FarmerLiveStockSerializer(many=True, source='farmer_livestock')
    created_by = AgentSerializerForFarmer(many=False, read_only=True)
    created_at = serializers.DateTimeField(format="%d %b %Y", required=False, read_only=True)

    class Meta:
        model = models.Farmer
        fields = ['id', 'form_no', 'first_name', 'fathers_name', 'family_name', 'address', 'village', 'mobile_nos',
                  'survey_no', 'pin_code',
                  'landline', 'email_id', 'age', 'irrigated_farm_area', 'non_irrigated_farm_area',
                  'non_farm_land', 'co_operative_name', 'step_completed', 'created_by', 'created_at', 'crops',
                  'live_stocks',
                  'discard',
                  'mobile_nos_verified',
                  'number_of_otp_retry_allowed',
                  ]
        read_only_fields = ('created_by', 'mobile_nos_verified')

    def validate_mobile_nos(self, value):
        if models.Farmer.objects.filter(mobile_nos=value, discard=False).exists():
            raise serializers.ValidationError("Mobile number is exists")
        return value

    def create(self, validated_data):
        crops = validated_data.pop('farmer_crop')
        live_stocks = validated_data.pop('farmer_livestock')
        farmer = models.Farmer.objects.create(**validated_data)

        for farmer_crop in crops:
            models.FarmersCrop.objects.create(farmer=farmer, crop=farmer_crop['crop_id'], area=farmer_crop['area'])
        for live_stock in live_stocks:
            models.FarmersLiveStock.objects.create(farmer=farmer, live_stock=live_stock['live_stock_id'],
                                                   count=live_stock['count'])
        return farmer


class FarmerMobileSerializer(serializers.Serializer):
    field = serializers.CharField(max_length=12)


class FarmerSurveyNumberSerializer(serializers.Serializer):
    field = serializers.CharField(max_length=100)
