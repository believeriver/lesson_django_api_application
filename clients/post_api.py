import requests
import logging
import sys
import fetch_api_auth

logging.basicConfig(level=logging.DEBUG, stream=sys.stdout)
logger = logging.getLogger(__name__)

BASE_URL = 'http://127.0.0.1:8000/'


# POST

def post_transactions(_token, _data):
    _url = f'{BASE_URL}api_household/transactions/'
    print(_token)
    response = requests.post(
        _url,
        data=_data,
        headers={'Authorization': f'JWT {_token}'})
    print(response.text)


if __name__ == '__main__':
    email = 'user01@email.com'
    password = 'user01'

    token = fetch_api_auth.fetch_token(email, password)
    print({'Authorization JWT': token})

    data = {
        "amount": "200.00",
        "type": "expense",
        "date": "2025-11-03",
        "category": "食費",
        "content": "キャベツ",
        "user_household": 2,
    }

    post_transactions(token, data)
