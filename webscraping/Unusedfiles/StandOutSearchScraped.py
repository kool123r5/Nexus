import requests
import json


def addSlashToSite(website: str):
    if website[-1] != "/":
        new_website = website + "/"
        return new_website
    return website


def scrape_data(url):
    scraped_data = []
    offset = None
    id = 499
    while True:
        if offset:
            response = requests.get(url + f"?offset={offset}")
        else:
            response = requests.get(url)

        data = response.json()
        records = data.get("records", [])

        for index, record in enumerate(records):
            title = record["fields"].get("Name of Program", "unknown")
            host = record["fields"].get("Entity Name", "unknown")
            website = addSlashToSite(
                record["fields"].get("Link to Application Page/Website ", "unknown")
            )
            type = record["fields"].get("Type of Opportunity:", "unknown")
            tags = record["fields"].get("Interest Area:", "unknown")
            ageRange = record["fields"].get("Age:", "unknown")
            gradeRange = record["fields"].get("Grade:", "unknown")
            mode = record["fields"].get("Mode:", "unknown")
            if mode == ["In Person "]:
                mode = "inPerson"
            elif mode == ["Hybrid"]:
                mode = "hybrid"
            elif mode == ["Remote"]:
                mode = "remote"
            elif mode == ["In Person ", "Remote"] or mode == [
                "Remote",
                "In Person ",
            ]:
                mode = "hybrid"

            location = ", ".join(record["fields"].get("Location:", "unknown"))
            address = record["fields"].get("Address:", "")
            text = record["fields"].get("Description:", "unknown")

            selective = record["fields"].get(
                "This Opportunity is Only Open To:", "unknown"
            )
            demographics = ["All Students"]
            if selective == ["All Students "]:
                selective = False
            else:
                demographics = selective
                selective = True

            cost = record["fields"].get("Program Fee/Tuition:", "unknown")
            if cost == "Free":
                cost = [False, 0, "unknown"]
            else:
                cost = [True, "unknown", "unknown"]
            salary = record["fields"].get("Salary:", "unknown")
            if salary == "Unpaid":
                salary = [False, 0, "unknown"]
            else:
                salary = [True, "unknown", "unknown"]
            deadline = record["fields"].get("Application Deadline:", "unknown")
            requirements = record["fields"].get("Requirements:", "unknown")

            id += 1

            program = {
                "title": title,
                "text": text,
                "tags": tags,
                "website": website,
                "mode": mode,
                "location": location,
                "address": address,
                "selective": selective,
                "demographics": demographics,
                "host": host,
                "gradeRange": gradeRange,
                "age": ageRange,
                "cost": cost,
                "paid": salary,
                "type": type,
                "startDate": "unknown",
                "endDate": "unknown",
                "deadline": deadline,
                "requirements": requirements,
                "manual": False,
                "id": id,
            }
            scraped_data.append(program)

        if "offset" in data:
            offset = data["offset"]
        else:
            break

    return scraped_data


def save_to_json(data):
    with open("standOutSearchActivities.json", "w") as file:
        json.dump(data, file, indent=4)


url = "https://standoutsearch.pory.app/api/app/data/63b6cfb34a0e5f00084f2802/records"
scraped_data = scrape_data(url)
save_to_json(scraped_data)
