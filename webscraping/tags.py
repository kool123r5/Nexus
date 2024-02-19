import json

with open('activitiesAugmented.json', 'r', encoding='utf-8') as f:
    activites = json.load(f)

listtags = []

for activity in activites:
    for tag in activity["tags"]:
        if not (tag in listtags):
            listtags.append(tag)



listtags.sort()
listtags.remove('')
list


#um ignore this file its not very useful. but what it does do is give ua  list of tags from a json file of activities


output = ""

for tag in listtags:
    output += f'<Interest\n\
                                            text={{"{tag}"}}\n\
                                            interests={{interests}}\n\
                                            setInterests={{setInterests}}\n\
                                            isInInterestsPreviously={{interests.includes("{tag}")}}\n\
 />\n'

print(listtags)