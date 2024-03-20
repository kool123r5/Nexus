import json
from collections import OrderedDict
import re

def replace_unicode_escape(strings):
    replaced_strings = []
    for string in strings:
        replaced_string = re.sub(r'\\u([0-9a-fA-F]{4})', lambda m: chr(int(m.group(1), 16)), string)
        replaced_strings.append(replaced_string)
    return replaced_strings
    

def remove_duplicates_preserve_order(strings):
    seen = set()
    unique_strings = []
    for string in strings:
        if string not in seen:
            unique_strings.append(string)
            seen.add(string)
    return unique_strings


with open("websiteScrapedData.json", "r", encoding="utf-8") as f:
    data = json.load(f)

datawithoutDuplicates = []

for obj in data:
    idli = obj["id"]
    strippedData = replace_unicode_escape(remove_duplicates_preserve_order(obj["data"]))
    
    dataObject = {
        "id": idli,
        "data": strippedData
    }
    datawithoutDuplicates.append(dataObject)
    if idli%50 ==0:
        print("done with: ",idli)

with open("websiteScrapedDataVersionTwo.json", "w") as f:
    json.dump(datawithoutDuplicates, f, indent=4)