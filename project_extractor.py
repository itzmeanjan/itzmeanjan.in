#!/usr/bin/python3

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
	extracts required data in form of a chained iterables,
	which are to be converted to Dict[String, Any], beforing writing to
    JSON file using JSON encoder

    There may be some situation when a certain profile might have
    so many repositories that they are paginated, and we need to traverse
    through all those pages, which is why we'll require to perform
    recursive call to this function

    This function body is having closures defined
'''


def extractIt(dataObject, username: str, targetClass: str = 'col-10 col-lg-9 d-inline-block'):
    def __extractFromThisPage__():

        def __findURL__(element) -> str:
            try:
                return urljoin('https://github.com', element.findChild('div', {'class': 'd-inline-block mb-1'}).h3.a.get('href'))
            except Exception:
                return ''

        def __findDescription__(element) -> str:
            try:
                return element.findChild('p', {'class': 'col-9 d-inline-block text-gray mb-2 pr-4'}).text.strip()
            except Exception:
                return ''

        def __findLanguage__(element) -> str:
            try:
                return element.findChild('div', {'class': 'f6 text-gray mt-2'}).findChild('span', {'itemprop': 'programmingLanguage'}).text.strip()
            except Exception:
                return ''

        def __findLanguageColor__(element) -> str:
            try:
                return element.findChild('div', {'class': 'f6 text-gray mt-2'}).findChild('span', {'class': 'ml-0 mr-3'}).findChild('span', {'class': 'repo-language-color'}).get('style').split(':')[1].strip()
            except Exception:
                return ''

        def __findForkCount__(element) -> int:
            try:
                return reduce(lambda acc, cur: acc + int(cur.text.strip()), filter(lambda e: e.get(
                    'href').endswith('members'), element.findChild('div', {'class': 'f6 text-gray mt-2'}).findAll('a', {'class': 'muted-link mr-3'})), 0)
            except Exception:
                return 0

        def __findStargazerCount__(element) -> int:
            try:
                return reduce(lambda acc, cur: acc + int(cur.text.strip()), filter(lambda e: e.get(
                    'href').endswith('stargazers'), element.findChild('div', {'class': 'f6 text-gray mt-2'}).findAll('a', {'class': 'muted-link mr-3'})), 0)
            except Exception:
                return 0

        '''
            Gets timestamp in second from epoch to designate,
            last time when this repository was updated
        '''
        def __findLastUpdated__(element) -> float:
            try:
                return parse(element.findChild(
                    'div', {'class': 'f6 text-gray mt-2'}).findChild('relative-time').get('datetime')).timestamp()
            except Exception:
                return 0.0

        '''
            Gets name of License scheme being used for this project,
            in case of error, returns empty string
        '''
        def __findLicense(element) -> str:
            try:
                return reduce(lambda acc, cur: acc + cur.text.strip(), filter(lambda e: ''.join(e.get('class')) == 'mr-3', element.findChild(
                    'div', {'class': 'f6 text-gray mt-2'}).findAll('span', {'class': 'mr-3'})), '')
            except Exception:
                return ''

        '''
            Checks whether currently inspected repository is forked
            from somewhere else or not

            If yes, returns URL of source, else returns empty string
        '''
        def __checkIfForked__(element) -> str:
            try:
                return urljoin('https://github.com', element.findChild('div', {'class': 'd-inline-block mb-1'}).findChild('span', {'class': 'f6 text-gray mb-1'}).findChild('a', {'class': 'muted-link'}).get('href'))
            except Exception:
                return ''

        return map(lambda e: (e.findChild('div', {'class': 'd-inline-block mb-1'}).h3.a.text.strip(), {
            'url': __findURL__(e),
            'description': __findDescription__(e),
            'lang': __findLanguage__(e),
            'langColor': __findLanguageColor__(e),
            'fork': __findForkCount__(e),
            'star': __findStargazerCount__(e),
            'updated': __findLastUpdated__(e),
            'license': __findLicense(e),
            'forkedFrom': __checkIfForked__(e)}), dataObject.findAll('div', {'class': targetClass}))

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
        return resp.content if(resp.status_code == 200) else None
    except Exception:
        return None


'''
	main entry point of script, calls required methods in
	proper order to finally write extracted data into target_file as JSON string

    Takes one mandatory argument, username i.e. GitHub username, this is the
    account which our crawler is going to scrape through, for extracting GitHub projects information
'''


def app(username: str, target_file: str = abspath(join(dirname(__file__), 'data/projects.json'))) -> bool:
    try:

        with open(target_file, 'w') as fd:
            dump(dict(extractIt(BeautifulSoup(fetchIt('https://github.com/{}?tab=repositories'.format(
                username)), features='html.parser'), username=username)),
                fd, ensure_ascii=False, indent=4)
        return True
    except Exception as e:
        return False


if __name__ == '__main__':
    try:
        print('success' if app('itzmeanjan') else 'failure')
    except KeyboardInterrupt:
        print('\n[!]Terminated')
    finally:
        exit(0)
