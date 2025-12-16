from typing import List
import gc

from scraping_interface import IDataSet, IFetchDataFromUrl, ISaveToFile


"""
Sample of Using Interface of scraping

Fetch the job employment information from en japan url.
Export result to test.csv.
"""


class CompanyData(IDataSet):
    def __init__(self):
        self.companies = []


class FetchDataFromEnJapan(IFetchDataFromUrl):
    def __init__(self, page_index, dataset: CompanyData) -> None:
        super().__init__()
        self.base_url = 'https://employment.en-japan.com'
        self.url = 'https://employment.en-japan.com/wish/search_list/' \
                   '?companytype=0&worktype=0&areaid=23_24_21_50&occupation=' \
                   '101000_102500_103000_103500_104500_105000_105500_109000&indexNoWishArea' \
                   '=0&sort=wish&pagenum={}'.format(page_index)
        self.jobs = None
        self.page_index = page_index
        self.dataset = dataset

    def _check_page_url(self, page_url: str) -> str:
        if 'fromSearch' in page_url:
            path = page_url.replace(self.base_url+'/desc_eng_', '')
            e_index = path.rfind('/')
            company_id = path[:e_index]
            page_url = f'https://en-gage.net/recruit/?getFromEmploy={company_id}'
        return page_url

    def _fetch_company_url(self, page_url: str) -> str:
        page_soup = self._fetch_soup(page_url, 3)
        post_r_url = None

        if 'PK' in page_url:
            temp = page_soup.find('a', class_='previewOption')
            if temp is not None:
                post_r_url = temp.get('href')
                print(post_r_url)
            else:
                company_summary = page_soup.find('div', class_='descArticleUnit dataCompanyInfoSummary')
                for tr in company_summary.find_all('tr'):
                    if tr.find('th').text == '採用ホームページ':
                        post_r_url = tr.find('td').find('a').get('href')
                        print('else idx', post_r_url)

        elif 'getFromEmploy' in page_url:
            # print('--- start ---')
            company_summary = page_soup.find('table', class_='companyTable')
            # print(company_summary)
            for tr in company_summary.find_all('tr'):
                if tr.find('th').text == '企業WEBサイト':
                    post_r_url = tr.find('td').find('a').get('href')
                    print('fromSearch', post_r_url)
        # else:
        #     raise
        else:
            print(f"Unhandled URL pattern: {page_url}")
            return None

        return post_r_url

    def fetch_find_item(self) -> None:
        self.jobs = self._soup_main.find_all('div', class_='jobNameArea')

        for job in self.jobs[:3]:
            company_name = job.find('span', class_='company').text
            page_url = self.base_url + job.find('a').get('href')
            page_url = self._check_page_url(page_url)
            company_url = self._fetch_company_url(page_url)

            self.dataset.companies.append({
                'page_index': self.page_index,
                'company_name': company_name,
                'company_url': company_url
            })


class SaveToCsvFile(ISaveToFile):
    def __init__(self, filename: str, dataset: List[dict]):
        super().__init__(filename, dataset)


if __name__ == '__main__':
    company_list = CompanyData()
    for i in range(1, 2):
        fetch_soup = FetchDataFromEnJapan(i, company_list)
        fetch_soup.fetch_soup_main(delay=15)
        fetch_soup.fetch_find_item()

    print('-'*10)
    save_to_file = SaveToCsvFile('temp/test_scraping.csv', company_list.companies)
    save_to_file.write_to_csvfile()

    del company_list, fetch_soup, save_to_file
    gc.collect()
