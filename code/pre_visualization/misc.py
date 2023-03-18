import nltk
import re
from textblob import TextBlob
from db import File, Directory


def connect(flat_list):
    for e in flat_list:

        parent = e['parent']
        if e['type'] == 'directory' and parent['type'] == 'directory':
            e['object'].parent_directory.connect(parent['object'])

        if e['type'] == 'file' and parent['type'] == 'directory':
            e['object'].parent.connect(parent['object'])

# MATCH (n) DETACH DELETE n;


def get_keywords(text):
    tokens = nltk.word_tokenize(text)
    # convert to lower case
    words = [word.lower() for word in tokens]
    # filter out stop words
    stop_words = set(nltk.corpus.stopwords.words('english'))
    words = [w for w in words if not w in stop_words]
    # replace all not alphabetic characters with space
    words = [re.sub(r'[^a-zA-Z]', '', w) for w in words]

    return words


def get_metadata(element):
    filename = element['name'].split('/')[-1]

    metadata = {
        "year": re.findall(r'\((\d+)\)', filename),
        # "size": element['size'],
        "filename": filename,
        "extension": re.findall(r'\.[a-zA-Z0-9]+$', filename),
        "ISBN": re.findall(r'ISBN\s*([0-9]{10}|[0-9]{13})', element['name'], re.I),
        # "lang": TextBlob(filename).detect_language(),
    }

    return metadata


def dfs_traverse(data, last_id):
    flat_list = []
    wordlist = []
    root = {'type': 'directory', 'name': 'root', "depth": 0}
    root['object'] = Directory(name='root', fullpath='root', metadata={}, keywords=[]).save()
    stack = []

    # Add first element to stack
    for d in data:
        d['parent'] = root
        d['depth'] = root['depth'] + 1
        stack.append(d)

    while len(stack) > 0:

        element = stack.pop()

        element['metadata'] = get_metadata(element)

        keywords = get_keywords(element['name'].split('/')[-1])

        for keyword in keywords:
            if keyword not in wordlist:
                wordlist.append(keyword)

        if element['type'] == 'file':
            element['object'] = File(name=element['name'].split('/')[-1], fullpath=element['name'],
                                     metadata=element['metadata'], keywords=keywords).save()
        if element['type'] == 'directory':
            element['object'] = Directory(name=element['name'].split('/')[-1], fullpath=element['name'],
                                          metadata=element['metadata'], keywords=keywords).save()

        if element['object'].id is not None:
            print("Node saved")

        flat_list.append(element)

        element['id'] = last_id
        last_id += 1

        # If element is folder
        if "contents" in element:
            # Add all contents to stack
            for e in element['contents']:
                e['depth'] = element['depth'] + 1
                e['parent'] = element
                stack.append(e)

    return flat_list, last_id, wordlist
