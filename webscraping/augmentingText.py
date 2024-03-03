import google.generativeai as genai
import os
from dotenv import load_dotenv
import json
#important: if you get No such file or directory: 'ecListMerged.json' Error. then run this through terminal
# cd webscraping
# python augmentingText.py 
# the above lines should work 
#print("done importing")
#load_dotenv()
#gemini_key = os.getenv("GEMINI_API_KEY") #gets a secret key from my environemnt (which github ignores)
#genai.configure(api_key=gemini_key)
#model = genai.GenerativeModel(model_name="gemini-pro")
#curr_json_obj = []

#print("configured model")
with open('activitiesAugmented.json', 'r', encoding='utf-8') as f: #loads the webscraped json file
    activities = json.load(f)

print("loaded json")

for i in range(495): #iterates through almost 500 activites to augment each individually
    try:
        
        activities[i]["ID"] = i
        if i%20 == 0:
            print(i, " out of 495 activities completed") #checks progress
    except:
        print("An error occured, continuing")
        i = i-1

# After iterating, save the updated list to a new JSON file
with open("activities_augmented_withID.json", "w") as f:
    json.dump(activities, f, indent=4)

print("Augmentation complete! Check the activities_augmented.json file.")
