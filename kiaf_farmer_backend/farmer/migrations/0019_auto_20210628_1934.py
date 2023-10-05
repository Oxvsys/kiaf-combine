# Generated by Django 3.1.5 on 2021-06-28 14:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('farmer', '0018_auto_20210623_1920'),
    ]

    operations = [
        migrations.AlterField(
            model_name='farmer',
            name='irrigated_farm_area',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True),
        ),
        migrations.AlterField(
            model_name='farmer',
            name='non_farm_land',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True),
        ),
        migrations.AlterField(
            model_name='farmer',
            name='non_irrigated_farm_area',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True),
        ),
        migrations.AlterField(
            model_name='farmerscrop',
            name='area',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True),
        ),
        migrations.AlterField(
            model_name='farmerslivestock',
            name='count',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
