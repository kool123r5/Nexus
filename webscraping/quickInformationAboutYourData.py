"""
README:

TO GET SOME QUICK INFORMATION REGARDING YOUR DATA DO THIS
1) OPEN TERMINAL
2) NAVIGATE TO \WEBSCRAPING (PROBABLY USE cd webscraping)
3) Use command python -i quickInformationAboutYourData.py
4) enter run(yourNameData) for example: run(arjunData)
"""

import json

with open("websiteScrapedDataPartAnish.json", "r", encoding="utf-8") as f:
    anishData = json.load(f)
with open("websiteScrapedDataPartKushal.json", "r", encoding="utf-8") as f:
    kushalData = json.load(f)
with open("websiteScrapedDataPartArjun.json", "r", encoding="utf-8") as f:
    arjunData = json.load(f)

# This function is now redundant because of changes in gettingExtraData.js
# def remove_duplicates_preserve_order(strings):
    # seen = set()
    # unique_strings = []
    # for string in strings:
    #     if string not in seen:
    #         unique_strings.append(string)
    #         seen.add(string)
    # return unique_strings 

def lenther(file):
    print("length of file: ", len(file))
    return len(file)
def lowObjects(file):
    lowObjs = []
    for obj in file:
        if len(obj["data"]) < 4:
            lowObjs.append(obj["id"])
    amt = len(lowObjs)
    print(amt, " of your activites had \"low\" amounts of data (3 or less strings). They were: ", lowObjs)
    return amt
def listBuggyNumbers(file):

    buggyNumbers = []
    i = 0
    for obj in file:
        if obj["id"] != i:
            buggyNumbers.append(i)
            i += 1
        i += 1
    amt = len(buggyNumbers)
    print(amt, " of your activites were buggy (you did not collect any data on them whatsoever). They were: ", buggyNumbers)
    return amt
def run(file):
    lent = lenther(file)
    amtLow = lowObjects(file)
    amtBug = listBuggyNumbers(file)
    totalAccuracy = (lent- amtLow)/ (lent + amtBug) *100
    lowPercentage = (amtLow/ lent )* 100
    bugPercentage = (amtBug/ lent )*100

    print("Overal: ", totalAccuracy, " percent of your data was extracted well (so there werent any bugs and there was atleast 4 strings in their data property);\n", lowPercentage, " percent of your data had low amounts of data;\n", bugPercentage, " percent of the data you could have captured was not captured.")
    print("Thank you for taking the time and effort to run gettingExtraData.js, we think the data you have helped collect will be very useful in catologing atleast 100 activites for highschoolers.")