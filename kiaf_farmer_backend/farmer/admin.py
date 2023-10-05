from django.contrib import admin
from . import models


# Register your models here.


@admin.register(models.Crop)
class CropAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "crop_name",
        "crop_name_mr",
    ]
    list_editable = ["crop_name_mr", ]


@admin.register(models.LiveStock)
class LiveStockAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "live_stock_name",
        "live_stock_name_mr"
    ]
    list_editable = ["live_stock_name_mr",]


@admin.register(models.Farmer)
class FarmerAdmin(admin.ModelAdmin):
    list_display = [
        "first_name",
        "family_name",
        "created_by",
        "village",
        "discard",
        "mobile_nos_verified",
        "mobile_nos",
        "survey_no",
        "form_no",
        "email_id",
        "created_at",
        "updated_at",
    ]


@admin.register(models.FarmersLiveStock)
class FarmersLiveStockAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'farmer',
        'live_stock',
        'count',
    ]


@admin.register(models.FarmersCrop)
class FarmersCropAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'farmer',
        'crop',
        'area',
    ]
