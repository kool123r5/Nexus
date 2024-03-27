import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
import os
from dotenv import load_dotenv
import json

load_dotenv()
gemini_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=gemini_key)
model = genai.GenerativeModel(model_name="gemini-pro")

with open("../standOutSearchActivities.json", "r", encoding="utf-8") as f:
    standoutSearchActivityData = json.load(f)

rewritten_data = []
indexes_with_errors = []

for index, standoutSearchActivity in enumerate(standoutSearchActivityData):
    description = standoutSearchActivity["text"]
    if not description:
        continue
    else:
        try:
            prompt = f"""
                        This is a text description of an activity - {description}
                        I want you to rewrite this description in the same tone, register, etc as the original.
                        DO NOT add any new information about the text yourself. 
                        Make sure not to miss out on ANY piece of information in the text already.
                        DO NOT use bullet points, and use ONLY 1 PARAGRAPH. Try not dragging it out.
                        The description should try being as informative as possible, so do not use catchy ad-like phrases such as "Calling all high schoolers!" or "Sign up today!". This should be purely informational.
                        Also, do not give me any fluff like 'Okay, I'll do your task', I only want the rewritten description from your response.
                        """
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
                generation_config=genai.types.GenerationConfig(temperature=0.2),
            )
            print(index)
            new_object = standoutSearchActivity
            new_object["text"] = response.text
            rewritten_data.append(new_object)
        except:
            print("Error occured in index: ", index)
            indexes_with_errors.append(standoutSearchActivity["id"])

with open("standOutSearchActivities.json", "w") as f:
    json.dump(rewritten_data, f)

print("Indexes with errors: ", indexes_with_errors)
