"""


StandoutSearch
- description
- tags
- requirements
- cost - Without LLM (just RE)
Snowday
- desription
- tags
- requirements
- cost - with LLM to set internal prices
Snowday competitions
- requirements
Response data
- description
- requirements
- tags
- cost

Description:
- reword the description of snowday events using LLM to avoid plagirism issues
Tags
- remove all tags on current cards
- add tags based only on a specified list of tags that Ayaan made
- add umbrella tag functionality (eg: if it contains a sub tag like phy, then STEM automaticlaly gets added, this allows people to search with broader filters)
Requirements:
- change language to be more formal and refer to applicants
- remove information about age from requirements
- if find any information in demographics add it to requirements
Cost
- store data in a list of four [str, boolean, int]
- str is displayed to users 
- boolean helps us filter (filter for paid)
- int is the total cost in US dollars
- int helps us with potential sorting functions (sort by most costly or least costly)


Datasets:
1. snowdata
2. standoutsearch
3. responses
4. snowdata competition

Manipulations
- description changing - should happen to all activity
- tags - add tags from a predfined list of tags - for all activities
- requirements - formalize and standardize - for all activities - for snowday we have to extract information about age and grades from requirements
- Requirements is sensitive and the same approach wont work for multiple things
- updating description is also sensitive
- 
"""
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
import os
from dotenv import load_dotenv
import json
import time

load_dotenv()
gemini_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=gemini_key)
model = genai.GenerativeModel(model_name="gemini-pro")

betterTags = [
    "Physics", "Chemistry", "Biology", "Law", "Art/Design", "Engineering",
    "Business", "Economics", "Computer Science", "Environmental Science",
    "History", "Government/Politics", "Mathematics", "STEM", "Astronomy",
    "Social Science", "Music", "Medicine", "Robotics", "Debate", "Literature",
    "Graphic Design", "Journalism", "Game Development", "Health Sciences",
    "Fashion", "Architecture", "Photography/Videography", "Marketing/Advertising",
    "Finance", "Agriculture", "Aviation/Aerospace", "Foreign Languages",
    "Entrepreneurship", "Leadership/Management", "International Studies/Global Affairs",
    "Performing Arts", "Sports", "Creative Writing", "Public Speaking",
    "Model United Nations (MUN)", "Coding/Programming", "Web Development",
    "App Development", "Cybersecurity", "Data Science", "Artificial Intelligence (AI)",
    "Culinary Arts", "Theatre/Drama", "Film/Cinema", "Animation", "Dance",
     "Tutoring", "Mentoring", "Environmental Activism",
    "Mental Health Awareness", "LGBTQ+ Advocacy", "Diversity and Inclusion",
    "Cultural Clubs", "Board Games/Chess",
    "E-Sports/Gaming", "Media/Broadcasting", "Podcasting", "Student Government",
     "Visual Arts", "Performing Arts", "Business and Entrepreneurship", "Social Sciences and Humanities"
]
umbrella_tags = [
    ["Visual Arts", "Art/Design", "Graphic Design", "Photography/Videography", "Animation"],
    ["Performing Arts", "Music", "Theatre/Drama", "Dance"],
    ["STEM", "Physics", "Chemistry", "Biology", "Engineering", "Computer Science", "Environmental Science", "Mathematics", "Astronomy", "Robotics", "Game Development", "Coding/Programming", "Web Development", "App Development", "Cybersecurity", "Data Science", "Artificial Intelligence (AI)"],
    ["Business and Entrepreneurship", "Business", "Economics", "Marketing/Advertising", "Finance", "Entrepreneurship", "Leadership/Management"],
    ["Social Sciences and Humanities", "Law", "History", "Government/Politics", "Social Science", "Literature", "International Studies/Global Affairs", "Public Speaking", "Model United Nations (MUN)", "Debate", "Journalism"],
    ["Health and Life Sciences", "Medicine", "Health Sciences", "Culinary Arts", "Agriculture"],
    ["Technology", "Computer Science", "Robotics", "Game Development", "Coding/Programming", "Web Development", "App Development", "Cybersecurity", "Data Science", "Artificial Intelligence (AI)"],
    ["Creative Arts", "Art/Design", "Graphic Design", "Photography/Videography", "Animation", "Creative Writing", "Film/Cinema", "Theatre/Drama", "Dance", "Music"],
    ["Advocacy and Service", "Community Service", "Volunteering", "Tutoring", "Mentoring", "Environmental Activism", "Mental Health Awareness", "LGBTQ+ Advocacy", "Diversity and Inclusion"],
    ["Sports and Recreation", "Sports", "Outdoor Activities/Adventure Sports", "Board Games/Chess", "E-Sports/Gaming"],
    ["Media and Communications", "Journalism", "Media/Broadcasting", "Podcasting", "Yearbook/School Publications"],
    ["Student Leadership", "Student Government", "Leadership/Management"],
    ["Multidisciplinary", "Fashion", "Architecture", "Aviation/Aerospace", "Foreign Languages"]
]

def loadFile(nameOfFile):
    with open(nameOfFile, "r", encoding="utf-8") as f:
        a = json.load(f)
    return a

def generateResponse(prompt):
    response = model.generate_content(
    prompt,
    safety_settings={
        HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_ONLY_HIGH
    },
    generation_config=genai.types.GenerationConfig(temperature=0.15),
    )
    return response



snowDayOG = loadFile('snowData.json')
standOutSearchOG = loadFile('standOutSearchActivities.json')
responseDataOG = loadFile('responseData.json')
snowDayCompetitionOG = loadFile('accumulatedsnowdayCompetitions.json')


snowDayCompetitionProcessed = []

def updateDescription(activityList, updatedList):
    counter = 0
    for activity in activityList:
        counter += 1
        title = activity["title"]
        text = activity["text"]

        prompt = f"""

            Activity Title: {title}
            Original Description: {text}

            Your task is to rewrite the original description of this extracurricular activity in your OWN WORDS,
            while preserving the essential information and capturing the spirit of the activity. Your rewritten description should be concise, engaging,
            and easy to understand for high school students. Your description  should be short, not more than a paragraph.

            Please ONLY provide your re-written description in your response. This means no additional fluff such as "Sure I can do this task ..."
        """

        response = generateResponse(prompt)
        text = response.text
        activity["Updated text"] = text
        updatedList.append(activity)
        print(f"{counter} -Done with {title}")
        time.sleep(1)
    return updatedList

snowDayProcessed = updateDescription(snowDayOG, [])
dumpData("snowDayProcessed.json", snowDayProcessed)

standOutSearchProcessed = updateDescription(standOutSearchOG, [])
dumpData("SOSProcessed.json", standOutSearchProcessed)

responseDataProcessed = updateDescription(responseDataOG, [])
dumpData("responseProcessed.json", responseDataProcessed)

#ALL DESCRIPTIONS RE-WRITTEN
def dumpData(filename, data):
    with open(filename, "w") as f:
        f.write(json.dumps(data))
