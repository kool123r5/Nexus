import google.generativeai as genai
import os
from dotenv import load_dotenv
import json

load_dotenv()
gemini_key = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=gemini_key)
model = genai.GenerativeModel(model_name="gemini-pro")
curr_json_obj = []
prompt = """
Give me 25 specific extracurricular opportunities for high-school or undergraduate students. 
Don't give me general stuff like drama club or debate club. I want more specific things that are available online. 
For example, dont give me robotics club, give me FIRST Robotics Competition, which is actually a real thing students can 
sign up for. Moreover, I want you to give me the names of each of these opportunities along with a brief description 
of them, some tags associated with that opportunity (eg: Biology, All Grades, Virtual, Research, Sports), 
and the link to the website for each of them. Give me this list in a JSON parseable format, 
preferably an array of objects, each with the keys title, text, tags, and website for the name, description, 
an array of tags, and website link respectively.
"""
for x in range(10):
    try:
        response = model.generate_content(prompt)
        text = response.text
        bound_1 = text.find("[")
        bound_2 = text.rindex("]") + 1
        sub_str = text[bound_1:bound_2]

        # this should be a json object with a bunch of titles, texts, tags, and website links
        # btw some new llm tech might come out soon cuz it's moving quite fast
        # so if some new models come out we should use those
        # especially if web browsing comes (then tags shouldn't really be an issue)
        json_obj = json.loads(sub_str)
        print(json_obj)
        for obj in json_obj:
            if not (
                any(bigObj["website"] == obj["website"] for bigObj in curr_json_obj)
                or (any(bigObj["title"] == obj["title"] for bigObj in curr_json_obj))
            ):
                curr_json_obj.append(obj)
    except:
        print("An error occured, continuing")


# i'm looking through and a lot of these sites seem made up
# maybe we should wait for someone to put out a web browsing api?
# it's up to you guys though
file = open("ecListGPT.json", "w")
json.dump(curr_json_obj, file)
file.close()
