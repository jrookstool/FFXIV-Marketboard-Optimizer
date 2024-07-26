import json
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from bs4 import BeautifulSoup
import requests

@api_view(['POST'])
@csrf_exempt
def temp(data):
    print("search")
    return HttpResponse(json.dumps({"message": "Hello, world!"}), content_type="application/json")

@csrf_exempt
def search(data):
    data = json.loads(data.body)
    itemName = data['name']
    quantity = int(data['quantity'])

    print("itemName: ", itemName)
    print("quantity: ", quantity)

    # Now make the url for the wiki
    itemName = itemName.replace(" ", "_")
    url = "https://ffxiv.consolegameswiki.com/wiki/" + itemName

    # Now time to scrape!

    wikiPage = requests.get(url)
    soup = BeautifulSoup(wikiPage.content, 'html.parser')

    rows = soup.find_all('table')
    rows = rows[:len(rows) - 1]

    rows = rows[len(rows) - 1].find('tbody').find_all('tr')[1:]

    items = []

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

    ids = []
        
    for item in items:
        ids.append(convertItemToID(item))
    
    print(ids)

    return HttpResponse(json.dumps({"items": items}), content_type="application/json")

def convertItemToID(itemName):
    url = "https://xivapi.com/search?string=" + itemName + "&indexes=Item&columns=ID"
    response = requests.get(url)
    response = response.json()['Results']
    return response[0]['ID']

def getMarketData(itemID):
    # TODO: get market data using Universalis and then return it!
    pass