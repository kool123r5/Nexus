import json

with open("responseData.json", "r") as f:
    responses = json.load(f)

class Contributor:
    def __init__(self, name, money_owed):
        self.name = name
        self.money_owed = money_owed
    def __str__(self):
        return f"Contributor: {self.name}, Money Owed: {self.money_owed}"
    def money_update(self, first_words, localIndia):
        money = self.money_owed
        money += 10
        for word in first_words:
            if word != "unknown":
                money += 1
        if localIndia:
            money += 10
        self.money_owed = money
        return self.money_owed


def find_contributor_by_name(contributors, name):
    for contributor in contributors:
        if contributor.name == name:
            return contributor
    return None

def add_contributor(name, money_owed):
    new_contributor = Contributor(name, money_owed)
    contributors.append(new_contributor)
    return new_contributor

contributors = []    

for response in responses:
    contributor = response["contributor"]
    host = response["host"]
    text = response["text"]
    demographics = response["demographics"]
    age = response["age"]
    location = response["location"]
    cost = response["cost"][2]
    endDate = response["endDate"]
    startDate = response["startDate"]
    deadline = response["deadline"]
    duration = response["duration"]
    localIndia = response["localToIndia"]
    first_words = [
    host,
    text,
    demographics,
    age,
    location,
    cost,
    endDate,
    startDate,
    deadline,
    duration
    ] 
    cont = find_contributor_by_name(contributors, contributor)
    if cont:
        cont.money_update(first_words, localIndia)
    else:
        cont = add_contributor(contributor, 0)
        cont.money_update(first_words, localIndia)

for cont in contributors:
    print(cont)