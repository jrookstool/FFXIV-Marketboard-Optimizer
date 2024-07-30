import re
import sqlite3 as sql
import json as js
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse

db_Path = "db.sqlite3" # update if the data base is moved or if testing code 

def readItemsFromJson(filePath : str = "ItemsData/items.json") -> dict:
    """
    Reads a JSON file containing the item names and IDs and returns a python 
    dictionary with the IDs as keys and the cleaned english name as values. All formating
    tags are removed (e.g. <i> and </i>).This is formated to work with the pre-made 
    dump form Universalis REST API. 
    https://raw.githubusercontent.com/ffxiv-teamcraft/ffxiv-teamcraft/master/libs/data/src/lib/json/items.json

    Parameters
    -------------------------------------------------------------------
    filePath : str (optional)
        Path to the JSON file with all the item IDs and Names. If not specified, the path to the default 
        location of the items.json file. 

    Returns
    -------------------------------------------------------------------
    dict
        Dictionary containing the item ID as a key and the item name as a value. IDs with 
        no item name have an empty string as its value.
    """
    # TODO: Error handling
    with open("ItemsData/items.json") as itemData:
        items = js.load(itemData)

        for id, name in items.items():
            engName = name['en'].lower()
            cleanName = re.sub('</?[^>]*>', '', engName) # remove tags
            items[id] = cleanName # only keep the english name

        return items


def createItemTableFromJson(filePath : str = "ItemsData/items.json") -> None:
    """
    Creates a table in the sqlite database for the items and their IDs.
    This is formated to work with the pre-made dump form Universalis REST API. 
    https://raw.githubusercontent.com/ffxiv-teamcraft/ffxiv-teamcraft/master/libs/data/src/lib/json/items.json

    Parameters
    -------------------------------------------------------------------
    filePath : str (optional)
        Path to the JSON file with all the item IDs and Names. If not specified, 
        the path to the default location of the items.json file. 

    Returns
    -------------------------------------------------------------------
    None
    """
    # TODO: Error handling
    
    con = sql.connect(db_Path) 
    cur = con.cursor()

    # table creation
    cur.execute("""
        CREATE TABLE items(
                ID integer,
                Name text primary key
                )
        """)
    
    itemTableData = readItemsFromJson(filePath)

    for item in itemTableData.items():
        if item[1] != "":
            try:
                cur.execute("INSERT INTO items VALUES (?, ?)", item)

            except sql.IntegrityError as e:
                # pattern to match champion certifications ("XXXX #### champion certification")
                pattern = re.compile("[A-Za-z]+\s\d+\schampion\scertification")
                isMacth = re.fullmatch(pattern, item[1])
                if isMacth:
                    errMsg = "IntegrityError: The item name is already registerd in the data base.\n" + \
                            f'Looks like "{item[1]}" is an already existing champion certificate in ' + \
                            "the data base, this new entry will be ignored."
                    print(errMsg)
                else: 
                    # if not a champion certificate print the error
                    print(e)
                continue
            except Exception as e:
                print(item)
                con.close()
                print(e)
                break
    con.commit()
    con.close()


def getItemID(itemName : str ) -> int:
    """
    Queries the internal data base to retrieve the ID of the gien item.
    
    Parameters
    -------------------------------------------------------------------
    itemName : str 
        English name of the item. 

    Returns
    -------------------------------------------------------------------
    int 
        integer representing the ID of the given item name. 
    """
    #TODO: error handling
    con = sql.connect(db_Path)
    cur = con.cursor()

    itemName = itemName.lower() # lower case needed to ensure a match in the data base

    query = cur.execute("SELECT id FROM items WHERE name = ?", (itemName,))
    id = query.fetchone()

    con.close()

    if id is not None:
        id = id[0]

    return id

def insertItem(itemID : int, itemName : str) -> None:
    """
    Queries the internal data base to insert a new item into the data base.
    
    Parameters
    -------------------------------------------------------------------
    itemID : int 
        ID for the item being added to the data base. 
    itemName : str 
        English name of the item added to the data base. 

    Returns
    -------------------------------------------------------------------
    None
    """
    # TODO: error handling (duplicate items, etc. )
    con = sql.connect(db_Path)
    cur = con.cursor()

    itemName = itemName.lower() # preparing item name for insertion
    item = (itemID, itemName)

    cur.execute("INSERT INTO items VALUES (?, ?)", item)
    
    con.commit()
    con.close()

@csrf_exempt
def getAllItems(temp) -> list:
    """
    Queries the internal data base to retrieve all the items in the data base.
    
    Parameters
    -------------------------------------------------------------------
    None

    Returns
    -------------------------------------------------------------------
    list
        List of all the items in the data base. 
    """

    con = sql.connect(db_Path)
    cur = con.cursor()

    query = cur.execute("SELECT name FROM items")
    items = query.fetchall()

    con.close()

    return HttpResponse(js.dumps(items), content_type="application/json")