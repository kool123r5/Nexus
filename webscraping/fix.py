import json

# 1. Import the file (cleanedActivityData.json)
with open('cleanedActivityData.json', 'r') as file:
    data = json.load(file)

# 2. Remove the current "id" key-value pair from each item in the data
for item in data:
    if 'id' in item:
        del item['id']

# 3. Add new "id" key-value pairs from scratch (starting at 0)
for i in range(len(data)):
    data[i]['id'] = i

# Save the updated data back to the JSON file
with open('cleanedActivityData.json', 'w') as file:
    json.dump(data, file, indent=2)

print("Script executed successfully.")