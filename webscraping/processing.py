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
    "Physics",
    "Chemistry",
    "Biology",
    "Law",
    "Art/Design",
    "Engineering",
    "Business",
    "Economics",
    "Computer Science",
    "Environmental Science",
    "History",
    "Government/Politics",
    "Mathematics",
    "STEM",
    "Astronomy",
    "Social Science",
    "Music",
    "Medicine",
    "Robotics",
    "Debate",
    "Literature",
    "Graphic Design",
    "Journalism",
    "Game Development",
    "Health Sciences",
    "Fashion",
    "Architecture",
    "Photography/Videography",
    "Marketing/Advertising",
    "Finance",
    "Agriculture",
    "Aviation/Aerospace",
    "Foreign Languages",
    "Entrepreneurship",
    "Leadership/Management",
    "International Studies/Global Affairs",
    "Performing Arts",
    "Sports",
    "Creative Writing",
    "Public Speaking",
    "Model United Nations (MUN)",
    "Coding/Programming",
    "Web Development",
    "App Development",
    "Cybersecurity",
    "Data Science",
    "Artificial Intelligence (AI)",
    "Culinary Arts",
    "Theatre/Drama",
    "Film/Cinema",
    "Animation",
    "Dance",
    "Tutoring",
    "Mentoring",
    "Environmental Activism",
    "Mental Health Awareness",
    "LGBTQ+ Advocacy",
    "Diversity and Inclusion",
    "Cultural Clubs",
    "Board Games/Chess",
    "E-Sports/Gaming",
    "Media/Broadcasting",
    "Podcasting",
    "Student Government",
    "Visual Arts",
    "Performing Arts",
    "Business and Entrepreneurship",
    "Social Sciences and Humanities",
]
umbrella_tags = [
    [
        "Visual Arts",
        "Art/Design",
        "Graphic Design",
        "Photography/Videography",
        "Animation",
    ],
    ["Performing Arts", "Music", "Theatre/Drama", "Dance"],
    [
        "STEM",
        "Physics",
        "Chemistry",
        "Biology",
        "Engineering",
        "Computer Science",
        "Environmental Science",
        "Mathematics",
        "Astronomy",
        "Robotics",
        "Game Development",
        "Coding/Programming",
        "Web Development",
        "App Development",
        "Cybersecurity",
        "Data Science",
        "Artificial Intelligence (AI)",
    ],
    [
        "Business and Entrepreneurship",
        "Business",
        "Economics",
        "Marketing/Advertising",
        "Finance",
        "Entrepreneurship",
        "Leadership/Management",
    ],
    [
        "Social Sciences and Humanities",
        "Law",
        "History",
        "Government/Politics",
        "Social Science",
        "Literature",
        "International Studies/Global Affairs",
        "Public Speaking",
        "Model United Nations (MUN)",
        "Debate",
        "Journalism",
    ],
    [
        "Health and Life Sciences",
        "Medicine",
        "Health Sciences",
        "Culinary Arts",
        "Agriculture",
    ],
    [
        "Technology",
        "Computer Science",
        "Robotics",
        "Game Development",
        "Coding/Programming",
        "Web Development",
        "App Development",
        "Cybersecurity",
        "Data Science",
        "Artificial Intelligence (AI)",
    ],
    [
        "Creative Arts",
        "Art/Design",
        "Graphic Design",
        "Photography/Videography",
        "Animation",
        "Creative Writing",
        "Film/Cinema",
        "Theatre/Drama",
        "Dance",
        "Music",
    ],
    [
        "Advocacy and Service",
        "Community Service",
        "Volunteering",
        "Tutoring",
        "Mentoring",
        "Environmental Activism",
        "Mental Health Awareness",
        "LGBTQ+ Advocacy",
        "Diversity and Inclusion",
    ],
    [
        "Sports and Recreation",
        "Sports",
        "Outdoor Activities/Adventure Sports",
        "Board Games/Chess",
        "E-Sports/Gaming",
    ],
    [
        "Media and Communications",
        "Journalism",
        "Media/Broadcasting",
        "Podcasting",
        "Yearbook/School Publications",
    ],
    ["Student Leadership", "Student Government", "Leadership/Management"],
    [
        "Multidisciplinary",
        "Fashion",
        "Architecture",
        "Aviation/Aerospace",
        "Foreign Languages",
    ],
]


def loadFile(nameOfFile):
    with open(nameOfFile, "r", encoding="utf-8") as f:
        a = json.load(f)
    return a


def dumpData(filename, data):
    with open(filename, "w") as f:
        f.write(json.dumps(data))


def generateResponse(prompt):
    response = model.generate_content(
        prompt,
        safety_settings=[
            {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_NONE",
            },
            {
                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "threshold": "BLOCK_NONE",
            },
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_NONE",
            },
        ],
        generation_config=genai.types.GenerationConfig(temperature=0.15),
    )
    return response


