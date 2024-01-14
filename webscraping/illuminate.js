const puppeteer = require("puppeteer");
const fs = require("fs");

const url = "https://illuminate.projectempower.io/";

const scrape = async (url, numberOfTimesToScroll) => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    page.setDefaultTimeout((numberOfTimesToScroll + 15) * 2000);
    await page.goto(url);

    await page.setViewport({
        width: 1440,
        height: 900,
    });

    await page.waitForSelector(".bannerDescription", {
        visible: true,
    });
    await page.waitForTimeout(10000);

    await page.mouse.click(450, 450);
    await page.mouse.click(450, 450);
    await page.mouse.click(450, 450);
    await page.mouse.click(450, 450);
    await page.mouse.click(450, 450);

    const blocks = [];

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

        // await page.screenshot({ path: `ss_${i}.png`, fullPage: true });

        const blob = await page.evaluate(() => {
            const elements = document.querySelectorAll(".bannerDescription");
            const elements_titles = document.querySelectorAll(".bannerName");
            const elements_tags = document.querySelectorAll(".bannerTags");
            const element_website_button = document.querySelectorAll(".bannerWebsite");
            const descriptions = [];
            const titles = [];
            const tags = [];
            const websites = [];

            elements.forEach((element) => {
                descriptions.push(element.textContent.trim());
            });

            elements_titles.forEach((titl) => {
                titles.push(titl.textContent.trim());
            });

            elements_tags.forEach((tagUl) => {
                const subTagArray = [];
                tagUl.childNodes.forEach((tagLi) => {
                    subTagArray.push(tagLi.textContent.trim());
                });
                tags.push(subTagArray);
            });

            element_website_button.forEach((btn) => {
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
            if (!blocks.some((pushedObj) => pushedObj.title === obj.title)) {
                blocks.push(obj);
            }
        });
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
    const ecList = await scrape(url, 1);
    const fileName = "ecListIlluminate.json";
    writeDataToFile(fileName, ecList);
};

callScrape(url);
