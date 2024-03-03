# load array from json file and store it as a variable
# create a function that iterates through each item in the two arrays
# this function has to work like this
# take item i from array one, iterate through array 2 to check for matches (define isduplicate)
# if there is a match, remove the item from array 2 and add 1 to a deleted counter
# then add item i from array one to array three (output array)
# iterate for each item in array one

import json


# getting the data
with open("ecListIlluminate.json", "r", encoding="utf-8") as f:
    Illuminate = json.load(f)
with open("ecListFindECs.json", "r", encoding="utf-8") as f:
    FindECs = json.load(f)
hugelist = []
hugelist.extend(Illuminate)
hugelist.extend(FindECs)

mergedList = []


def isDuplicate(activity1, activity2):
    # takes in 2 json objects (activities) and returns true if either the title match or the website matches
    if (
        activity1["title"] == activity2["title"]
        or activity1["website"] == activity2["website"]
    ):
        return True
    return False


# need code to load the array from json file and store it somehow? hopefully as a python variable
def merger(data1, data2):
    # important that data2 is Illumiante as this gets preferential treatment
    for obj1 in data1:
        flag = True
        for obj2 in data2:
            if isDuplicate(obj1, obj2):
                flag = False
                break
                # flag it so that I know this item is not to be trusted

        # add object1 to the list?
        if flag:
            mergedList.append(obj1)

    # now i just need to add the entirety of data2 to merged list
    mergedList.extend(data2)


merger(FindECs, Illuminate)
print(len(mergedList))
deleted = len(hugelist) - len(mergedList)
print(deleted)
print(len)
# with open("ecListMerged.json", "w") as f:
# json.dump(mergedList, f, indent=4)
