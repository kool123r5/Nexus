import json
from openai import GPT

# Load your JSON file
with open('ecListiLLuminate.json', 'r') as f:
    data = json.load(f)

# Initialize the LLM model
gpt = GPT()

# Set your OpenAI API key
gpt.api_key = 'your_openai_api_key'

# Custom prompt to guide the text generation process
prompt = "Please generate additional text based on the following information:\n"

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
