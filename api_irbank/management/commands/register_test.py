# api_irbank/management/commands/register_scraping_data.py
from django.core.management.base import BaseCommand
from django.db import transaction
from api_irbank.models import Company, Financial
import time


class Command(BaseCommand):
    """
    cd django_api_application

    # テスト実行
    python manage.py register_test --dry-run

    # 本番実行
    python manage.py register_test

    # 特定会社のみ
    python manage.py register_test --company 2914
    """

    help = 'ScrapingデータをDjango DBにバルク登録'

    def add_arguments(self, parser):
        parser.add_argument('--company', type=str, help='会社コード')
        parser.add_argument('--dry-run', action='store_true', help='テスト実行')

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🚀 Scrapingデータ登録開始'))
        start_time = time.time()

        # scrapingデータ例（実際はファイル読み込み）
        scraping_data = [
            {
                'company_code': '2914',
                'company_name': '日本たばこ産業',
                'stock': '5000',
                'dividend': 150.5,
                'dividend_rank': 10,
                'dividend_update': '2025-01-01',
                'fiscal_year': '2008/03',
                'sales': '6410000000000',
                'operating_margin': 6.72,
                'eps': 69.72,
                # ... 他のフィールド
            },
            # 実際のscraping結果をここに
        ]

        with transaction.atomic():  # 全件トランザクション
            for data in scraping_data:
                # Company登録
                company = Company.get_or_create_and_update(
                    data['company_code'],
                    data['company_name'],
                    data['stock'],
                    data['dividend'],
                    data['dividend_rank'],
                    data['dividend_update']
                )

                # # Financial登録
                # financial = Financial.get_or_create_update(
                #     data['company_code'],
                #     data['fiscal_year'],
                #     data['sales'],
                #     data['operating_margin'],
                #     data['eps'],
                #     # ... 他の引数
                # )

                if options['dry_run']:
                    self.stdout.write(self.style.WARNING(f'DRY: {company}'))
                else:
                    self.stdout.write(self.style.SUCCESS(f'✅ {company}'))

        elapsed = time.time() - start_time
        self.stdout.write(self.style.SUCCESS(f'🎉 完了！{len(scraping_data)}件/{elapsed:.1f}秒'))
