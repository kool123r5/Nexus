const puppeteer = require("puppeteer");
const { readFile, writeFile } = require("fs").promises;

const readJSON = async () => {
    const data = await readFile("activitiesAugmented.json", { encoding: "utf-8" });
    return JSON.parse(data);
};

async function processLinks(links) {
    const linksData = [];
    const browser = await puppeteer.launch({
        headless: "new",
    });
    const page = await browser.newPage();
    page.setDefaultTimeout(30000);
    for (const link of links) {
        await page.goto(link);
        await page.waitForNetworkIdle();
        await page.waitForSelector("h1, h2, h3, h4, h5, h6, p");
        const linkResult = await page
            .$$eval("h1, h2, h3, h4, h5, h6, p", (elements) => {
                return elements.map((element) => {
                    let innerText = element.innerText.trim();
                    if (
                        innerText != "" &&
                        innerText != null &&
                        (innerText.toLowerCase().includes("entry fee") ||
                            innerText.toLowerCase().includes("online") ||
                            innerText.toLowerCase().includes("virtual") ||
                            innerText.toLowerCase().includes("fee") ||
                            innerText.toLowerCase().includes("deadline") ||
                            innerText.toLowerCase().includes("entry") ||
                            innerText.toLowerCase().includes("ages") ||
                            innerText.toLowerCase().includes("grades") ||
                            innerText.toLowerCase().includes("start") ||
                            innerText.toLowerCase().includes("end") ||
                            innerText.toLowerCase().includes("date") ||
                            innerText.toLowerCase().includes("in person") ||
                            innerText.toLowerCase().includes("cost") ||
                            innerText.toLowerCase().includes("$") ||
                            innerText.toLowerCase().includes("dollar") ||
                            innerText.toLowerCase().includes("euro") ||
                            innerText.toLowerCase().includes("high school") ||
                            innerText.toLowerCase().includes("January") ||
                            innerText.toLowerCase().includes("February") ||
                            innerText.toLowerCase().includes("March") ||
                            innerText.toLowerCase().includes("April") ||
                            innerText.toLowerCase().includes("May") ||
                            innerText.toLowerCase().includes("June") ||
                            innerText.toLowerCase().includes("July") ||
                            innerText.toLowerCase().includes("August") ||
                            innerText.toLowerCase().includes("October") ||
                            innerText.toLowerCase().includes("November") ||
                            innerText.toLowerCase().includes("December") ||
                            innerText.toLowerCase().includes("free") ||
                            innerText.toLowerCase().includes("Middle school") ||
                            innerText.toLowerCase().includes("High school") ||
                            innerText.toLowerCase().includes("location") ||
                            innerText.toLowerCase().includes("selective"))
                            
                    ) {
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
        linksData.push(linkResult);
    }
    await browser.close();
    return linksData;
}

const extraData = async () => {
    const data = await readJSON();
    const returnData = [];
    const browser = await puppeteer.launch({
        headless: "new",
    });

    for (let i = 0; i < 495; i++) {
        try {
            if (i% 10) {console.log(i);}
            const element = data[i];
            const page = await browser.newPage();
            page.setDefaultTimeout(30000);
            await page.goto(element["website"]);
            await page.waitForTimeout(2000);

            const resultsArr = await page
                .$$eval("h1, h2, h3, h4, h5, h6, p", (elements) => {
                    return elements.map((element) => {
                        let innerText = element.innerText.trim();
                        if (
                            innerText != "" &&
                            innerText != null &&
                            (innerText.toLowerCase().includes("entry fee") ||
                            innerText.toLowerCase().includes("online") ||
                            innerText.toLowerCase().includes("virtual") ||
                            innerText.toLowerCase().includes("fee") ||
                            innerText.toLowerCase().includes("deadline") ||
                            innerText.toLowerCase().includes("entry") ||
                            innerText.toLowerCase().includes("ages") ||
                            innerText.toLowerCase().includes("grades") ||
                            innerText.toLowerCase().includes("start") ||
                            innerText.toLowerCase().includes("end") ||
                            innerText.toLowerCase().includes("date") ||
                            innerText.toLowerCase().includes("in person") ||
                            innerText.toLowerCase().includes("cost") ||
                            innerText.toLowerCase().includes("$") ||
                            innerText.toLowerCase().includes("dollar") ||
                            innerText.toLowerCase().includes("euro") ||
                            innerText.toLowerCase().includes("high school") ||
                            innerText.toLowerCase().includes("January") ||
                            innerText.toLowerCase().includes("February") ||
                            innerText.toLowerCase().includes("March") ||
                            innerText.toLowerCase().includes("April") ||
                            innerText.toLowerCase().includes("May") ||
                            innerText.toLowerCase().includes("June") ||
                            innerText.toLowerCase().includes("July") ||
                            innerText.toLowerCase().includes("August") ||
                            innerText.toLowerCase().includes("October") ||
                            innerText.toLowerCase().includes("November") ||
                            innerText.toLowerCase().includes("December") ||
                            innerText.toLowerCase().includes("free") ||
                            innerText.toLowerCase().includes("Middle school") ||
                            innerText.toLowerCase().includes("High school") ||
                            innerText.toLowerCase().includes("location") ||
                            innerText.toLowerCase().includes("selective"))
                        ) {
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
            // resultsArr -> []

            const links = await page
                .$$eval("a", (elems) => {
                    return elems.map((elem) => {
                        if (
                            elem.href != undefined &&
                            elem.href != null &&
                            elem.href != "" &&
                            (elem.href.toLowerCase().includes("faq") || elem.href.toLowerCase().includes("apply"))
                        ) {
                            return elem.href;
                        }
                    });
                })
                .then((arr) => arr.filter(Boolean));

            await page.waitForTimeout(1000);

            const linksData = await processLinks(links);
            let oneDLinksData = [];
            for (let j = 0; j < linksData.length; j++) {
                const linkData = linksData[j];
                oneDLinksData = [...oneDLinksData, ...linkData];
            }
            returnData.push([...resultsArr, ...oneDLinksData]);

            await page.close();
        } catch (error) {
            // re-try?
            console.log(error);
            i -= 1;
        }
    }

    await browser.close();
    await writeFile("websiteDataPromptGemini.json", JSON.stringify(returnData));
};

extraData();
