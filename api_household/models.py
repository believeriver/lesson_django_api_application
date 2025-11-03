from django.db import models

# Create your models here.
"""
HouseHoldTransactions(object)
amount  : number
type    : string
date    : string
category: string
content : string
created_on: date
updated_on: date
"""


class HouseHoldTransactions(models.Model):
    amount = models.DecimalField(max_digits=10, decimal_places=2)  # 金額（例：最大10桁、小数点以下2桁）
    type = models.CharField(max_length=10)                        # 取引タイプ（例：income、expenseなど）
    date = models.DateField()                                     # '2025-01-01'のフォーマットで扱う日付型
    category = models.CharField(max_length=50)                    # カテゴリ
    content = models.CharField(max_length=255)                    # 内容
    created_on = models.DateTimeField(auto_now_add=True)          # レコード作成日時（自動設定）
    updated_on = models.DateTimeField(auto_now=True)              # レコード更新日時（自動更新）

    def __str__(self):
        return f"{self.date} {self.type} {self.amount}"
