import json

with open("standOutSearchActivities2.json", "r") as f:
    activityList = json.load(f)

for activity in activityList:
    if type(activity["age"]) is str:
        print(activity["age"])
        if activity["age"] == "unknown":
            activity["age"] = []
        else:
            activity["age"] = [activity["age"]]

# with open("standOutSearchActivities2.json", "w") as f:
#     activityList = json.dump(activityList, f)
