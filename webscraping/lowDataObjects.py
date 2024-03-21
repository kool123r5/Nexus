import json


with open('websiteScrapedDataVersionTwo.json', 'r', encoding='utf-8') as f:
    dataset = json.load(f)



lowDataObjects = []

for obj in dataset:
    data = obj["data"]
    if len(data) < 4:
        lowDataObjects.append(obj)

print(len(lowDataObjects))
with open("lowdataobj.json", "w") as f:
    json.dump(lowDataObjects, f, indent=4)