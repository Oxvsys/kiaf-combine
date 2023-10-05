from django.db import models
from django.utils import timezone

# Create your models here.
from user.models import User


def form_number_generator():
    last_farmer = Farmer.objects.all().order_by('id').last()
    if not last_farmer:
        return 'KIAF0001'
    form_no = last_farmer.form_no
    form_int = int(form_no.split('KIAF')[-1])
    width = 4
    new_form_int = form_int + 1
    formatted = (width - len(str(new_form_int))) * "0" + str(new_form_int)
    new_from_no = 'KIAF' + str(formatted)
    return new_from_no


class Farmer(models.Model):

    first_name = models.CharField(max_length=255)
    fathers_name = models.CharField(max_length=255)
    family_name = models.CharField(max_length=255)
    address = models.TextField(null=True, blank=True)
    pin_code = models.CharField(max_length=6)
    village = models.CharField(max_length=255)
    mobile_nos = models.CharField(max_length=12)
    landline = models.CharField(max_length=12, null=True, blank=True)
    email_id = models.EmailField(null=True, blank=True)
    age = models.IntegerField()
    # In Acres
    irrigated_farm_area = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    non_irrigated_farm_area = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    non_farm_land = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    co_operative_name = models.CharField(max_length=255, null=True, blank=True)
    step_completed = models.IntegerField()
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True, editable=False)
    survey_no = models.CharField(max_length=100)
    form_no = models.CharField(max_length=20, default=form_number_generator, editable=False, unique=True)
    discard = models.BooleanField(default=False)
    mobile_nos_verified = models.BooleanField(default=False)
    otp_session_id = models.CharField(max_length=100, default='not generated')
    number_of_otp_retry_allowed = models.IntegerField(default=3)
    last_otp_generated_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.first_name + " " + self.family_name


class Crop(models.Model):
    crop_name = models.CharField(max_length=255)
    crop_name_mr = models.CharField(max_length=255)

    def __str__(self):
        return self.crop_name


class LiveStock(models.Model):
    live_stock_name = models.CharField(max_length=255)
    live_stock_name_mr = models.CharField(max_length=255)
    
    def __str__(self):
        return self.live_stock_name


class FarmersCrop(models.Model):
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE, related_name='farmer_crop')
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE, related_name='farmer_crop')
    area = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)


class FarmersLiveStock(models.Model):
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE, related_name='farmer_livestock')
    live_stock = models.ForeignKey(LiveStock, on_delete=models.CASCADE, related_name='farmer_livestock')
    count = models.IntegerField(null=True, blank=True)