# loading all files as variables
data = loadFile("merged_file.json")
f = loadFile("data.json")


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
            while preserving the essential information and capturing the spirit of the activity. Your rewritten description should be concise
            and easy to understand for high school students. Your description  should be short, around 1- 2 paragraphs.

            Write with an objective, accurate tone. This means you shouldnt use catch phrases such as "Calling all stem students!" Your response
            shouldnt read like an advertisement.

            Please ONLY provide your re-written description in your response. This means no additional fluff such as "Sure I can do this task ..."
        """

        response = generateResponse(prompt)
        text = response.text
        activity["Updated text"] = text
        updatedList.append(activity)
        print(f"{counter} -Done with {title}")
        time.sleep(1)
    return updatedList


# ALL DESCRIPTIONS RE-WRITTEN


def updateTags(activityList, updatedList, placeToDump, index=0):
    counter = 0
    for i in range(index, len(activityList)):
        try:
            activity = activityList[i]
            counter += 1
            title = activity["title"]
            text = activity["text"]
            # tags = activity["tags"]

            prompt = f"""
                
                <instructions>
                Based on certain data about an activity, choose tags from a pre-written list of tags that apply to that activity and return it to me.

                I will provide you with four pieces of information:
                1) The title of the activity
                2) The description of the activity
                3) The tags that are currently associated with the activity if any
                4) A list of tags from which you are allowed to choose new tags to assign to the activity

                MAKE SURE TO ONLY CHOOSE TAGS FROM THE LIST I PROVIDE YOU. Provide reasoning for why you have chosen your tag
                and then include the new set of tags as a python list of strings.
                </instructions>

                <information>
                Title: {title}
                Description: {text}
                There are no tags currently associated with this activity
                List of tags you can choose from: {betterTags}
                </information>


                <example response>
                Here is an example response:

                Reasoning: The description indicates that this is a youth volunteer program with the American Red Cross, which is a major humanitarian organization. The volunteers develop leadership skills, work with diverse communities, and drive positive change through service. While the Red Cross is involved in medical services during emergencies, this program seems to be more focused on general community service, volunteering, and developing skills like leadership. Therefore, the "Leadership/Management" and "Volunteer Work/Community Service" tags would be appropriate. The "Medicine" tag is not as relevant based on the description.

                New set of tags: ["Leadership/Management", "Volunteer Work/Community Service"]
                </example responses>

            """
            response = generateResponse(prompt)
            try:  # i dont think this try except clause works as intended
                response_text = response.text
                start_index = response_text.index("[")
                end_index = response_text.index("]") + 1
                updatedTags = response_text[start_index:end_index]
            except ValueError:
                response_text = "".join([part.text for part in response._result.parts])
                start_index = response_text.index("[")
                end_index = response_text.index("]") + 1
                updatedTags = response_text[start_index:end_index]
            activity["Updated Tags"] = updatedTags
            updatedList.append(activity)
            print(f"{counter} -Done with {title}")
            time.sleep(1)
        except ValueError as e:
            if "substring not found" in str(e):
                print(f"Error: {e}")
                print(f"LLM Response: {response.text}")
                i -= 1  # Repeat the same index
            else:
                raise e

        dumpData(placeToDump, updatedList)
    return "done"


def updateGrades(activityList, updatedList, placeToDump, index=0):
    counter = 0
    for i in range(index, len(activityList)):
        activity = activityList[i]
        counter += 1
        requirements = activity["requirements"]
        id = activity["id"]
        prompt = f"""
            
            <instructions>
            Based on the requirements of an activity, output a json object.

            I will provide you 2 pieces of information:
            1) The requirements of a certain highschool activity
            2) An ID which is in decimal form. DO NOT ROUND THE ID.

            Return a JSON object that has three fields: grades - a python list of strings, age - a python list of strings, and ID an integer.

            It may well be the case you do not have enough information to accurately say what age or grades there are, in this case simply return
            "unknown" for the appropriate value. Please do include your reasoning. DO NOT ROUND THE ID
            </instructions>

            <information>
            Requirements: {requirements}
            ID: {id}
            </information>


            
        """
        prompt += """ 
        <example response>
            <example>
            Response:
                {
                "grades": ["Sophomore", "Junior", "Senior", "Graduate"],
                "age": ["15", "16", "17", "18", "19"],
                "ID": 0.12124739847238
                }

            Reasoning: Based on the provided requirements, the activity is open to rising high school sophomores, juniors, seniors, and high school graduates. The age requirement is 15 or over by the move-in date. Since high school students are typically aged 15-19, the relevant ages are included in the list.
            
            </example>
            <example>
            Response:
            {
            "grades": ["Sophomore", "Junior"],
            "age": "unknown",
            "ID": 0.3503453457384591
            }

            Reasoning: The requirements state that the activity is for current 10th and 11th-grade students, which correspond to the Sophomore and Junior grade levels. However, there is no information provided about the age range, so the "age" field is set to "unknown".
            </example>
            </example responses>

        """
        response = generateResponse(prompt)
        start_index = response.text.index("[")
        end_index = response.text.index("]") + 1
        updatedTags = response.text[start_index:end_index]
        activity["Updated Grades"] = updatedTags
        updatedList.append(activity)
        print(f"{counter} -Done ")
        time.sleep(5)

        dumpData(placeToDump, updatedList)
    return "done"


def updateCosts(
    activityList: list[dict], updatedList: list, placeToDump: str, index: int = 0
    ):
    for i in range(index, len(activityList)):
        activity = activityList[i]
        title: str = activity["title"]
        text: str = activity["text"]
        requirements: str = activity["requirements"]
        cost: list = activity["cost"]

        prompt = f"""
            This is an activity I have data about.

            The title of the activity is - {title.strip()}
            A text description of the activity is - {text}
        """
        if requirements != "unknown" and requirements != None:
            prompt += f"The requirements of the activity are - {requirements}"
        prompt += f"""
            A description of the cost of the activity is - {cost[1]}

            Your job is to turn this description of the cost into a format which I will tell you now.

            The format you should give me is an array with 4 values in it:

            The first value in this array should be a string, with a small snippet of information to show the user. This should be something like "{title.strip()} costs 25 USD to enter" or "{title.strip()} costs money to enter" or "{title.strip()} is a free activity".
            Try to include the numerical amount and currency of the cost in this string.
            Create this first value based on the description of the cost given above{", but you can use the requirements if information is present there" if requirements != "unknown" and requirements != None else None}

            The second value in this array should be a boolean, either true or false, depending on whether the activity actually costs money to enter. If it costs money, then this field should be true, otherwise this field should be false. 
            If you are unsure about whether or not the activity costs money, then have this second field be a string of "unknown".

            The third value in this array should be an integer, with the numerical amount of the cost (this should be 0 if free).
            To calculate this, avoid any deposits or application fees, and just give me the regular cost of this program.
            DO NOT TRY ANY CURRENCY CONVERSIONS HERE. Keep it the same numerical value as the currency the program it is, no matter what it is.
            If you are unsure about the numerical value of the cost, have this third field be a string of "unknown".

            The fourth value in this array should be a string, with the currency code of the currency which you gave the numerical value in (eg: USD, GBP, INR, AUD, etc)
            For example: if the third field is 18000, but you meant that to be assumed as Indian Rupees, then this should be INR.
            If you are unsure about the currency code of the cost, have this fourth field be a string of "unknown".

            Please reason through your response for each field before, at the end, giving me the final array.
            Make sure this array is JSON parseable, so in other words, make it an actual array, with the square brackets and commas in between the values.
        """
        response = generateResponse(prompt)
        response_text = response.text
        start_index = response_text.index("[")
        end_index = response_text.index("]") + 1
        updatedCost = response_text[start_index:end_index]
        activity["Updated Cost"] = updatedCost
        updatedList.append(activity)

        print(f"{i} - Done with {title}")
        time.sleep(1)

        dumpData(placeToDump, updatedList)

    return True

def updateReq(activityList, updatedList, placeToDump, index=0):
    counter = 0
    for i in range(index, len(activityList)):
        activity = activityList[i]
        counter += 1
        title = activity["title"]

        if 'requirements' in activity.keys():
            requirements = activity["requirements"]
            if requirements != "unknown":
                prompt = f"""
                    
                    <instructions>
                    Update the requirements of an high school extra ]-curricular activity.

                    I will provide you 2 pieces of information:
                    1) The current requirements of an activity
                    2) The title of the same activity

                    I want you to change the requirement as such:
                    Make the requirement start with something like "To participate in the [title of the activity] N exus users must.."
                    I want you to refer to the applicants with the word Nexus users only and no other words.
                    I also want you to make the language of the requirements field more concisce and formal.

                    </instructions>

                    <information>
                    Requirements: {requirements}
                    title of the activity: {title}
                    </information>


                    
                """
                
                response = generateResponse(prompt)
                new_req = response.text
            else:
                new_req = "Unknown"
        else:
            new_req = "Unknown"
        activity["Updated Requirement"] = new_req
        updatedList.append(activity)
        print(f"{counter} -Done with {title} ")
        time.sleep(5)

        dumpData(placeToDump, updatedList)
    return "done"

updateReq(data, f, 'data.json',1523)