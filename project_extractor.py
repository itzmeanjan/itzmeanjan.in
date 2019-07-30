#!/usr/bin/python3

from requests import get
from json import dump
from os.path import dirname, abspath, join
from urllib.parse import urljoin
from dateutil.parser import parse
try:
    from bs4 import BeautifulSoup
except ImportError as e:
    print('[!]Module Unavailable : {}'.format(str(e)))
    exit(1)


def extractIt(dataObject, targetClass: str = 'col-10 col-lg-9 d-inline-block', url: str = 'https://github.com/itzmeanjan'):
    try:
        return map(lambda e: (e.findChild('div', {'class': 'd-inline-block mb-1'}).h3.a.text.strip(), {'url': urljoin('https://github.com/itzmeanjan', e.findChild('div', {'class': 'd-inline-block mb-1'}).h3.a.get('href')), 'description': e.find('p', {'class': 'col-9 d-inline-block text-gray mb-2 pr-4'}).text.strip(), 'lang': e.findChild('div', {'class': 'f6 text-gray mt-2'}).findChild('span', {'itemprop': 'programmingLanguage'}).text.strip(), 'langColor': e.findChild('div', {'class': 'f6 text-gray mt-2'}).findChild('span', {'class': 'ml-0 mr-3'}).findChild('span', {'class': 'repo-language-color'}).get('style').split(':')[1].strip(), 'updated': parse(e.findChild('div', {'class': 'f6 text-gray mt-2'}).findChild('relative-time').get('datetime')).timestamp()}), dataObject.findAll('div', {'class': targetClass}))
    except Exception:
        return None


def fetchIt(url: str = 'https://github.com/itzmeanjan?tab=repositories') -> str:
    try:
        resp = get(url)
        return resp.content if(resp.status_code is 200) else None
    except Exception:
        return None


def app(target_file: str = abspath(join(dirname(__file__), 'data/projects.json'))) -> bool:
    try:
        with open(target_file, 'w') as fd:
            dump(dict(extractIt(BeautifulSoup(fetchIt(), features='html.parser'))),
                 fd, ensure_ascii=False, indent=4)
        return True
    except Exception as e:
        return False


if __name__ == '__main__':
    try:
        print('success' if app() else 'failure')
    except KeyboardInterrupt:
        print('\n[!]Terminated')
    finally:
        exit(0)
