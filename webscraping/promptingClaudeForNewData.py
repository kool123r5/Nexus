import anthropic
import os
from dotenv import load_dotenv
import json

load_dotenv()
anthropic_key = os.getenv("ANTHROPIC_API_KEY")

client = anthropic.Anthropic(
    api_key=anthropic_key,
)

webscrapedDataFile = "websiteScrapedData.json"  # "websiteDataPromptGemini.json"
with open(webscrapedDataFile, "r", encoding="utf-8") as f:
    websiteDatas = json.load(f)

with open("activities_augmented_withID.json", "r", encoding="utf-8") as f:
    activities = json.load(f)

json_objects = []


def get_object_by_id(json_list, id_number):
    for obj in json_list:
        if obj["id"] == id_number:
            return obj
    return None

start = 0
stop = len(activities)

for i in range(start,stop):
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
		Your task is to process data about an extra-curricular activity and return a JSON object.
		The title of the activity is: {title}. 
        These are tags about the acitivty: {", ".join(tags)}
        This is the website of the activity: {website}. 

        Now here is some data from the website it is delimited XML tags:
		<data>
        """
    for data in websiteData:
        prompt += data + "\n"

    prompt += """
		</data>
		<instructions>
        Using all the data available to you, create a JSON Object with the following properties:

        host: String -> The company/organization/college that is hosting/organizing this activity (eg: a university name)
        age: List -> this should be a list of integers, this list should contain all the ages that can do this activity. Make sure not to confuse grade and age, they are different. Feel free to leave this "unknown" if you can not find specific information abut the age. (eg: [14,15,16,17], or "unknown")
        selective: String -> If this activity has an application process in which applicants can be rejected then the activity is selective and should have the value "True". If everyone who applies can do the activity then it is not selective and should have the value "False".(eg: a research program might give false for this because not every applicant gets in, while an online hackathon might give true because every applicant can join and participate without any checks)
        mode: String -> This should be either "inPerson", "remote", or "hybrid". Depending on how the activity takes place. Note that activities  can be partially online and partially in person, in that case the activity is hybrid. So for example an online hackathon would be given the value "remote" while an oppurtunity to shadow a doctor at a hospital would be given the value "inPerson"
        cost: List -> The first index should be "True" if the activity costs money to participate in and "False" otherwise.Notice we are not using boolean instead using Strings. The second index should be the numerical cost of the activity to the participant. For example if the entree fee is 10 dollars then 10 should be the first index. If the activity is free then this value should be 0. The third index should be a string detailing which curency we are dealing with, so if it was US dollars then USD. This should be null if the activity is free. All in all cost could look like this ["True",10,"USD"]. Alternatively this could be "unknown" if you do not know if it is an activity with a cost.
        paid: List -> The first index should be "True" if by doing the activity the participant can EARN some money. Otherwise this should have a very similar structure to cost, the only difference is that this is regarding the participant actually earning money, either through stipends, salary or cash prizes. For example if the activity has a cash prize of 1000$ then an example of this could be ["True", 1000,USD]
        startDate: String -> the date when the activity starts (in format DD-MM-YYYY).You have flexibility here and if you dont find a specific date you are allowed to return this value as "Fall 2023" for example.Obviously making sure the data is still accurate.
        endDate: String -> the date when the activity ends (in format DD-MM-YYYY). You have flexibility here and if you dont find a specific date you are allowed to return this value as "Fall 2023" for example. Obviously making sure the data is still accurate.
        deadlineDate: String -> the last date by which applicants can apply (in format DD-MM-YYYY), you are allowed flexibility however and if you dont have a specific date you are allowed to return this value as "rolling" for example.
        location: String -> the location of where the activity is hosted. This should not be very specific instead only the city and state is fine. If it is not in the US then also mention the country.(eg: Boston, MA or San Francisco, CA)
        address: String -> This is the exact adress where the activity will be taking place. 
        requirements: String -> Any requirements an applicant must have/do before participating. For example a requirement may be "Fill out an application" or "Be a US Citizen"
        gradeRange: List ->  A list of grades (numerical) that can participate in the activity for example [10,11].

        IMPORTANT- IF you can find any of this information in Tags: THEN USE THAT DATA INSTEAD OF DATA FROM THE WEBSITE
        IMPORTANT- DO NOT INFER DATA FROM THE WEBSITE UNLESS YOU ARE SURE THAT YOU KNOW THE CORRECT VALUE OF THE PROPERTY. "unknown" IS PREFERED OVER A RANDOM GUESS. To make it clear- I value the accuracy of this data highly, so do not guess property values. Instead if you are unsure feel free to put down "unknown".
        Keep in mind that not all of the data from the website will be useful to you infact we think that a large portion of it will not be very useful in filling out the properties.
        Make sure your final object is JSON Parseable. If you are unsure about any of the fields (if insufficient data has been provided), then replace that field with the String of "unknown", no matter what the type of the field is supposed to be.
        Before you give me the object, for each of these fields, write out your reasoning before you put them in the final data object, just so you can be sure you're getting it right. After you've written all your reasoning out, then state the final data object. While writing out your reasoning quote the part or parts of the data that lead you to believe why a certain property should have a certain value.
        </instructions>
        Delimited by the XML tags are 3 examples of well formated JSON Objects that you can refer to.
        
        <examples>
                {
				    "host": "National Council for Historic Education",
				    "age": "unknown",
				    "selective": "True",
				    "mode": "remote",
				    "cost": ["True", "unknown", "unknown"],
				    "paid": ["False", 0, "unknown"],
				    "startDate": "Winter 2024",
				    "endDate": "unknown",
				    "deadlineDate": "13-07-2024",
				    "location": "Boston, MA",
				    "address": "unknown",
				    "requirements": "unknown",
				    "gradeRange": [9, 10, 11, 12]
				  },
				  {
				    "host": "The Association of Fine Arts",
				    "age": [14,15,16,17,18],
				    "selective": "False",
				    "mode": "inPerson",
				    "cost": "unknown",
				    "paid": ["False",0,"unknown"],
				    "startDate": "28-01-2023",
				    "endDate": "20-02-2023",
				    "deadlineDate": "20-01-2023",
				    "location": "Dubai, UAE",
				    "address": "MAG 218, Marina",
				    "requirements": "Submit a portofolio of your art projects",
				    "gradeRange": [8,9,10,11,12]
				  },
				  {
				    "host": "Martial Arts Academy (MAA)",
				    "age": [14, 15, 16, 17, 18],
				    "selective": "True",
				    "mode": "hybrid",
				    "cost": ["True", 200, "USD"],
				    "paid": ["False", 0, "unkown"],
				    "startDate": "01-05-2024",
				    "endDate": "unknown",
				    "deadlineDate": "Rolling",
				    "location" : "online and in-person at various locations",
				    "address": "unknown",
				    "requirements": "Teams must have a team director who is an adult individual who will act as the coach for the team throughout the season.",
				    "gradeRange": "unknown"
				  }
        </examples>
        
        
        """

    message = client.messages.create(
        # claude-3-haiku-20240307 (cheapest) && claude-3-sonnet-20240229 (cheaper) && claude-3-opus-20240229 (smartest)
        model="claude-3-haiku-20240307",
        max_tokens=1024,
        temperature=0.2,  # feel free to change temp, i haven't empirically tested this
        messages=[{"role": "user", "content": prompt}],
    )
    response = message.content[0].text
    start_index = response.index("{")
    end_index = response.index("}") + 1
    print(response)
    json_objects.append(json.loads(response[start_index:end_index]))
    print("Done with: ", i)

    with open("extraDataClaudeHaiku.json", "w") as f:
        f.write(json.dumps(json_objects))
