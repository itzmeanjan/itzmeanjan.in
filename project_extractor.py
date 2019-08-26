#!/usr/bin/python3

from typing import Dict, Any
from requests import get
from json import dump
from os.path import dirname, abspath, join
from urllib.parse import urljoin
from dateutil.parser import parse
from itertools import chain
from functools import reduce
try:
    from bs4 import BeautifulSoup
except ImportError as e:
    print('[!]Module Unavailable : {}'.format(str(e)))
    exit(1)

'''
	extracts required data in form of a collection of tuples, where 
	first element of tuple will be key of final JSON object and second one
	a JSON object ( here a Python Dict[String, Any] )

	function will return a map object which is to be iterated over,
	and to be converted to Dict[String, Any] using dict(), which will be
	finally written into a target_file, after serializing into JSON
'''


def extractIt(dataObject, username: str, targetClass: str = 'col-10 col-lg-9 d-inline-block') -> Dict[str, Any]:
    def __extractFromThisPage__():
        def __findLicense(element):
            try:
                return element.findAll('span', {'class': 'mr-3'})[1].text.strip()
            except Exception:
                return ''

        def __findForkCount__(element):
            try:
                return reduce(lambda acc, cur: acc + int(cur.text.strip()), filter(lambda e: e.get(
                    'href').endswith('stargazers'), element), 0)
            except Exception as e:
                return 0

        def __findStargazerCount__(element):
            try:
                return reduce(lambda acc, cur: acc + int(cur.text.strip()), filter(lambda e: e.get(
                    'href').endswith('members'), element), 0)
            except Exception:
                return 0

        return map(lambda e: (e.findChild('div', {'class': 'd-inline-block mb-1'}).h3.a.text.strip(), {
            'url': urljoin('https://github.com/{}'.format(username), e.findChild('div', {'class': 'd-inline-block mb-1'}).h3.a.get('href')),
            'description': e.find('p', {'class': 'col-9 d-inline-block text-gray mb-2 pr-4'}).text.strip(),
            'lang': e.findChild('div', {'class': 'f6 text-gray mt-2'}).findChild('span', {'itemprop': 'programmingLanguage'}).text.strip(),
            'langColor': e.findChild('div', {'class': 'f6 text-gray mt-2'}).findChild('span', {'class': 'ml-0 mr-3'}).findChild('span', {'class': 'repo-language-color'}).get('style').split(':')[1].strip(),
            'fork': __findForkCount__(e.findChild('div', {'class': 'f6 text-gray mt-2'}).findAll('a', {'class': 'muted-link mr-3'})),
            'star': __findStargazerCount__(e.findChild('div', {'class': 'f6 text-gray mt-2'}).findAll('a', {'class': 'muted-link mr-3'})),
            'updated': parse(e.findChild('div', {'class': 'f6 text-gray mt-2'}).findChild('relative-time').get('datetime')).timestamp(),
            'license': __findLicense(e.findChild('div', {'class': 'f6 text-gray mt-2'}))}), dataObject.findAll('div', {'class': targetClass}))

    try:
        paginatedObject = dataObject.findChild(
            'div', {'class': 'paginate-container'})
        if(paginatedObject):
            linksToFollow = paginatedObject.div.findAll('a')
            if(len(linksToFollow) == 2):
                return chain(__extractFromThisPage__(), extractIt(BeautifulSoup(fetchIt(
                    linksToFollow[1].get('href')), features='html.parser'), username=username))
            else:
                if(linksToFollow[0].text.strip().lower() == 'next'):
                    return chain(__extractFromThisPage__(), extractIt(BeautifulSoup(fetchIt(
                        linksToFollow[0].get('href')), features='html.parser'), username=username))
                else:
                    return __extractFromThisPage__()
        else:
            return __extractFromThisPage__()
    except Exception as e:
        return None


'''
	fetches content of target webpage, which will be parsed using some `html` parser
'''


def fetchIt(url: str) -> str:
    try:
        resp = get(url)
        return resp.content if(resp.status_code is 200) else None
    except Exception:
        return None


'''
	main entry point of script, calls required methods in
	proper order to finally write extracted data into target_file as JSON string
'''


def app(username: str, target_file: str = abspath(join(dirname(__file__), 'data/projects.json'))) -> bool:
    try:

        with open(target_file, 'w') as fd:
            dump(dict(extractIt(BeautifulSoup(fetchIt('https://github.com/{}?tab=repositories'.format(
                username)), features='html.parser'), username=username)),
                fd, ensure_ascii=False, indent=4)
        return True
    except Exception:
        return False


if __name__ == '__main__':
    try:
        print('success' if app('itzmeanjan') else 'failure')
    except KeyboardInterrupt:
        print('\n[!]Terminated')
    finally:
        exit(0)
