from sqlite3 import connect
from data.table import Table
from random import *
data = connect("tmp/data.db", isolation_level = None, check_same_thread=False)

users = Table(data, "users", "userID")
flip_book = Table(data,"flipbooks","bookID")


def get_userIDs():
    "retuns a list of usernames"
    return users.get_main_values()

def get_usernames():
    return users.get_field("username")
    #return users.get_value_list("username","?")

def user_exists(username):
    "returns true if user exists"
    return users.value_exists(username,"username")

def userID_exists(userID):
    return users.value_exists(userID,"userID")

def getUsernameByID(userID):
    return users.get_value(userID,"username")

def getIDbyUsername(username):
    return users.get_non_main_value("username",username,"userID")[0]

def correct_password(username, password):
    "returns true if username matches password"
    try:
        real_password = users.get_value(getIDbyUsername(username), "password")
        return password == real_password
    except:
        return False

def add_user(username, password):
    "adds a user with username and passsowrd"

    x = randint(0,1000)
    while(userID_exists(str(x))):
        x = randint(0, 1000)

    # while x in user_ID_list:
    #     x = randint(0, 1000)

    # user_ID_list.append(x)
    users.add_values([x, username, password])


def getBookIDs():
    return flip_book.get_main_values()

def getBookNameByID(bookID):
    return flip_book.get_value(bookID, "bookTitle")

def getBookAuthorByID(bookID):
    try:
        username = getUsernameByID(flip_book.get_value(bookID,"userID"))
        return username
    except:
        return ""

def getBook(bookID):
    return flip_book.get_value_list(bookID,"bookTitle")

def bookID_exists(bookID):
    return flip_book.value_exists(bookID, "bookID")

def bookTitle_exists(title):
    return flip_book.value_exists(title,"bookTitle")

def add_book(title,image_collection,username):
    "creates a book with the parameters"
    x = randint(0,1000)

    while(bookID_exists(str(x))):
        x = randint(0, 1000)
    
    flip_book.add_values([x, title, image_collection, username])
    set_book_drawings_byID(x,image_collection)

    return True

def match_book_owner(username,bookID):
    book_owner = flip_book.get_non_main_value("bookID",bookID,"username")[0]
    return book_owner == username

def match_book_owner_by_title(username,title):
    return match_book_owner(username,get_bookID_by_title(title))

def get_books_by_username(userID):
    return flip_book.get_search_list(userID, "bookTitle", "userID")


def get_bookID_by_title(title):
    return flip_book.get_non_main_value("bookTitle",title,"bookID")[0]

def get_book_drawings(title):
    return flip_book.get_non_main_value("bookTitle", title, "images")[0]


def set_book_drawings_byID(id, image_json):
    flip_book.set_value(id,"images",image_json)


def set_book_drawings_byTitle(title,image_json):
    set_book_drawings_byID(get_bookID_by_title(title),image_json)

def reset_data():
    "resets the database to empty user and story tables"
    open("tmp/data.db", "w").close()
    users.create(["userID", "username", "password" ])
    flip_book.create(["bookID", "bookTitle", "images", "userID"])
