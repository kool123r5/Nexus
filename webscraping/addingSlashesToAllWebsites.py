import json


def addSlashToSite(website: str):
    if website[-1] != "/":
        new_website = website + "/"
        return new_website
    return website


array = []
with open("StandOutSearch_scraped.json", "r") as f:
    activities = json.load(f)

activity: dict
for activity in activities:
    new_site = addSlashToSite(activity["website"])
    activity.pop("website")
    activity["website"] = new_site
    array.append(activity)

with open("standOutSearchActivities.json", "w") as f:
    json.dump(array, f)
