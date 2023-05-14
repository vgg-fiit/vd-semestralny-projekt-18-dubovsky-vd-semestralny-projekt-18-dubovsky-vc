from neomodel import StructuredNode, StringProperty, RelationshipTo, RelationshipFrom, config, JSONProperty, \
    IntegerProperty, Relationship, ArrayProperty


# config with your own database user and password and database name

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
    # id = IntegerProperty(unique_index=True)
    name = StringProperty()
    fullpath = StringProperty()
    # metadata = JSONProperty()
    keywords = ArrayProperty(StringProperty())
    parent_directory = RelationshipTo('Directory', 'CONTAINS')

class File(StructuredNode):
    # id = IntegerProperty(unique_index=True)
    name = StringProperty()
    fullpath = StringProperty()
    # metadata = JSONProperty()
    extension = StringProperty()
    size = IntegerProperty()
    isbn = IntegerProperty()
    keywords = ArrayProperty(StringProperty())
    parent = RelationshipTo('Directory', 'CONTAINS')


class Word(StructuredNode):
    word = StringProperty(unique_index=True)
    files = Relationship('File', 'REFERS_TO')
    directories = Relationship('Directory', 'REFERS_TO')

