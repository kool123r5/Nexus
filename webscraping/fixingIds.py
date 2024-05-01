import json

with open("cleanedActivityData.json", "r+") as f:
    data = json.load(f)

for i in range(1, len(data) + 1):
    data[i - 1]["id"] = i

with open("activityData.json", "w+") as f:
    data = json.dump(data, f)
