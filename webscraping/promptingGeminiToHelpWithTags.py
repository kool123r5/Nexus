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
def merge_json_objects(obj1, obj2):
    merged_obj = obj1.copy()  # Start with a copy of the first object

    for key, value in obj2.items():
        if key in merged_obj:
            # If the key already exists in the merged object
            if isinstance(value, dict) and isinstance(merged_obj[key], dict):
                # If both values are dictionaries, recursively merge them
                merged_obj[key] = merge_json_objects(merged_obj[key], value)
            elif isinstance(value, list) and isinstance(merged_obj[key], list):
                # If both values are lists, merge them by concatenation
                merged_obj[key] = merged_obj[key] + value
            else:
                # If the values are not dictionaries or lists, simply overwrite the existing value
                merged_obj[key] = value
        else:
            # If the key doesn't exist in the merged object, add it
            merged_obj[key] = value

    return merged_obj
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
webscrapedDataFile = "standOutSearchActivities.json"  
with open(webscrapedDataFile, "r", encoding="utf-8") as f:
    activities = json.load(f)
def update_tags(input_tags):
    updated_tags = input_tags
    for umbrella_list in umbrella_tags:
        umbrella_tag = umbrella_list[0]
        sub_tags = umbrella_list[1:]


        for tag in input_tags:
            if tag in sub_tags:
                updated_tags.add(umbrella_tag)
                continue
        

    return updated_tags
json_objects = []
def remove_keys(obj):
    keys_to_remove = ["requirements", "gradeRange", "age", "demographics"]
    new_obj = obj.copy()  # Create a copy of the original object to avoid modifying it

    for key in keys_to_remove:
        if key in new_obj:
            del new_obj[key]

    return new_obj
start = 0
stop = len(activities)



