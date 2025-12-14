import sys
import os
import django


my_path = os.path.dirname(os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))))
print(f"プロジェクトルート: {my_path}")
# sys.path.append(my_path)
sys.path.insert(0, my_path)

# Django設定初期化（必須）
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()


from api_irbank.models import Company, Financial, Information
"""
code: 9986
name: 蔵王産業(株)
dividend: 4.02
dividend_rank: 526
stock: 2,486
dividend_update: 更新日時：2025/12/10 18:40

industry: 卸売業
description: 業務用清掃・洗浄機器輸入販売商社。ビルメンテや製造業など業者向けが主力。
per: 21.67
pbr: 1.19
"""


def register_company(_dataset):
    company = Company.get_or_create_and_update(
        _dataset['code'],
        _dataset['name'],
        _dataset['stock'],
        _dataset['dividend'],
        _dataset['dividend_rank'],
        _dataset['dividend_update'])
    print(f'登録: {company}')


if __name__ == '__main__':
    company_dataset={
        'code': 9986,
        'name': '蔵王産業(株)',
        'dividend': 4.02,
        'dividend_rank': 526,
        'stock': 2486,
        'dividend_update': '更新日時：2025 / 12 / 10 18: 40'
    }

    register_company(company_dataset)
