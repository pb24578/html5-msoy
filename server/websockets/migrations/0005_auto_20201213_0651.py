# Generated by Django 3.1.3 on 2020-12-13 06:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('websockets', '0004_auto_20201213_0639'),
    ]

    operations = [
        migrations.AlterField(
            model_name='participant',
            name='x',
            field=models.FloatField(default=0),
        ),
        migrations.AlterField(
            model_name='participant',
            name='y',
            field=models.FloatField(default=0),
        ),
    ]