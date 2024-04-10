const { readFile, writeFile } = require("fs").promises;
const puppeteer = require("puppeteer");

process.setMaxListeners(0);

call();

async function call() {
    const browser = await puppeteer.launch({
        headless: "new",
    });
    const final = JSON.parse(await readFile("snowData.json"));
    const data = await readFile(`snowDataScrapedJSON.json`);

    const activities = JSON.parse(data);

    // not starting from 0 because my pc crashed in the middle haha
    for (let i = 912; i < activities.length; i++) {
        const activity = activities[i];
        try {
            const obj = await getData(activity, browser);
            console.log("Done with something");
            final.push(obj);
            await writeFile("snowData.json", JSON.stringify(final));
        } catch (error) {
            console.log(error);
            continue;
        }
    }

    await browser.close();
}

async function getData(activity, browser) {
    let tags = [];
    activity["interests"].forEach((interest) => {
        tags.push(interest["name"]);
    });

    let deadline = activity["deadlines"].at(-1)["date"].slice(0, 10);

    let startDate = activity["sessions"].at(-1)["startDate"].slice(0, 10);
    let endDate = activity["sessions"].at(-1)["endDate"].slice(0, 10);

    let mode = "inPerson";
    let location = "unknown";
    if (activity["sessions"].at(-1)["location"] == null) {
        mode = "remote";
    }

    if (activity["sessions"].at(-1)["location"] != null) {
        location = activity["sessions"].at(-1)["location"]["name"];
    }

    const page = await browser.newPage();
    page.setDefaultTimeout(15_000);
    console.log(activity["identifier"]);
    await page.goto(`https://www.snow.day/learning-opportunities/${activity["identifier"]}`);
    await page.waitForTimeout(1000);
    await page.click(".css-gg4vpm");
    const [btn] = await page.$x("//a[contains(., 'View Costs')]");
    await btn.click();
    await page.waitForTimeout(250);
    const costContent = await page.$eval(".css-qlig70", (elem) => {
        return elem.textContent.trim();
    });
    const requirements = await page.$eval(".css-rcy6ff", (elem) => {
        return elem.textContent.trim();
    });
    await page.close();

    let cost = ["unknown", costContent, "unknown"];

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
        gradeRange: "unknown",
        age: "unknown",
        cost: cost,
        paid: [false, 0, "unknown"],
        type: ["Summer Program"],
        startDate: startDate,
        endDate: endDate,
        deadline: deadline,
        requirements: requirements,
        manual: false,
        duration: "unknown",
        id: Math.random(),
    };

    return obj;
}
