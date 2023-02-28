from neomodel import StructuredNode, StringProperty, RelationshipTo, RelationshipFrom, config, JSONProperty

# config with your own database user and password and database name
config.DATABASE_URL = 'bolt://neo4j:ajopajo@localhost:7687'


# class Book(StructuredNode):
#     title = StringProperty(unique_index=True)
#
#     author = RelationshipTo('Author', 'AUTHOR')
#
# class Author(StructuredNode):
#     name = StringProperty(unique_index=True)
#     books = RelationshipFrom('Book', 'AUTHOR')
#
# harry_potter = Book(title='Harry potter and the..').save()
# rowling =  Author(name='J. K. Rowling').save()
# harry_potter.author.connect(rowling)


# Create class for directory and file
class Directory(StructuredNode):
    name = StringProperty()
    fullpath = StringProperty()
    keywords = JSONProperty()
    parent = RelationshipTo('Directory', 'CONTAINS')
    files = RelationshipFrom('File', 'CONTAINS')
    subdirectories = RelationshipFrom('Directory', 'CONTAINS')


class File(StructuredNode):
    filename = StringProperty()
    fullpath = StringProperty()
    keywords = JSONProperty()
    parent = RelationshipTo('Directory', 'CONTAINS')
    files = RelationshipFrom('File', 'CONTAINS')