for i in range(start,stop):
    activity = activities[i]
    tags = activity["tags"]
    title = activity["title"]
    text = activity["text"]
    website = activity["website"]

    prompt = f"""
        <instructions>
        I have a database of extra-curricular activites for high-schoolers. I am trying to add 
        accurate, useful tags that would help users filter and search for activites they want.
        Your job is to, based on certain information I give you, return a python list of strings which
        contain tags for a specific activities.
        </instructions>

        <information>
        The title of the activity is: {title} \n
        Here is some text about the activity: {text} \n
        Here is the link to its website: {website} \n
        Here are the current tags we have on the activity: {tags}
        Here are a list of ideal tags I want you to choose from while adding new tags to this activity: {betterTags}
        </information>

        <further instructions>
        Based on the information about this activity, please choose some tags from the list of ideal tags I have given you, and return these
        as a python list of strings. Remember the current tags that I have provided you with right now are not of the best quality and hence I am asking you to make better ones.
        Choose as many tags as you see fit but only choose from the list of idea tags, for each tag you choose, write down your reasoning for 
        why you have decided to choose said tag. Below are some examples of expected responses.
        </further instructions>

        <examples>
        <example1>
        FINAL TAGS: ["Physics","Engineering","STEM"]
        EXPLANATION: I have chosen Physics because the text about the activity says that this activity will sharpen 
        and test the "physics" skills of its users. I have chosen "Engineering" because this is an engineering competition.
        I have chosen STEM because this activity falls under the broader subclass of STEM activities.
        </example1>
        FINAL TAGS: ["Computer Science", "Coding/Programming", "STEM"]
        EXPLANATION: The activity description clearly states that it revolves around computer science concepts like programming, algorithms, and software development. Therefore, "Computer Science" and "Coding/Programming" are appropriate tags. Since computer science falls under the STEM umbrella, the "STEM" tag is also relevant.
        <example2>
        FINAL TAGS: ["Environmental Science", "Environmental Activism", "Community Service"]
        EXPLANATION: This activity focuses on environmental awareness, sustainability, and conservation, which aligns with the "Environmental Science" tag. Additionally, the club engages in activism through awareness campaigns, justifying the "Environmental Activism" tag. Since they also organize community service events like beach cleanups, the "Community Service" tag is appropriate.
        </example2>
        <example3>
        FINAL TAGS: ["Journalism", "Writing", "Media/Broadcasting", "Visual Arts"]
        EXPLANATION: The primary focus of this activity is journalism and publishing a newspaper, hence the "Journalism" tag. Since it involves writing and reporting, the "Writing" tag is also relevant. The club deals with media and broadcasting content through the newspaper, justifying the "Media/Broadcasting" tag. Additionally, the mention of photography, graphic design, and layout aligns with the "Visual Arts" umbrella tag.
        </example3>
        <example4>
        FINAL TAGS: ["Model United Nations (MUN)", "Public Speaking", "Debate", "International Studies/Global Affairs", "Social Sciences and Humanities"]
        EXPLANATION: The activity description explicitly mentions "Model United Nations (MUN)," so that tag is appropriate. Since members engage in debates and public speaking, the "Public Speaking" and "Debate" tags are relevant. The focus on international relations and global affairs aligns with the "International Studies/Global Affairs" tag. Additionally, this activity falls under the broader "Social Sciences and Humanities" umbrella.
        </example4>
        </examples>

        """

    response = model.generate_content(
        prompt,
        safety_settings={
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_ONLY_HIGH
        },
        generation_config=genai.types.GenerationConfig(temperature=0.13),
    )

    start_index = response.text.index("[")
    end_index = response.text.index("]") + 1
    updatedTags =  response.text[start_index:end_index]
    activity['tags'] = update_tags(updatedTags)
    
    time.sleep(1)
    
    promptOther= f"""
    I have a database of extra-curricular activites for high-schoolers. I want to update the Requirements so they all follow a
    standard format, and also I want to remove redundancy between diferent data fields.

    <information>
    Here is some information that may be important:
    Requirements: {activity["requirements"]}
    demographics: {activity["demographics"]}
    gradeRange: {activity["gradeRange"]}
    age: {activity["age"]}

    </information>

    <instructions>
    If there is any information in Requirements that is about age or grade range then update age or graderange respectively to include that information if it does not already have that
    Remove said information about grade/age range from requirements. 

    Take any information from demographics and put it into requirements (For example if demopgrahics say that it is for US Citizens only then include this in requirements)

    Reformat the requirement text so that it is more formal and states information about the Applicant such as this "Applications must..."

    Return a JSON object, along with careful reasoning about why you made certain decisions.

    MAKE SURE YOU ARE NOT REMOVING INFORMATION FROM gradeRange or from age. Make sure you ARE INSTEAD REMOVING INFORMATION REGARDING THIS FROM THE REQUIREMENTS FIELD!
    Note that requirements may be "unknown" in cases like this where you have very little information about requirements it is okay to leave it as unknown.

    </instructions> \n 
    """
    promptOther += """
    <examples> 
        Reasoning: The original requirements mentioned 'Open to grades 9-12', so I updated the gradeRange field to include the corresponding grade levels.
         Age information was already formatted correctly so I did not make any changes there. 
         The demographics field stated 'For U.S. citizens only', so I included that in the requirements.
          I reformatted the requirements to be more formal and focus on the applicant, using phrases like 'Applications must' and 'Applicants must'.
        JSON object:
        {
        "requirements": "Applications must be submitted by high school students. A minimum GPA of 3.0 is required. The application process involves submitting a resume, a personal essay, and two letters of recommendation by the deadline of May 1st. Applicants must be able to commit to attending weekly meetings for the duration of the academic year. Prior experience in public speaking is preferred but not mandatory. This activity is open to U.S. citizens only.",
        "gradeRange": ["Freshman", "Sophomore", "Junior", "Senior"],
        "age": ["15","16","17","18"]
        }
        </examples>

    <examples> Reasoning: The original requirements mentioned 'Ages 14-18', so I updated the age field to include the corresponding ages as strings. 
        There was no specific grade range information, so the gradeRange field was left as an empty list.
        I reformatted the requirements to be more formal and applicant-focused. Since there was no information in the demographics field, I did not add anything new to the requirements.
        JSON object:
        
        "requirements": "Applicants have a minimum cumulative GPA of 3.5 is mandatory. The application process requires submitting a coding project portfolio, a statement of purpose, and two teacher recommendations by the deadline of March 15th. Participants are expected to attend a two-week coding bootcamp during the summer break. Prior experience in Python programming is highly recommended.",
        "gradeRange": [],
        "age": ["14", "15", "16", "17", "18"]
        }
        </examples>

    <examples> Reasoning: The original requirements mentioned 'For grades 10-11', so I updated the gradeRange field to include the corresponding grade levels. 
        There was no specific age information, so the age field was left as an empty list. The demographics field stated 'For female students only',
        so I included that in the requirements. I reformatted the requirements to be more formal and applicant-focused. The requirements mentioned information about grades, but this was redundant and already 
        mentioned in gradeRange so I removed it.
        JSON object:
        {
        "requirements": "This activity is open to female students only. A minimum GPA of 2.8 is required. The application process involves submitting a short essay describing your interest in STEM fields and one letter of recommendation from a math or science teacher. Selected participants are expected to attend weekly meetings and participate in at least one community outreach event per semester.",
        "gradeRange": ["Sophomore", "Junior"],
        "age": [14,15,16,17]
        }
    </examples>
    """
    
    response = model.generate_content(
        promptOther,
        safety_settings={
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_ONLY_HIGH
        },
        generation_config=genai.types.GenerationConfig(temperature=0.13),
    )
    start_index = response.text.index("{")
    end_index = response.text.index("}") + 1
    print(response.text[start_index:end_index])
    updatedObject =  json.loads(response.text[start_index:end_index])
    activity = remove_keys(activity)
    activity  = merge_json_objects(activity,updatedObject)
    json_objects.append(activity)
    print("Done with: ", i)

    with open("updatedSOSActivities.json", "w") as f:
        f.write(json.dumps(json_objects))
