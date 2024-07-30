import json
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from bs4 import BeautifulSoup
import requests
from backend.itemsTable import getItemID, insertItem
from dotenv import load_dotenv
import os
import time

load_dotenv()

private_key = os.getenv("XIVAPI_PRIVATE_KEY")

@api_view(['POST'])
@csrf_exempt
def temp(data):
    print("search")
    return HttpResponse(json.dumps({"message": "Hello, world!"}), content_type="application/json")

@csrf_exempt
def search(data):
    data = json.loads(data.body)
    itemName = data['name']
    resourceName = itemName
    quantity = int(data['quantity'])
    dataCenter = data['dataCenter']

    print(dataCenter)

    if 'value' in dataCenter:
        dataCenter = dataCenter['value']

    print("itemName: ", itemName)
    print("quantity: ", quantity)
    print("dataCenter: ", dataCenter)

    # Now make the url for the wiki
    itemName = itemName.replace(" ", "_")
    url = "https://ffxiv.consolegameswiki.com/wiki/" + itemName

    # Now time to scrape!

    wikiPage = requests.get(url)
    soup = BeautifulSoup(wikiPage.content, 'html.parser')

    rows = soup.find('table', class_='recipe sortable table jquery-tablesorter')

    if rows is None:
        return HttpResponse(json.dumps({"prices": []}), content_type="application/json")
    

    rows = rows[len(rows) - 1].find('tbody').find_all('tr')[1:]

    items = []
    quantity_checks = {}

    for row in rows:
        item_name_tags = row.find_all('td')
        item_name_tag = item_name_tags[0]
        quantity_check = item_name_tags[4]
        dts = quantity_check.find_all('dt')
        dds = quantity_check.find_all('dd')
        found = False

        temp = quantity_check.find('a', class_="mw-selflink selflink")
        
        ind = 0
        while ind < len(dds):
            if (str(dds[ind]).find(str(temp)) != -1):
                quantity_check = int(dts[ind].text)
                found = True
                break
            ind += 1

        if not found:
            continue

        if quantity < quantity_check:
            continue

        if item_name_tag is not None:
            item_name_tag = item_name_tag.find('a', title=True)
            item_name = item_name_tag['title']
            items.append(item_name)
            quantity_checks[item_name] = quantity_check

    ids = []
    item_id_convert = {}
    
    for itemName in items:
        itemID = getItemID(itemName) # attempt to find ID in internal data base

        if itemID is None: # attempt to find item ID using xivapi
            itemID = convertItemToID(itemName)
            insertItem(itemID, itemName)
            
        
        ids.append(itemID)

    for item, id in zip(items, ids):
        item_id_convert[id] = item
   
    mbData = getMarketData(ids, dataCenter)
    if (len(items) == 1):
        while 'itemID' not in mbData:
            time.sleep(3)
            mbData = getMarketData(ids, dataCenter)
    else:
        while 'itemIDs' not in mbData:
            time.sleep(3)
            mbData = getMarketData(ids, dataCenter)

    prices = []
    if len(items) == 1:
        prices = [{"itemName": items[0], "price": mbData['listings'][0]['pricePerUnit'], "quantity": quantity_checks[items[0]], "resource": resourceName.replace("_", " ")}]
        return HttpResponse(json.dumps({"prices": prices}), content_type="application/json")

    searchTable = mbData['items']
    for id in ids:
        price = 0
        try:
            if (len(searchTable[str(id)]['listings']) == 0):
                price = "N/A"
            else:
                price = searchTable[str(id)]['listings'][0]['pricePerUnit']
            prices.append({"itemName": item_id_convert[id], "price": price, "quantity": quantity_checks[item_id_convert[id]], "resource": resourceName.replace("_", " ")})
        except KeyError:
            continue

    return HttpResponse(json.dumps({"prices": prices}), content_type="application/json")

def convertItemToID(itemName):
    url = "https://xivapi.com/search?string="+  itemName + "&string_algo=match&indexes=Item&columns=ID&privatekey=" + private_key
    response = requests.get(url)
    response = response.json()['Results']
    if (len(response) > 1):
        print("Multiple items found for: ", itemName)
    return response[0]['ID']

def getMarketData(itemIDs, dataCenter):
    # TODO: get market data using Universalis and then return it!
    items = ""
    for id in itemIDs:
        items += str(id) + ","
    url = "https://universalis.app/api/v2/" + dataCenter + "/" + items + "?listings=1&entries=1"
    try:
        response = requests.get(url)
        print(response.status_code)
        return response.json()
    except:
        return {}