import sys
import os
import logging
import gc
from optparse import OptionParser

import django

project_root = os.path.dirname(os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))))
print(f"Project Path: {project_root}")
sys.path.insert(0, project_root )
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api_irbank.scraping.controller.scraping_minkabu import CompanyData, FetchDataFromMinkabu
from api_irbank.models import Company, Information


handler = logging.StreamHandler(sys.stdout)
formatter = logging.Formatter('%(asctime)s:%(name)s:%(levelname)s:%(message)s')
handler.setFormatter(formatter)

logger = logging.getLogger(__name__)
# logger.setLevel(logging.DEBUG)
logger.setLevel(logging.INFO)
logger.propagate = False
logger.addHandler(handler)


def numeric_or_none(val):
    """
    int or float are OK. other is None
    """
    try:
        return float(val)
    except (ValueError, TypeError):
        return None


def scraping(_start: int = 1, _end: int = 10):
    company_code_list = []
    company_list = Company.fetch_code_and_name()
    logger.info({'max number of companies': len(company_list)})
    for company in company_list[_start:_end]:
        logger.debug({'code': company['code']})
        company_code_list.append(company['code'])

    for index, company_code in enumerate(company_code_list):
        logger.info({"index": index, "code": company_code})
        datasets = CompanyData()
        scraping = FetchDataFromMinkabu(datasets, company_code)
        scraping.fetch_soup_main(delay=3)
        scraping.fetch_select_item()
        for company in datasets.companies:
            logging.debug(company)
            c_code = company['code']
            c_industry = company['industry']
            c_description = company['description']
            c_per = numeric_or_none(company['per'])
            c_psr = numeric_or_none(company['psr'])
            c_pbr = numeric_or_none(company['pbr'])
            db_info = Information.get_or_create_and_update(
                c_code, c_industry, c_description, c_per, c_psr, c_pbr)

            logger.info({
                "code": db_info.company_code,
                "industry": db_info.industry,
                "PER": db_info.per,
                "PSR": db_info.psr,
                "PBR": db_info.pbr,
                "updated_at": db_info.updated_at,
            })


def main():
    usage = 'usage: %prog -s <start index> -e <end index>'
    parser = OptionParser(usage=usage)
    parser.add_option('-s', '--start', action='store', type='int', dest='start', help='start index')
    parser.add_option('-e', '--end', action='store', type='int', dest='end', help='end index')
    options, args = parser.parse_args()

    start_index = int(options.start)
    end_index = int(options.end)
    logger.info({
        'start': start_index,
        'end': end_index,
    })

    if start_index is None or end_index is None:
        raise Exception("start and end index are required.")

    scraping(start_index, end_index)


if __name__ == '__main__':
    # max index : 3372
    main()

    gc.collect()

