#!/usr/bin/python3

from os.path import abspath, dirname, join, isfile, isdir, getmtime
from os import listdir
from json import load, dump


def app(source_dir: str = abspath(join(dirname(__file__), 'blog')), sink_file: str = abspath(join(dirname(__file__), 'data/blog.json'))) -> bool:
    '''
        For updating last modification field in both blog post holder file &
        in metadata file, we require following two methods 
    '''
    def __write_back_to_file__(filePath: str, content):
        with open(filePath, 'w') as fd:
            dump(content, fd, ensure_ascii=False, indent=4)
        return

    '''
        This extracted content is returned back in form of python Dict[String, Any] object,
        which is to be used for writing to `./data/blog.json` file
    '''
    def __extract_from_file__(filepath: str):
        with open(filepath, 'r') as fd:
            content = load(fd)
        content.update({'updated': int(getmtime(filepath))})
        __write_back_to_file__(filepath, content)
        return {'title': content.get('title', ''), 'created': content.get('created', 0), 'author': content.get('author', ''), 'content': content.get('content', '')[0]}

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
