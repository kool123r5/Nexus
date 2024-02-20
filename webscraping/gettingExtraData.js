const puppeteer = require("puppeteer");
const { readFile, writeFile } = require("fs").promises;

const readJSON = async () => {
    const data = await readFile("activitiesAugmented.json", { encoding: "utf-8" });
    return JSON.parse(data);
};

const extraData = async () => {
    const data = await readJSON();
    const returnData = [];
    const browser = await puppeteer.launch({
        headless: "new",
    });
    for (let i = 0; i < 2; i++) {
        try {
            const element = data[i];
            const page = await browser.newPage();
            page.setDefaultTimeout(30000);
            await page.goto(element["website"]);
            await page.waitForTimeout(2000);
            const resultsArr = await page
                .$$eval("div, h1, h2, h3, h4, h5, h6, p", (elements) => {
                    return elements.map((element) => {
                        let innerText = element.innerText.trim();
                        if (innerText != "" && innerText.split(" ").length > 20 && innerText != null) {
                            return innerText;
                        } else {
                            return null;
                        }
                    });
                })
                .then((filteredArr) =>
                    filteredArr
                        .filter(Boolean)
                        .filter(
                            (value) =>
                                !value.includes("Cookie") &&
                                !value.includes("Cookies") &&
                                !value.includes("cookie") &&
                                !value.includes("cookies")
                        )
                        .map((val) => val.replace(/\n/g, " "))
                        .map((val) => val.replace(/\t/g, " "))
                );
            returnData.push(resultsArr);
            await page.close();
        } catch (error) {
            // re-try?
            i -= 1;
        }
    }
    await browser.close();
    await writeFile("websiteDataPromptGemini.json", JSON.stringify(returnData));
};

extraData();
