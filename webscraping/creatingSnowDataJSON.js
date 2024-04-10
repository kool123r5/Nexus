const { readFile, writeFile } = require("fs").promises;

for (let i = 1; i < 14; i++) {
    const final = [];
    readFile(`./snowDataFiles/snowData${i}.json`).then((data) => {
        JSON.parse(data)["data"]["learningOpportunities"]["learningOpportunities"].forEach(async (point) => {
            const obj = await getData(point["identifier"]);
            final.push(obj);
            if (final.length == JSON.parse(data)["data"]["learningOpportunities"]["learningOpportunities"].length) {
                const currentData = JSON.parse(await readFile("snowDataScraped.json"));
                const finalData = [...currentData, ...final];
                await writeFile("snowDataScraped.json", JSON.stringify(finalData));
                console.log("Done with: " + i);
            }
        });
    });
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getData(id) {
    await sleep(2000);
    const response = await fetch("https://www.snow.day/graphql", {
        method: "POST",
        headers: {
            Cookie: "__cf_bm=B6u6VaSL3oaLTSMajngr4u6qFLQCTeaY9hnQzoPtiCk-1712744634-1.0.1.1-QrZe5R2wpIrgqM4ffrP6NSVVTeVrwFZH4Ovs.cup_Iq3LT21rgLIxF_JkYolxqqVenSRZyLjQkhLmPrwFuKKxA",
            "Content-Type": "application/json; charset=utf-8",
            "User-Agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
            Accept: "*/*",
            Connection: "keep-alive",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            Origin: "https://www.snow.day",
            Referer: `https://www.snow.day/learning-opportunities/${id}`,
        },
        body: JSON.stringify({
            operationName: "getLearningOpportunity",
            query: "query getLearningOpportunity($identifier: String!) { learningOpportunity(identifier: $identifier) { identifier name description costDescription applicationDescription link financialAccessibility selective eligibility { identifier description gender restrictions grades } media { identifier uri type } learningPaths { identifier name picture { identifier uri type } } provider { identifier name } interests { identifier name } sessions { identifier startDate endDate location { identifier name latitude longitude } } expertReviews { identifier review title writtenAt expert expertDescription link } deadlines { identifier description date } } }",
            variables: {
                identifier: id,
            },
        }),
    });
    const res = await response.json();

    let activity = res["data"]["learningOpportunity"];

    let tags = [];
    activity["interests"].forEach((interest) => {
        tags.push(interest["name"]);
    });

    let deadline = activity["deadlines"][activity["deadlines"].length - 1]["date"].slice(0, 10);

    let cost = ["unknown", activity["costDescription"], "unknown"];

    let startDate = activity["sessions"][activity["sessions"].length - 1]["startDate"].slice(0, 10);
    let endDate = activity["sessions"][activity["sessions"].length - 1]["endDate"].slice(0, 10);

    let mode = "inPerson";
    let location = "unknown";
    if (activity["sessions"][activity["sessions"].length - 1]["location"] == null) {
        mode = "remote";
    }

    if (activity["sessions"][activity["sessions"].length - 1]["location"] != null) {
        location = activity["sessions"][activity["sessions"].length - 1]["location"]["name"];
    }

    let requirements = activity["eligibility"]["description"];
    if (activity["eligibility"]["gender"] != null) {
        requirements += "Only available for gender" + activity["eligibility"]["gender"];
    }
    if (activity["eligibility"]["restrictions"].length != 0) {
        activity["eligibility"]["restrictions"].forEach((rest) => {
            requirements += "A restriction is " + rest;
        });
    }

    let grades = [];
    activity["eligibility"]["grades"].forEach((grade) => {
        if (grade.toLowerCase() == "nine") {
            grades.push("Freshmen");
        } else if (grade.toLowerCase() == "ten") {
            grades.push("Sophomore");
        } else if (grade.toLowerCase() == "eleven") {
            grades.push("Junior");
        } else if (grade.toLowerCase() == "twelve") {
            grades.push("Senior");
        } else {
            grades.push(grade);
        }
    });

    let obj = {
        title: activity["name"],
        text: activity["description"],
        tags: tags,
        website: activity["link"],
        mode: mode,
        location: location,
        address: "unknown",
        selective: activity["selective"] == "HIGHLY",
        demographics: "unknown",
        host: activity["provider"]["name"],
        gradeRange: grades,
        age: [],
        cost: cost,
        paid: [false, 0, "unknown"],
        type: ["Summer Program"],
        startDate: startDate,
        endDate: endDate,
        deadline: deadline,
        requirements: requirements,
        manual: false,
        duration: "unknown",
        id: id,
    };

    return obj;
}
