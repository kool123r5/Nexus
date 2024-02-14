import json
from openai import GPT

# Load your JSON file
with open('ecListiLLuminate.json', 'r') as f:
    data = json.load(f)

# Initialize the LLM model
gpt = GPT()

# Set your OpenAI API key
gpt.api_key = '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'

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
    prompt += f"Title: {title}\n"
    prompt += f"Tags: {', '.join(tags)}\n"
    prompt += f"Website: {website}\n"
    prompt += f"Existing Text: {existing_text}\n\n"

# Generate additional text based on the prompt
additional_text = gpt.generate(prompt=prompt, max_tokens=150)

# Update the "text" attribute with additional text
obj['text'] = existing_text + ' ' + additional_text

# Write the updated JSON data back to the file
with open('updated_file_forilluminate.json', 'w') as f:
    json.dump(data, f, indent=2)
