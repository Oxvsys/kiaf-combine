# Generated by Django 3.1.5 on 2021-06-23 13:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('farmer', '0017_auto_20210620_1501'),
    ]

    operations = [
        migrations.AlterField(
            model_name='farmer',
            name='co_operative_name',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
