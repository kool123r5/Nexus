import json
from googleapiclient.discovery import build

# Load your JSON file
with open('ecListiLLuminate.json', 'r') as f:
    data = json.load(f)

# Initialize the Gemini model
service = build('language', 'v1beta1', developerKey='AIzaSyCIrnUDO6aTCFfr2VDU65K8vs3iTIKoRgk')

# Custom prompt to guide the text generation process
prompt = """I am building a database of extracurricular oppurtunities for highschoolers.
I have some exisiting text and data about each activity. I would like you to use this information
to produce more text. I want you to write some more information about the activity.
additionally write a little on why a student should do the activty. Persuade the user to do the activity.
Write about pros and cons as you see fit, and what type of student would benefit from the ec oppurtunity.
Please generate additional text based on the following information:\n"""

# Loop through each JSON object
for obj in data:
    # Extract relevant information
    title = obj.get('title', '')
    tags = obj.get('tags', [])
    website = obj.get('website', '')
    existing_text = obj.get('text', '')

    # Construct prompt
    prompt_content = f"Title: {title}\nTags: {', '.join(tags)}\nWebsite: {website}\nExisting Text: {existing_text}\n\n"

    # Generate additional text based on the prompt
    request = {
        'documents': [{"text": prompt_content}],
        "encodingType": "UTF8",
        "features": {
            "textGenerationFeature": {
                "prompt": "What should I add to this text to make it more informative and persuasive?",
                "maxGenerationLength": 150,
            }
        }
    }

    response = service.documents().analyzeText(body=request).execute()

    # Extract generated text
    generated_text = response['documents'][0]['textGenerationResponses'][0]['generatedText']

    # Update the "text" attribute with additional text
    obj['text'] = existing_text + ' ' + generated_text

# Write the updated JSON data back to the file
with open('updated_file_forilluminate.json', 'w') as f:
    json.dump(data, f, indent=2)
