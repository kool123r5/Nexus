import google.generativeai as genai
import os
from dotenv import load_dotenv
import json

load_dotenv()
gemini_key = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=gemini_key)
model = genai.GenerativeModel(model_name="gemini-pro")
response = model.generate_content("Give me 10 specific extracurricular opportunities for high-school or undergraduate students. Don't give me general stuff like drama club or debate club. I want more specific things that are available online. For example, dont give me robotics club, give me FIRST Robotics Competition, which is actually a real thing students can sign up for. Moreover, I want you to give me the names of each of these opportunities along with a brief description of them and the link to the website for each of them. Give me this list in a JSON parseable format, preferably an array of objects, each with the keys title, text, and website for the name, description, and website link respectively.")
text = response.text
bound_1 = text.find("[")
bound_2 = text.find("]") + 1
sub_str = text[bound_1:bound_2]

# this should be a json object with a bunch of titles, texts, and website links
# should i add tags?
# cuz i thought that may be unreliable from an LLM
# but idk
# btw some new llm tech might come out soon cuz it's moving quite fast
# so if some new models come out we should use those
# especially if web browsing comes (then tags shouldn't really be an issue)
json_obj = json.loads(sub_str)
