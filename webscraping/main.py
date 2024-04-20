import json
import random
import os

def load_data(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data

def save_data(data, file_path):
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=2)

def count_unknowns_and_nulls(activity):
    count = 0
    for value in activity.values():
        if value == "unknown" or value == []:
            count += 1
    return count

def remove_duplicates(activities):
    cleaned_activities = []
    deleted_activities = []
    website_dict = {}

    for activity in activities:
        website = activity['website']
        if website in website_dict:
            existing_activity = website_dict[website]
            unknowns_count_existing = count_unknowns_and_nulls(existing_activity)
            unknowns_count_current = count_unknowns_and_nulls(activity)

            if unknowns_count_current < unknowns_count_existing:
                deleted_activities.append({**existing_activity, "replaced_by": activity['id']})
                website_dict[website] = activity
            elif unknowns_count_current > unknowns_count_existing:
                deleted_activities.append({**activity, "replaced_by": existing_activity['id']})
            else:
                if random.random() < 0.5:
                    deleted_activities.append({**existing_activity, "replaced_by": activity['id']})
                    website_dict[website] = activity
                else:
                    deleted_activities.append({**activity, "replaced_by": existing_activity['id']})
        else:
            website_dict[website] = activity

    for activity in website_dict.values():
        cleaned_activities.append(activity)

    return cleaned_activities, deleted_activities

def main():
    input_file = "activityData.json"
    cleaned_file = "cleanedActivityData.json"
    deleted_file = "deletedActivities.json"

    activities = load_data(input_file)
    cleaned_activities, deleted_activities = remove_duplicates(activities)

    save_data(cleaned_activities, cleaned_file)
    save_data(deleted_activities, deleted_file)

    print(f"Cleaned data saved to: {cleaned_file}")
    print(f"Deleted activities saved to: {deleted_file}")

if __name__ == "__main__":
    main()