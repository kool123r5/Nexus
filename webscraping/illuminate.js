const puppeteer = require("puppeteer");
const fs = require("fs");

const url = "https://illuminate.projectempower.io/";

const scrape = async (url, numberOfTimesToScroll) => {
    const browser = await puppeteer.launch({ headless: "new" });

    const page = await browser.newPage();
    page.setDefaultTimeout((numberOfTimesToScroll + 150) * 20000);
    await page.goto(url);

    await page.setViewport({
        width: 900,
        height: 900,
    });

    await page.waitForSelector("input[type=checkbox]", {
        visible: false,
    });

    await page.waitForTimeout(5000);

    const blocks = [];

    for (let j = 0; j < 44; j++) {
        const checkboxes = await page.$$("input[type=checkbox]");
        for (let x = 0; x < 1000; x++) {
            page.keyboard.press("PageUp");
        }
        page.evaluate(
            (box, j, prevBox) => {
                box.click();
                if (j > 0) {
                    prevBox.click();
                }
            },
            checkboxes[j],
            j,
            checkboxes[j - 1],
            page
        );

        // await page.screenshot({ path: "ss.png", fullPage: true });

        for (let i = 0; i < numberOfTimesToScroll; i++) {
            await page.keyboard.press("PageDown");
            await page.keyboard.press("PageDown");
            await page.keyboard.press("PageDown");
            await page.keyboard.press("PageDown");
            await page.keyboard.press("PageDown");
            await page.keyboard.press("PageDown");
            await page.keyboard.press("PageDown");
            await page.keyboard.press("PageDown");
            await page.keyboard.press("PageDown");
            await page.keyboard.press("PageDown");

            const blob = await page.evaluate(() => {
                const elements = document.querySelectorAll(".bannerDescription:not(.done)");
                const elements_titles = document.querySelectorAll(".bannerName:not(.done)");
                const elements_tags = document.querySelectorAll(".bannerTags:not(.done)");
                const element_website_button = document.querySelectorAll(".bannerWebsite:not(.done)");
                const descriptions = [];
                const titles = [];
                const tags = [];
                const websites = [];

                elements.forEach((element) => {
                    element.classList.add("done");
                    descriptions.push(element.textContent.trim());
                });

                elements_titles.forEach((titl) => {
                    titl.classList.add("done");
                    titles.push(titl.textContent.trim());
                });

                elements_tags.forEach((tagUl) => {
                    tagUl.classList.add("done");
                    const subTagArray = [];
                    tagUl.childNodes.forEach((tagLi) => {
                        subTagArray.push(tagLi.textContent.trim());
                    });
                    tags.push(subTagArray);
                });

                element_website_button.forEach((btn) => {
                    btn.classList.add("done");
                    const aTag = btn.parentElement;
                    const website = aTag.getAttribute("href");
                    websites.push(website);
                });

                const array_to_return = [];

                for (let i = 0; i < titles.length; i++) {
                    const curr_title = titles[i];
                    const curr_text = descriptions[i];
                    const curr_tags = tags[i];
                    const curr_website = websites[i];

                    const new_obj = {
                        title: curr_title,
                        text: curr_text,
                        tags: curr_tags,
                        website: curr_website,
                    };

                    array_to_return.push(new_obj);
                }

                return array_to_return;
            });

            blob.forEach((obj) => {
                if (
                    !blocks.some((pushedObj) => pushedObj.title === obj.title) &&
                    !blocks.some((pushedObj) => pushedObj.website === obj.website)
                ) {
                    blocks.push(obj);
                }
            });
        }
        // await page.reload();
    }

    await browser.close();
    return blocks;
};

// this function will write the data to a txt file
const writeDataToFile = (fileName, ecList) => {
    const file = fs.createWriteStream(fileName);
    const stringified_obj = JSON.stringify(ecList, null, 2);
    file.write(stringified_obj, "utf8");
    file.end();
};

const callScrape = async (url) => {
    // this is an array of objects that have the title and text info
    const ecList = await scrape(url, 1_000);
    const fileName = "ecListIlluminate.json";
    writeDataToFile(fileName, ecList);
};

callScrape(url);
