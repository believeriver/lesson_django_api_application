from django.db import models, transaction
from typing import List, Dict


class Company(models.Model):
    code = models.CharField(max_length=16, primary_key=True)
    name = models.CharField(max_length=100)
    stock = models.CharField(max_length=32)
    dividend = models.FloatField()
    dividend_rank = models.IntegerField()
    dividend_update = models.CharField(max_length=100)

    class Meta:
        db_table = "companies"  # __tablename__相当

    def __str__(self):
        return f"{self.name} ({self.code})"

    @classmethod
    @transaction.atomic  # トランザクション保証
    def get_or_create_and_update(cls, _code, _name, _stock, _dividend, _rank, _date):
        """
        company_codeでget_or_createし、更新日が異なる場合は更新
        """
        obj, created = cls.objects.get_or_create(
            company_code=_code,
            defaults={
                'name': _name,
                'stock': _stock,
                'dividend': _dividend,
                'dividend_rank': _rank,
                'dividend_update': _date,
            }
        )

        if not created and obj.company_dividend_update != _date:
            # 既存レコード更新
            obj._stock = _stock
            obj._dividend = _dividend
            obj._dividend_rank = _rank
            obj._dividend_update = _date
            obj.save()

        return obj

    @classmethod
    def fetch_code_and_name(cls) -> List[Dict]:
        """全件取得"""
        return list(
            cls.objects.values(
                'code',
                'name',
                'stock',
                'dividend',
                'dividend_rank',
                'dividend_update',
            )
        )

    @classmethod
    def fetch_code_and_name_one(cls, c_code) -> List[Dict]:
        """単一コード取得"""
        obj = cls.objects.filter(company_code=c_code).first()
        if obj:
            return [{
                'code': obj.code,
                'name': obj.name,
                'stock': obj.stock,
                'dividend': obj.dividend,
                'rank': obj.dividend_rank,
                'dividend_update': obj.dividend_update,
            }]
        return []

    @classmethod
    def fetch_code_and_name_by_name(cls, partial_name: str) -> List[Dict]:
        """部分一致検索"""
        return list(
            cls.objects.filter(
                company_name__icontains=partial_name  # LIKE '%partial_name%'
            ).values(
                'code',
                'name',
                'stock',
                'dividend',
                'dividend_rank',
                'dividend_update',
            )
        )


class Information(models.Model):
    company_code = models.CharField(max_length=16)
    industry = models.CharField(max_length=10, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    per = models.FloatField(blank=True, null=True)
    psr = models.FloatField(blank=True, null=True)
    pbr = models.FloatField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @classmethod
    def get_or_create_and_update(
            cls, _code, _industry, _description, _per, _psr, _pbr):
        obj, created = cls.objects.get_or_create(
            company_code=_code,
            defaults={
                "industry": _industry,
                "description": _description,
                "per": _per,
                "psr": _psr,
                "pbr": _pbr,
            }
        )
        if not created:
            "既存レコード更新"
            obj.industry = _industry
            obj.description = _description
            obj.per = _per
            obj.psr = _psr
            obj.pbr = _pbr
            obj.save()
        return obj


class Financial(models.Model):
    """
    1. sales: 売上高
    2. operating_margin: 営業利益率
    3. eps: EPS
    4. equity_ratio: 自己資本比率
    5. operating_cash_flow: 営業活動によるCF
    6. cash_and_equivalents: 現金など
    7. dividend_per_share: 一株配当
    8. payout_ratio: 配当性向
    9. fiscal_year: 会計年度
    """
    # code = models.ForeignKey(Company, on_delete=models.CASCADE, to_field='code')
    company_code = models.CharField(max_length=20, db_index=True, default='', blank=True)
    sales = models.DecimalField(max_digits=20, decimal_places=2, blank=True)
    operating_margin = models.FloatField(blank=True)
    eps = models.FloatField(blank=True)
    equity_ratio = models.FloatField(blank=True)
    operating_cash_flow = models.DecimalField(max_digits=20, decimal_places=2)
    cash_and_equivalents = models.DecimalField(max_digits=20, decimal_places=2)
    dividend_per_share = models.FloatField(blank=True)
    payout_ratio = models.FloatField(blank=True)
    fiscal_year = models.CharField(max_length=16)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['company_code', 'fiscal_year']  # 企業×年度でユニーク制約
        indexes = [models.Index(fields=['company_code', 'fiscal_year'])]

    @staticmethod
    @transaction.atomic
    def get_or_create_fast(code, fiscal_year, **data):
        obj, created = Financial.objects.update_or_create(
            company_code=code,
            fiscal_year=fiscal_year,
            defaults=data)
        return obj

    def __str__(self):
        return f'{self.company_code}: {self.fiscal_year}'
