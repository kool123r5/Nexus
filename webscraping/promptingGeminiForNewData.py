import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
import os
from dotenv import load_dotenv
import json

load_dotenv()
gemini_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=gemini_key)
model = genai.GenerativeModel(model_name="gemini-pro")

webscrapedDataFile = "websiteScrapedDataVersionTwo.json"  # "websiteDataPromptGemini.json"
with open(webscrapedDataFile, "r", encoding="utf-8") as f:
    websiteDatas = json.load(f)

with open("activitiesListOG.json", "r", encoding="utf-8") as f:
    activities = json.load(f)

json_objects = []


def get_object_by_id(json_list, id_number):
    for obj in json_list:
        if obj["id"] == id_number:
            return obj
    return None


for i in range(100,105):
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

        host: String -> The company/organization/college that is hosting/organizing this activity (eg: a university name)
        age: list -> this should be a list of integers, this list should contain all the ages that can do this activity. Make sure not to confuse grade and age, they are different. Feel free to leave this "unknown" if you can not find specific information abut the age. (eg: [14,15,16,17], or "unknown")
        selective: String -> If this activity has an application process in which applicants can be rejected then the activity is selective and should have the value "True". If everyone who applies can do the activity then it is not selective and should have the value "False".(eg: a research program might give false for this because not every applicant gets in, while an online hackathon might give true because every applicant can join and participate without any checks)
        mode: String -> This should be either "inPerson", "remote", or "hybrid". Depending on how the activity takes place. Note that activities  can be partially online and partially in person, in that case the activity is hybrid.
        cost: List -> The first index should be "True" if the activity costs money to participate in and "False" otherwise.Notice we are not using boolean instead using Strings. The second index should be the numerical cost of the activity to the participant. For example if the entree fee is 10 dollars then 10 should be the first index. If the activity is free then this value should be 0. The third index should be a string detailing which curency we are dealing with, so if it was US dollars then USD. This should be null if the activity is free. All in all cost could look like this ["True",10,"USD"]. Alternatively this could be "unknown" if you do not know if it is an activity with a cost.
        paid: List -> The first index should be "True" if by doing the activity the participant can EARN some money. Otherwise this should have a very similar structure to cost, the only difference is that this is regarding the participant actually earning money, either through stipends, salary or cash prizes. For example if the activity has a cash prize of 1000$ then an example of this could be ["True", 1000,USD]
        startDate: String -> the date when the event starts (in format DD-MM-YYYY)
        endDate: String -> the date when the event ends (in format DD-MM-YYYY)
        deadlineDate: String -> the last date by which applicants can apply (in format DD-MM-YYYY)
        address: String -> the location of where the activity is hosted. This should not be very specific instead only the city and state is fine. If it is not in the US then also mention the country.(eg: Boston, MA or San Francisco, CA)
        requirements: String -> Any requirements an applicant must have/do before participating. For example a requirement may be "Fill out an application" or "Be a US Citizen"
        gradeRange: List ->  A list of grades (numerical) that can participate in the activity for example [10,11].

        IMPORTANT- IF YOU CAN FIND ANY OF THIS INFORMATION UNDER Tags: THAN USE THAT DATA INSTEAD OF DATA FROM THE WEBSITE
        IMPORTANT- DO NOT INFER DATA FROM THE WEBSITE UNLESS YOU ARE MORE THAN 70% SURE THAT YOU KNOW THE CORRECT VALUE OF THE PROPERTY. "unknown" IS PREFERED OVER A RANDOM GUESS.
        Make sure your final object is JSON Parseable. If you are unsure about any of the fields (if insufficient data has been provided), then replace that field with the String of "unknown", no matter what the type of the field is supposed to be.
        Before you give me the object, for each of these fields, write out your reasoning before you put them in the final data object, just so you can be sure you're getting it right. After you've written all your reasoning out, then state the final data object.
        """

    response = model.generate_content(
        prompt,
        safety_settings={
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_ONLY_HIGH
        },
        generation_config=genai.types.GenerationConfig(temperature=0.13),
    )
    print(response.text)
    start_index = response.text.index("{")
    end_index = response.text.index("}") + 1
    json_objects.append(json.loads(response.text[start_index:end_index]))
    print("Done with: ", i)

    with open("extraData.json", "w") as f:
        f.write(json.dumps(json_objects))
