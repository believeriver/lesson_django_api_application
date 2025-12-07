from rest_framework import serializers
from .models import Company, Financial


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = [
            'code', 'name', 'stock', 'dividend', 'dividend_rank',
            'dividend_rank_updated', 'industry', 'description',
            'per', 'psr', 'pbr', 'created_at', 'updated_at'
        ]


class FinancialSerializer(serializers.ModelSerializer):
    # Companyデータを手動結合（最適解）
    company_name = serializers.CharField(source='company_code', read_only=True)
    company = CompanySerializer(source='company_code', read_only=True)  # 完全データ

    class Meta:
        model = Financial
        fields = [
            'id', 'company_code', 'company_name', 'company',  # Company情報
            'sales', 'operating_margin', 'eps', 'equity_ratio',
            'operating_cash_flow', 'cash_and_equivalents',
            'dividend_per_share', 'payout_ratio', 'fiscal_year',
            'created_at', 'updated_at'
        ]

