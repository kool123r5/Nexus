import requests
import json

def scrape_data(url):
    scraped_data = []
    offset = None

    while True:
        if offset:
            response = requests.get(url + f"?offset={offset}")
        else:
            response = requests.get(url)
        
        data = response.json()
        records = data.get("records", [])
        
        for record in records:
            program = {
                "title": record["fields"]["Name of Program"],
                "text": record["fields"].get("Description", ""),
                "tags": record["fields"].get("Interest Area:", []),
                "website": record["fields"].get("Link to Application Page/Website ", ""),
                "inPerson": record["fields"].get("Mode:",[]),
                "location": ", ".join(record["fields"].get("Location:", [])),
                "anyoneCanJoin": record["fields"].get("This Opportunity is Only Open To:", []),
                "host": record["fields"]["Entity Name"],
                "gradeRange": ", ".join(record["fields"].get("Grade:", [])),
                "ID": len(scraped_data) + 494
            }
            scraped_data.append(program)
        
        if "offset" in data:
            offset = data["offset"]
        else:
            break

    return scraped_data

def save_to_json(data):
    with open("StandOutSearch_scraped.json", "w") as file:
        json.dump(data, file, indent=4)

if __name__ == "__main__":
    url = "https://standoutsearch.pory.app/api/app/data/63b6cfb34a0e5f00084f2802/records"
    scraped_data = scrape_data(url)
    save_to_json(scraped_data)
