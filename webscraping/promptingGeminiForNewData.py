import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
import os
from dotenv import load_dotenv
import json

load_dotenv()
gemini_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=gemini_key)
model = genai.GenerativeModel(model_name="gemini-pro")

webscrapedDataFile = "websiteScrapedData.json" # "websiteDataPromptGemini.json"
with open(webscrapedDataFile, "r", encoding="utf-8") as f:
    websiteDatas = json.load(f)

with open("activities_augmented_withID.json", "r", encoding="utf-8") as f:
    activities = json.load(f)

json_objects = []

def get_object_by_id(json_list, id_number):
    for obj in json_list:
        if obj['id'] == id_number:
            return obj
    return None  

for i in range(3):
    activity = activities[i]
    tags = activity["tags"]
    title = activity["title"]
    text = activity["text"]
    website = activity["website"]   
    uniqueID = activity["ID"]
    websiteDataObject = get_object_by_id(websiteDatas, uniqueID)
    if not websiteDataObject:
        print("No match for: ", uniqueID)
        continue
    websiteData = websiteDataObject["data"]

    prompt = f"""
    This is some text data extracted from the website {website}. The title of the activity is {title}. 
    This is a brief description of the activity - {text}. 
    Tags: {", ".join(tags)}

    Now here is the website data we took from their website:

    """
    for data in websiteData:
        prompt += data + "\n"

    prompt += """
    From this data, I want you to give me a JSON object with these properties:
    inPerson: Boolean -> whether or not the activity is in person or whether it can be done online (true or false)
    location: String -> the location of where the activity is hosted (eg: Boston, MA or San Francisco, CA)
    anyoneCanJoin: Boolean -> whether or not anybody can join the activity or whether the activity selectively chooses from the applicants (eg: a research program might give false for this because not every applicant gets in, while an online hackathon might give true because every applicant can join and participate without any checks)
    host: String -> who is hosting this event (eg: a university name)
    startDate: String -> the date when the event starts (in format DD-MM-YYYY)
    endDate: String -> the date when the event ends (in format DD-MM-YYYY)
    deadlineDate: String -> the last date by which applicants can apply (in format DD-MM-YYYY)
    gradeRange: String -> the range of grades which are allowed (eg: 9-12 or 6-12)
    cost: Number -> the entry fee for the event (give 0 for this if the event is free of cost)

    If you can get any of this information from the tags then choose that information over the website data.
    Make sure your final object is JSON Parseable. If you are unsure about any of the fields (if insufficient data has been provided), then replace that field with the String of unknown, no matter what the type of the field is supposed to be.
    Before you give me the object, for each of these fields, write out your reasoning before you put them in the final data object, just so you can be sure you're getting it right. After you've written all your reasoning out, then state the final data object.
    

    
    """

    response = model.generate_content(
        prompt, 
        safety_settings= {
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_ONLY_HIGH
        },
        generation_config=genai.types.GenerationConfig(temperature=0.2)
    )
    start_index = response.text.index("{")
    end_index = response.text.index("}") + 1
    appendableJsonObject = response.text[start_index:end_index]
    bitToAddOn = f"\"title\": \"{title}\", \n \"text\": \"{text}\",\n\"tags\": \"{", ".join(tags)}\", \n\"website\":\"{website}\",\n \"ID\": {uniqueID},"
    appendableJsonObject = '{' + bitToAddOn + appendableJsonObject[1:]

    json_objects.append(appendableJsonObject)
    print("done with: ", uniqueID)


with open("database.json", "w") as f:
    # Iterate over each JSON object in the list
    for obj in json_objects:
        try:
            # Parse the JSON object string into a Python dictionary
            obj_dict = json.loads(obj)
            # Write the JSON object to the file with proper indentation
            f.write(json.dumps(obj_dict, indent=4) + "\n")
        except json.JSONDecodeError as e:
            print("Error decoding JSON:", e)