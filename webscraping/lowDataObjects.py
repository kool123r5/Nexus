import json


with open("websiteScrapedDataVersionTwo.json", "r", encoding="utf-8") as f:
    dataset = json.load(f)

with open("activitiesListOG.json", "r") as f:
    activityList = json.load(f)

lowDataObjects = []

for obj in dataset:
    data = obj["data"]
    if len(data) < 4:
        for activity in activityList:
            if activity["ID"] == obj["id"]:
                obj["website"] = activity["website"]
        lowDataObjects.append(obj)

print(len(lowDataObjects))
with open("lowDataObj.json", "w") as f:
    json.dump(lowDataObjects, f, indent=4)
