import re
import sqlite3 as sql
import json as js

def readItemsFromJson(filePath : str = "ItemsData/items.json") -> dict:
    """
    Reads a JSON file containing the item names and IDs and returns a python 
    dictionary with the IDs as keys and the cleaned english name as values. All formating
    tags are removed (e.g. <i> and </i>).This is formated to work with the pre-made 
    dump form Universalis REST API. 
    https://raw.githubusercontent.com/ffxiv-teamcraft/ffxiv-teamcraft/master/libs/data/src/lib/json/items.json

    Parameters
    -------------------------------------------------------------------
    filePath : str 
        Path to the JSON file with all the item IDs and Names. 

    Returns
    -------------------------------------------------------------------
    dict
        Dictionary containing the item ID as a key and the item name as a value. 
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
    filePath : str 
        Path to the JSON file with all the item IDs and Names. IDs with no item name 
        return an empty string as its value.

    Returns
    -------------------------------------------------------------------
    None
    """
    # TODO: Error handling
    db_Path = "../db.sqlite3" # update if the data base is moved
    
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
                cur.execute(f"INSERT INTO items VALUES {str(item)}")

            except sql.IntegrityError as e:
                # pattern to match champion certifications ("XXXX #### chamion certification")
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

    con.close()