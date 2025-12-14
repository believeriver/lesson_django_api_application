import os
import sys
import django
from django.utils import timezone

my_path = os.path.dirname(os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))))
print(f"プロジェクトルート: {my_path}")
# sys.path.append(my_path)
sys.path.insert(0, my_path)

# Django設定初期化（必須）
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api_irbank.models import Company, Financial,Information, IndicatorHistory


def save_indicators(_code, _industry, _description, _per, _psr, _pbr):
    today = timezone.now().date()

    # 1. Information（最新状態）を upsert
    info, _ = Information.objects.update_or_create(
        company_code=_code,
        defaults={
            'industry': _industry,
            'description': _description,
            'per': _per,
            'psr': _psr,
            'pbr': _pbr,
        },
    )

    # 2. IndicatorHistory（履歴）を upsert（同じ日なら上書き）
    IndicatorHistory.objects.update_or_create(
        company_code=_code,
        collected_at=today,
        defaults={
            'per': _per,
            'psr': _psr,
            'pbr': _pbr,
        },
    )