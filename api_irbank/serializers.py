from rest_framework import serializers
from .models import Company


class CompanySerializer(serializers.ModelSerializer):
    model = Company
    fields = (
        'id',
        'code',
        'name',
        'stock',
        'dividend',
        'dividend_rank',
        'dividend_rank_updated',
        'industry',
        'description',
        'per', 'psr', 'pbr')

