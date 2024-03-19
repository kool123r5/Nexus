import json


with open("standOutSearchActivities.json", "r", encoding="utf-8") as f:
    standOutActivities = json.load(f)
with open("activitiesListOG.json", "r", encoding="utf-8") as f:
    currentActivities = json.load(f)


def isDuplicate(activity1, activity2):
    if (
        activity1["title"].lower() == activity2["title"].lower()
        or activity1["website"] == activity2["website"]
        or activity1["website"] in activity2["website"]
        or activity2["website"] in activity1["website"]
    ):
        return True
    return False


mergedList = []


# the first array is preferred here
def merger(data1, data2):
    mergedList.extend(data1)

    for obj2 in data2:
        is_duplicate = False
        for obj1 in mergedList:
            if isDuplicate(obj1, obj2):
                is_duplicate = True
                break
        if not is_duplicate:
            mergedList.append(obj2)


merger(standOutActivities, currentActivities)
print(len(mergedList))
deleted = len(currentActivities) + len(standOutActivities) - len(mergedList)
print(deleted)


def postProcessing():
    for index, activity in enumerate(mergedList):
        activity.pop("ID")
        activity["id"] = index


postProcessing()


with open("ecListMerged.json", "w") as f:
    json.dump(mergedList, f)
