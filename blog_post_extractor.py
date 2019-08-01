#!/usr/bin/python3

from os.path import abspath, dirname, join, isfile, isdir
from os import listdir
from json import load, dump
from math import ceil


def app(source_dir: str = abspath(join(dirname(__file__), 'blog')), sink_file: str = abspath(join(dirname(__file__), 'data/blog.json'))) -> bool:
    def __extract_from_file__(filepath: str):
        with open(filepath, 'r') as fd:
            content = load(fd)
            return {'title': content.get('title', ''), 'updated': content.get('updated', 0), 'author': content.get('author', ''), 'content': content.get('content', '')[:ceil(len(content.get('title', '')) * 3/2)]}

    return_val = False
    try:
        if(not isdir(source_dir)):
            raise('source directory absent !!!')
        with open(sink_file, 'w') as fd:
            dump(dict(map(lambda elem: (elem.strip('.json'),  __extract_from_file__(join(source_dir, elem))), filter(lambda elemInner: isfile(join(source_dir, elemInner))
                                                                                                                     and elemInner.endswith("json"), listdir(source_dir)))), fd, ensure_ascii=False, indent=4)
        return_val = True
    except Exception:
        return_val = False
    finally:
        return return_val


if __name__ == '__main__':
    try:
        code = app()
        print('success' if code else 'failure')
    except KeyboardInterrupt:
        code = 1
        print('\n[!]Terminated')
    finally:
        exit(0 if code else 1)
