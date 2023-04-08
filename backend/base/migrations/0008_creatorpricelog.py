# Generated by Django 4.1.4 on 2023-03-05 23:16

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0007_alter_buyordershare_price_alter_creator_price_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='creatorPriceLog',
            fields=[
                ('_id', models.AutoField(editable=False, primary_key=True, serialize=False)),
                ('cur_price', models.DecimalField(blank=True, decimal_places=3, max_digits=7, null=True)),
                ('date_time', models.DateTimeField(auto_now_add=True)),
                ('creator', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='base.creator')),
            ],
        ),
    ]