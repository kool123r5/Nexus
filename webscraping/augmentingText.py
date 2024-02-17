import google.generativeai as genai
import os
from dotenv import load_dotenv
import json
#important: if you get No such file or directory: 'ecListMerged.json' Error. then run this through terminal
# cd webscraping
# python augmentingText.py 
# the above lines should work 
print("done importing")
load_dotenv()
gemini_key = os.getenv("GEMINI_API_KEY") #gets a secret key from my environemnt (which github ignores)
genai.configure(api_key=gemini_key)
model = genai.GenerativeModel(model_name="gemini-pro")
curr_json_obj = []

print("configured model")
with open('ecListMerged.json', 'r', encoding='utf-8') as f: #loads the webscraped json file
    activities = json.load(f)

print("loaded json")

for i in range(495): #iterates through almost 500 activites to augment each individually
    try:
        title = activities[i]["title"]
        text = activities[i]["text"]
        tags = activities[i]["tags"]
        website = activities[i]["website"]
        # Gets different attributres from each object
        prompt = f"""
        Title: {title}
        Description: {text}
        Tags: {", ".join(tags)}
        Website: {website}

        Augment the description to be more informative and persuasive, 
        highlighting the benefits of participating in the competition for high school students. 
        Please simply right a text description based on the information you have available to you.
        This description shuld be brief (no more than 100 words at max).
        Write in a continous paragraph form with text only. (no markdown language).
        Be relatively objective and descriptive and informative. We are trying to be third party unbiased people reporting on interesting oppurtunities.
        We are not writing advertisements. We are hoping to inform.
        
        """
        #feel free to modify the promt as much as you want. dont change the first 4 lines that give the prompt information of the title, tags and website however
        
        response =  model.generate_content(prompt,
        generation_config=genai.types.GenerationConfig(
        # feel free to modify this as you wish- 3.5 tokens is approximately 1 word
        # change these around and see how that works
        
        max_output_tokens=300,
        temperature=1.0))
        


        # Update the "text" field with the augmented description
        activities[i]["text"] = response.text
        print(activities[i]["text"]) 
        # print(activities[i])  
        #use the above instead if you want to see the whole json object. alternatively you can comment out both if you dont want to see what its producing
        if i%20 == 0:
            print(i, " out of 495 activities completed") #checks progress
    except:
        print("An error occured, continuing")
        i = i-1

# After iterating, save the updated list to a new JSON file
with open("activities_augmented.json", "w") as f:
    json.dump(activities, f, indent=4)

print("Augmentation complete! Check the activities_augmented.json file.")
