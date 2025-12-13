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
    company_name = serializers.SerializerMethodField()
    company = serializers.SerializerMethodField()

    class Meta:
        model = Financial
        fields = [
            'company_code',
            'company_name',
            'company',  # Company情報
            'sales',
            'operating_margin',
            'eps',
            'equity_ratio',
            'operating_cash_flow',
            'cash_and_equivalents',
            'dividend_per_share',
            'fiscal_year',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['company_code', 'fiscal_year']

    @staticmethod
    def get_company_name(obj):
        company = Company.objects.filter(code=obj.company_code).only('name').first()
        return company.name if company else ''

    @staticmethod
    def get_company(obj):
        company = Company.objects.filter(code=obj.company_code).first()
        if company:
            return CompanySerializer(company).data
        return None

    def create(self, validated_data):
        """カスタムcreate（get_or_create_update活用）"""
        return Financial.get_or_create_update(
            validated_data['company_code'],
            validated_data['fiscal_year'],
            validated_data.get('sales', ''),
            validated_data.get('operating_margin', None),
            validated_data.get('eps', None),
            validated_data.get('equity_ratio', None),
            validated_data.get('operating_cash_flow', None),
            validated_data.get('cash_and_equivalents', None),
            validated_data.get('dividend_per_share', None),
            validated_data.get('payout_ratio', None),
        )

    def update(self, instance, validated_data):
        """カスタムupdate"""
        return Financial.get_or_create_update(
            instance.company_code,
            instance.fiscal_year,
            validated_data.get('sales', instance.sales),
            validated_data.get('operating_margin', instance.operating_margin),
            validated_data.get('eps', instance.eps),
            validated_data.get('equity_ratio', instance.equity_ratio),
            validated_data.get('operating_cash_flow', instance.operating_cash_flow),
            validated_data.get('cash_and_equivalents', instance.cash_and_equivalents),
            validated_data.get('dividend_per_share', instance.dividend_per_share),
            validated_data.get('payout_ratio', instance.payout_ratio),
        )

