from django.db import models, transaction
from typing import List, Dict
import json


class Company(models.Model):
    code = models.CharField(max_length=16, primary_key=True)
    name = models.CharField(max_length=100, blank=True)
    stock = models.CharField(max_length=32, blank=True)
    dividend = models.FloatField(blank=True, null=True, default=None)
    dividend_rank = models.IntegerField(blank=True, null=True, default=0)
    dividend_update = models.CharField(max_length=100, blank=True, default='')

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
    industry = models.CharField(max_length=10, blank=True)
    description = models.TextField(blank=True)
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
    財務データ（会社×年度）
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
    company_code = models.CharField(max_length=16, verbose_name="会社コード", default='')
    sales = models.CharField(max_length=32, blank=True, verbose_name="売上高")
    operating_margin = models.FloatField(blank=True, null=True, verbose_name="営業利益率")
    eps = models.FloatField(blank=True, null=True, verbose_name="EPS")
    equity_ratio = models.FloatField(blank=True, null=True, verbose_name="自己資本比率")
    operating_cash_flow = models.BigIntegerField(blank=True, null=True, verbose_name="営業CF")
    cash_and_equivalents = models.BigIntegerField(blank=True, null=True, verbose_name="現金等")
    dividend_per_share = models.BigIntegerField(blank=True, null=True, verbose_name="1株配当")
    payout_ratio = models.FloatField(blank=True, null=True, verbose_name="配当性向")
    # fiscal_year = models.CharField(max_length=16, blank=True, null=True, verbose_name="会計年度")
    fiscal_year = models.CharField(max_length=16, verbose_name="会計年度")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'financials'
        unique_together = ['company_code', 'fiscal_year']  # 企業×年度でユニーク制約

    def __str__(self):
        return f"{self.company_code} - {self.fiscal_year}"

    @classmethod
    def get_or_create_update(
            cls, _code, _fiscal_year, _sale, _margin, _eps, _equity,
            _cashflow, _equivalents, _dividend, _payout):
        """Django版upsert（1クエリ）"""
        obj, created = cls.objects.update_or_create(
            company_code=_code,
            fiscal_year=_fiscal_year,
            defaults={
                'sales': _sale,
                'operating_margin': _margin,
                'eps': _eps,
                'equity_ratio': _equity,
                'operating_cash_flow': _cashflow,
                'cash_and_equivalents': _equivalents,
                'dividend_per_share': _dividend,
                'payout_ratio': _payout,
            }
        )
        return obj

    @classmethod
    def get_financial_by_company_code(cls, code):
        """単一取得（存在しない場合はNone）"""
        try:
            return cls.objects.get(company_code=code)
        except cls.DoesNotExist:
            return None

    @classmethod
    def get_financials_by_company_code(cls, code):
        """複数取得（年度別リスト）"""
        return list(cls.objects.filter(company_code=code)
                    .values('company_code', 'sales', 'operating_margin',
                            'eps', 'equity_ratio', 'operating_cash_flow',
                            'cash_and_equivalents', 'dividend_per_share',
                            'payout_ratio', 'fiscal_year'))
