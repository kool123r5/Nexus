import json


with open("StandOutSearch_scraped.json", "r", encoding="utf-8") as f:
    standOutActivities = json.load(f)
with open("activities_augmented_withID.json", "r", encoding="utf-8") as f:
    currentActivities = json.load(f)
hugelist = []
hugelist.extend(standOutActivities)
hugelist.extend(currentActivities)

mergedList = []


def isDuplicate(activity1, activity2):
    if (
        activity1["title"] == activity2["title"]
        or activity1["website"] == activity2["website"]
    ):
        return True
    return False


def merger(data1, data2):
    for obj1 in data1:
        flag = True
        for obj2 in data2:
            if isDuplicate(obj1, obj2):
                flag = False
                break

        if flag:
            mergedList.append(obj1)
    mergedList.extend(data2)


def addSlashToSiteAndRemoveAllParams(website: str):
    if website[-1] != "/":
        new_website = website + "/"
        return new_website
    return website
