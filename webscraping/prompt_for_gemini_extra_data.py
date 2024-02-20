prompt = """This is some pieces of inner text from a specific website about a high school competition. 
The name of the competition is ${data["title"]}. A description that you yourself previously wrote of this competition 
is ${data["text"]}. The pieces of text will now be given to you as a numbered list. They may have some weird spacing
in between. \n`;
for (let x = 1; x < resultsArr.length + 1; x++) {
    const result = resultsArr[x];
    prompt += `${x}: ${result}\n`;
}
prompt += `Keep in mind that not all of the data will be relevant to what I am about to ask you.
I want you to tell me about any start date you can find, any end date you can find, whether it's paid
or not, who the host of the activity is (the name of the organization hosting the activity), whether
it's something selective or whether anyone can join the competition and participate immediately, whether
the event is in-person or if it is done online, and the location of the event if it is in-person.

Return this to me in JSON parseable format, with the types called inPerson: Boolean,
location: string | null, anyoneCanJoin: Boolean, host: string | null, startDate: Date, endDate: Date, paid: Boolean.

EVEN IF YOU CANNOT FIND ANYTHING, RETURN EVERYTHING AS NULL. DO NOT GIVE ANY RESPONSE NOT JSON PARSEABLE."""
