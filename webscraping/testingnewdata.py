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
with open('websiteDataPromptGemini.json', 'r', encoding='utf-8') as f: #loads the webscraped json file
    activities = json.load(f)

print("loaded json")



# Gets different attributres from each object
prompt = f"""
["Erin Saya Ahn entered the competition as a 10th grade student at Roosevelt High School in Seattle, WA. Her project, Aid To-Go, is a medical diagnosis brochure that enables easy doctor-patient communication, encouraging inclusivity as a step toward health equity and world peace. The brochure allows the patient to express their needs, regardless of linguistic or speech barriers by removing social, religious, and gender obstacles so the patient can get the care they need. Learn more about the 2022 competition and Saya’s experience.","2020: WHAT WOULD YOU DESIGN TO HELP MORE OF US FEEL INCLUDED?","IS THERE AN ENTRY FEE?","No. There is no entry fee.","No. You may only submit one entry to the competition.","Yes. You may submit an entry in a team with up to three members. Teams of more than three members will not be accepted. For team entries, only one team member should submit the entry.","IF I SUBMIT AN ENTRY AS PART OF A TEAM, CAN I ALSO SUBMIT AN INDIVIDUAL ENTRY?","IF I AM SUBMITTING AN ENTRY AS PART OF A TEAM, DOES EACH TEAM MEMBER NEED TO CREATE AN ACCOUNT AND SUBMIT OUR DESIGN IDEA?","No. Only one team member needs to create an account and submit your design. In the online submission form, there is a place to list each team members’ names and to upload signed parent/legal guardian consent forms for all team members.","HOW DO I SUBMIT MY ENTRY?","All entries will be submitted online. The submission site will open on January 3, 2023. Read more about what is required and How to Enter to get started on your design! Please note that the submission site will not work if you are using Internet Explorer.","Yes. Homeschooled students, residing within the 50 United States or Washington, D.C. at the time you submit an entry, who are working toward the completion of a high school degree and who have finished middle school level coursework are eligible to apply.","I AM A U.S. CITIZEN LIVING AND ATTENDING HIGH SCHOOL ABROAD. AM I ELIGIBLE TO ENTER?","No. To be eligible to enter you must be a high school student in grades 9–12 grades, between the ages of 13–19, residing within the 50 United States or Washington, D.C. at the time you submit an entry.","Yes. Any student may enter provided he or she is in high school, grades 9–12, between the ages of 13–19, residing within the 50 United States or Washington, D.C. at the time you submit an entry.","CAN I ENTER THE COMPETITION IF I AM ATTENDING A HIGH SCHOOL IN THE U.S. AT THE TIME OF THE SUBMISSION BUT WILL MOVE OUTSIDE OF THE U.S. AFTER?","Yes. You are eligible to enter if you are a high school student residing within the 50 United States or Washington, D.C. at the time you submit an entry. Please be aware that if you are selected as a finalist, only travel within the U.S. for the Mentor Weekend is included and you are required to attend. The virtual phone call/meeting with the mentor and Judging Weekend also will be scheduled based on time zones in the United States.","No. We are excited to hear of your interest, but you must be between the ages of 13–19 and in high school (grades 9–12) at the time of entry to be eligible for the competition.","IF SELECTED AS A FINALIST IN THE COMPETITION, I ALREADY KNOW THAT I WILL NOT BE ABLE TO ATTEND THE FINAL JUDGING. SHOULD I STILL PARTICIPATE IF I KNOW I MIGHT MISS AN IMPORTANT STEP?","Finalist activities are required, so unfortunately, you would be disqualified if you are unable to attend. If you are entering as a team, please note that all team members must participate in all activities. For complete details, see the competition rules and conditions, which will be available on the 2023 Design Challenge page by January 3, 2023.","GENERAL ENTRY REQUIREMENTS","DO I NEED TO SEND A COPY OF MY HIGH SCHOOL ID WHEN I UPLOAD MY ENTRY?","No. You do not and should not upload a copy of your high school student ID when you submit. If selected as a finalist or honorable mention, you will be asked to send a copy of your ID to confirm eligibility.","There is no restriction to what you can design. Visit the Student & Teacher Resources for brainstorming tips on how to get started and more.","TO WHOM DO WE SEND PERMISSION FORMS?","Parent/legal guardian consent forms are submitted as part of your entry online. Once the submission portal opens on January 3, 2023, you will see a section where you can upload a scan of your signed permission form. You will be able to save your online entry and come back to it later before submitting.","Yes. If you are submitting a team entry, each member of the team must submit a signed parent/legal guardian consent form.","ENTRY REQUIREMENTS FOR SKETCHES","Yes. Sketches may include photography, hand-drawn images, and computer created images.","ENTRY REQUIREMENTS FOR QUESTION RESPONSES","Your responses must be equal to or less than the word counts noted. The entry form will have a word counter, and you will not be allowed to write more than the limit. Remember, there is no right or wrong answer.","There is no right or wrong way to answer these questions. The word count is meant to help you share your design solution in a concise way. You can be more broad or specific in your responses, depending on what you think best helps to explain your design solution.","Yes. You may submit your responses as .mp3 files. On the online submission form, please select “Audio Files” for your response submission type or contact DesignCompetition@si.edu by January 17, 2023 to discuss other possible modifications to enable participation.","January 3, 2023: Online entry period begins","April 6, 2023: Finalists and Honorable Mentions are announced online and their designs will be displayed on the Cooper Hewitt website","April 2023: Finalists’ phone calls/virtual meetings on Zoom with mentor to further develop their designs (Zoom’s privacy policy is available here: https://zoom.us/educationalprivacy)","May 6–7, 2023: Finalists attend the in-person Mentor Weekend at the MIT Norman B. Leventhal Center for Advanced Urbanism in Cambridge, MA (Domestic travel and accommodations provided)","June 10–11, 2023: Finalists attend the virtual Judging Weekend on Zoom, where they present their designs to the judges; Winner is selected and announced online"]
This is some data scraped from a website. From the data return the following:
Who is organizing the event
For which grades is the event
when is the deadlines and important dates
Where is the event located

"""
#feel free to modify the promt as much as you want. dont change the first 4 lines that give the prompt information of the title, tags and website however

response =  model.generate_content(prompt,
generation_config=genai.types.GenerationConfig(
# feel free to modify this as you wish- 3.5 tokens is approximately 1 word
# change these around and see how that works

max_output_tokens=300,
temperature=1.0))


print(response.text)
# print(activities[i])  
#use the above instead if you want to see the whole json object. alternatively you can comment out both if you dont want to see what its producing



print("Augmentation complete! Check the activities_augmented.json file.")
