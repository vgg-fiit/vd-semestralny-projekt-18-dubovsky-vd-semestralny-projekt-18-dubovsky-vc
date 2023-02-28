import string

import nltk
import re


def dfs_traverse(data):
    flat_list = []
    # With stack traverse data
    root = {'type': 'folder', 'name': 'root', "depth": 0}
    # Stack for dfs
    stack = []

    # Add first element to stack
    for d in data:
        d['parent'] = root
        d['depth'] = root['depth'] + 1
        stack.append(d)


    # While stack is not empty

    while len(stack) > 0:
        element = stack.pop()

        # If element is folder
        if "contents" in element:
            # Add all contents to stack
            for e in element['contents']:
                e['depth'] = element['depth'] + 1
                e['parent'] = element
                flat_list.append(e)
                stack.append(e)

        if element['type'] == 'directory':
            print(element['parent']['name'], " -> ", element['name'])

        # If element is file
        if element['type'] == 'file':
            print (element['parent']['name'] + ' -> ' + element['name'])

    for element in flat_list:
        # using nltk to tokenize the text into words


        tokens = nltk.word_tokenize(element['name'].split('/')[-1])
        # convert to lower case
        words = []
        if element['type'] == 'file':
            for child in element['parent']['contents']:
                if child['type'] == 'file':
                    tokens = tokens + nltk.word_tokenize(child['name'].split('/')[-1])
                    # Replace .pdf in tokens
                    tokens = [re.sub(r'\.pdf', '', w) for w in tokens]
                    tokens = [w.lower() for w in tokens]
                    tokens = [w.lower() for w in tokens]
                    # removing punctuation from each word
                    table = str.maketrans('', '', string.punctuation)
                    stripped = [w.translate(table) for w in tokens]
                    # removing remaining tokens that are not alphabetic
                    words = [word for word in stripped if word.isalpha()]


            print(element['parent']['name'].split('/')[-1], words)

        # filter out stop words

        # using a regular expression to remove all tokens that are not alphabetic










