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

from api_irbank.models import Information, IndicatorHistory


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


if __name__ == '__main__':
    info_dataset = {
        'code': 9986,
        'name': '蔵王産業(株)',
        'industry': '卸売業',
        'description': '業務用清掃・洗浄機器輸入販売商社。ビルメンテや製造業など業者向けが主力。',
        'per': 21.67,
        'psr': 1,
        'pbr': 1.19,
    }

    save_indicators(
        info_dataset['code'],
        info_dataset['industry'],
        info_dataset['description'],
        info_dataset['per'],
        info_dataset['psr'],
        info_dataset['pbr'])
