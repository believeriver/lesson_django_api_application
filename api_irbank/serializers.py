from rest_framework import serializers
from .models import Company, Financial


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = (
            'id', 'code', 'name', 'stock', 'dividend',
            'dividend_rank', 'dividend_rank_updated',
            'industry', 'description',
            'per', 'psr', 'pbr')


class FinancialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Financial
        fields = ('id', 'code', 'sales', 'operating_margin', 'eps',
                  'equity_ratio', 'operating_cash_flow',
                  'cash_and_equivalents', 'dividend_per_share',
                  'payout_ratio', 'fiscal_year')

