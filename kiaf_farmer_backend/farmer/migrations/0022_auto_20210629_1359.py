# Generated by Django 3.1.5 on 2021-06-29 08:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('farmer', '0021_auto_20210629_1345'),
    ]

    operations = [
        migrations.AlterField(
            model_name='farmer',
            name='otp_session_id',
            field=models.CharField(default='not generated', max_length=100),
        ),
    ]
