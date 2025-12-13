from rest_framework import serializers
from .models import Company, Financial, Information


class CompanySerializer(serializers.ModelSerializer):
    information = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = [
            'code',
            'name',
            'stock',
            'dividend',
            'dividend_rank',
            'dividend_update',
            'information'
        ]
        read_only_fields = [
            'code',  # PrimaryKeyなので読み取り専用
        ]

    def get_information(self, obj):
        information_dataset = self.context.get('information_dataset', {})
        return information_dataset.get(obj.code, [])

    def create(self, validated_data):
        """カスタムcreate（get_or_create_and_update活用）"""
        return Company.get_or_create_and_update(
            validated_data['code'],
            validated_data['name'],
            validated_data['stock'],
            validated_data['dividend'],
            validated_data.get('dividend_rank', 0),
            validated_data.get('dividend_update', '')
        )

    def update(self, instance, validated_data):
        """カスタムupdate"""
        return Company.get_or_create_and_update(
            instance.code,
            validated_data.get('name', instance.name),
            validated_data.get('stock', instance.stock),
            validated_data.get('dividend', instance.dividend),
            validated_data.get('dividend_rank', instance.dividend_rank),
            validated_data.get('dividend_update', instance.dividend_update)
        )


class InformationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Information
        # 必要なフィールドだけ列挙してもOK
        fields = [
            "id",
            "company_code",
            "industry",
            "description",
            "per",
            "psr",
            "pbr",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]


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
        ]
        read_only_fields = ["created_at", "updated_at"]

