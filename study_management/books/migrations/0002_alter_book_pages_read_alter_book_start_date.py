# Generated by Django 4.2 on 2023-04-08 06:03

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('books', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='book',
            name='pages_read',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='book',
            name='start_date',
            field=models.DateField(default=django.utils.timezone.now),
        ),
    ]