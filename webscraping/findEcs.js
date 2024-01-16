const puppeteer = require("puppeteer");
const fs = require("fs");

const url = "https://www.findecs.org/";

const scrape = async (url, numberOfTimesToScroll) => {
    const browser = await puppeteer.launch({ headless: "new" });

    const page = await browser.newPage();
    page.setDefaultTimeout((numberOfTimesToScroll + 150) * 20000);
    await page.goto(url);

    await page.setViewport({
        width: 900,
        height: 900,
    });

    await page.waitForTimeout(5000);

    const blocks = [];

    await page.click(".chakra-button");
    await page.waitForSelector(".css-j36myg", {
        visible: true,
    });
    await page.click(".css-j36myg");
    await page.waitForSelector(".css-1rx2mat", {
        visible: true,
    });
    await page.waitForTimeout(2500);

    await page.waitForSelector(".css-cjdgy0", {
        visible: true,
    });

    let elements = await page.$$(".css-cjdgy0");

    const descriptions = [];
    const titles = [];
    const tags = [];
    const websites = [];

    for (let j = 0; j < elements.length; j++) {
        if (j % 2 != 0) {
            continue;
        }
        const element = elements[j];
        const title = await element.$eval(".css-1rx2mat", (title_elem) => {
            return title_elem.textContent.trim();
        });

        const text = await element.$eval(".css-rumja", (text_elem) => {
            return text_elem.textContent.trim();
        });

        titles.push(title);
        descriptions.push(text);
        let tag = await element.$eval(".chakra-badge", (tagElem) => {
            return tagElem.textContent.trim();
        });
        tag = tag.toLowerCase();
        tag = tag.charAt(0).toUpperCase() + tag.slice(1);
        if (tag == "Comp sci") tag = "Computer Science";
        if (tag == "Enviro") tag = "Environment";
        if (tag == "Medical") tag = "Medicine";
        tags.push([tag]);

        await element.click();
        await page.waitForTimeout(500);
        const website = await page.$eval(".css-13ufxbi a", (website_btn) => {
            return website_btn.getAttribute("href");
        });
        websites.push(website);
        await page.mouse.click(10, 10);
        await page.waitForTimeout(500);
        console.log(j, website, tag, title, text);
    }

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

    array_to_return.forEach((obj) => {
        if (
            !blocks.some((pushedObj) => pushedObj.title === obj.title) &&
            !blocks.some((pushedObj) => pushedObj.website === obj.website)
        ) {
            blocks.push(obj);
        }
    });

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
    const ecList = await scrape(url, 100);
    const fileName = "ecListFindECs.json";
    writeDataToFile(fileName, ecList);
};

callScrape(url);
