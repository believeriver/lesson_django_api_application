from django.db import models, transaction


class Company(models.Model):
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=255)
    stock = models.DecimalField(max_digits=10, decimal_places=2, blank=True)
    dividend = models.FloatField(blank=True, null=True)
    dividend_rank = models.IntegerField(blank=True, null=True)
    dividend_rank_updated = models.CharField(max_length=100, blank=True)
    industry = models.CharField(max_length=10, blank=True)
    description = models.TextField(blank=True)
    per = models.FloatField(blank=True, null=True)
    psr = models.FloatField(blank=True, null=True)
    pbr = models.FloatField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [models.Index(fields=['code'])]  # 頻繁検索フィールドにインデックス
        ordering = ['code']  # デフォルトソート
        verbose_name_plural = "Companies"  # 管理画面表示改善

    def __str__(self):
        return f'{self.code}: {self.name}'


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
    def get_or_create(code, fiscal_year, **data):
        obj, created = Financial.objects.update_or_create(
            company_code=code,
            fiscal_year=fiscal_year,
            defaults=data)
        return obj

    def __str__(self):
        return f'{self.company_code}: {self.fiscal_year}'
