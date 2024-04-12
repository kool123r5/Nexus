import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
import os
from dotenv import load_dotenv
import json
import time

# load_dotenv()
# gemini_key = os.getenv("GEMINI_API_KEY")
# genai.configure(api_key=gemini_key)
# model = genai.GenerativeModel(model_name="gemini-pro")


webscrapedDataFile = "accumulatedsnowdayCompetitions.json"  
with open(webscrapedDataFile, "r", encoding="utf-8") as f:
    activities = json.load(f)
json_objects = []
for activity in activities:
    activity["id"] = activity["id"] + 1000000
    json_objects.append(activity)
with open("accumulatedsnowdayCompetitions.json", "w") as f:
    f.write(json.dumps(json_objects))

# json_objects = []

# start = 0
# stop = len(activities)



# for i in range(start,stop):
#     activity = activities[i]
#     title = activity["Competition"]
#     text = activity["Description"]
#     numberOfCompetitors = activity["Number of Competitors"]
#     competitorType = activity["Competitor Type"]
#     requirements = activity["How to Join"]
#     cost = activity["Cost to Join"]
#     website = activity["Website"]

#     prompt = f"""
#         <instructions>
#         This is a task regarding competitions for highschoolers
#         In your own words, write a short description (around 100 words) of an high school extra-curricular activity.
#         Keep your description accurate and objective.
#         Please only output the description of this activity, do not give any fluff or irrelevant text. 
#         </instructions>

#         <information>
#         Here is some information
#         The title of the activity is: {title} 
#         Here is some text about the activity: {text} 
#         Here is the number of competitors {website} 
#         </information>

#         """

#     response = model.generate_content(
#         prompt,
#         safety_settings={
#             HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_ONLY_HIGH
#         },
#         generation_config=genai.types.GenerationConfig(temperature=0.13),
#     )
#     print(response.text)
#     text = response.text

#     if cost == "No":
#         cost == [False, 0, "unknown"]
#     else:
#         cost == [True, "unknown", "unknown"]
#     activity = {
#         "title": title,
#         "text": text,
#         "tags": [],
#         "website": website,
#         "mode":"unknown",
#         "location":"unknown",
#         "address":"unknown",
#         "selective":"unknown",
#         "demographics":[],
#         "host":"unknown",
#         "gradeRange":[],
#         "age":[],
#         "cost": cost,
#         "paid":"unknown",
#         "type":["Competition"],
#         "startDate":"unknown",
#         "endDate":"unknown",
#         "deadline":"unknown",
#         "requirements": requirements,
#         "manual": False,
#         "duration": "unknown",
#         "id": i,
    

#     }
 
#     json_objects.append(activity)
#     print("Done with: ", i)
#     time.sleep(1)

#     with open("accumulatedsnowdayCompetitions.json", "w") as f:
#         f.write(json.dumps(json_objects))
