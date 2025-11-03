import requests
import logging
import sys

logging.basicConfig(level=logging.DEBUG, stream=sys.stdout)
logger = logging.getLogger(__name__)

BASE_URL = 'http://127.0.0.1:8000/'


def create_user(_email: str, _password: str):
    _url = f'{BASE_URL}api_auth/register/'
    response = requests.post(_url, data={
        'email': _email,
        'password': _password,
    })
    # logger.debug({'fetch jwt token status': requests.status_codes})
    return response.json()


def fetch_token(_email: str, _password: str):
    _url = f'{BASE_URL}authen/jwt/create'
    response = requests.post(_url, data={
        'email': _email,
        'password': _password,
    })
    # logger.debug({'fetch jwt token status': requests.status_codes})
    return response.json().get('access')


def fetch_profile(_token: str):
    _url = f'{BASE_URL}api_auth/myprofile/'
    response = requests.get(
        _url, headers={'Authorization': f'JWT {token}'})
    return response.text


def fetch_household_transactions(_token: str):
    _url = f'{BASE_URL}api_household/transactions/'
    response = requests.get(
        _url, headers={'Authorization': f'JWT {token}'})
    return response.text


if __name__ == '__main__':
    email = 'user01@email.com'
    password = 'user01'

    create_flg = False

    if create_flg:
        print('create user: ')
        res = create_user(email, password)
        print('res: ', res)

    print('fetch token')
    token = fetch_token(email, password)
    print({'Authorization JWT': token})

    # print('profile')
    # print(fetch_profile(''))
    # print(fetch_profile(token))

    # print('tasks')
    # print(fetch_tasks(token))

    print('household transactions')
    print(fetch_household_transactions(token))


