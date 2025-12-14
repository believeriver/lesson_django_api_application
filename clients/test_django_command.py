import os
import sys
from django.core.management.base import BaseCommand

my_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
print(f"プロジェクトルート: {my_path}")
# sys.path.append(my_path)
sys.path.insert(0, my_path)


from api_irbank.models import Company


class Command(BaseCommand):
    def handle(self, *args, **options):
        _dataset = {
            'code': 9986,
            'name': '蔵王産業(株)',
            'stock': 2486,
            'dividend': 4.02,
            'dividend_rank': 526,
            'dividend_update': '更新日時：2025 / 12 / 10 18: 40'
        }
        company = Company.get_or_create_and_update(
            _dataset['code'],
            _dataset['name'],
            _dataset['stock'],
            _dataset['dividend'],
            _dataset['dividend_rank'],
            _dataset['dividend_update'])
        print(f"登録完了: {company}")


