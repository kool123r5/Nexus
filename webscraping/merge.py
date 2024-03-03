import json

with open('extraData.json', 'r', encoding='utf-8') as f:
    extraData = json.load(f)
with open('activities_augmented_withID.json', 'r', encoding='utf-8') as f:
    activities = json.load(f)

mergedList = []
def handle_duplicates(obj1, obj2):
    combined = {}
    for key, value in obj1.items():
        combined[key] = value
    for key, value in obj2.items():
        if key not in combined:
            combined[key] = value
    return combined


i = 0
while i < 2:
    if i == activities[i]["ID"] == extraData[i]["ID"]:
        obj = handle_duplicates(activities[i], extraData[i])
        mergedList.append(obj)
    i += 1

with open("trial.json", "w") as f:
    json.dump(mergedList, f, indent=4)

