const puppeteer = require("puppeteer");

const url = "https://illuminate.projectempower.io/";

const scrape = async (url, numberOfTimesToScroll) => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    page.setDefaultTimeout(60 * 1000);
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
            const descriptions = [];
            const titles = [];

            elements.forEach((element) => {
                descriptions.push(element.textContent.trim());
            });

            elements_titles.forEach((titl) => {
                titles.push(titl.textContent.trim());
            });

            const array_to_return = [];

            for (let i = 0; i < titles.length; i++) {
                const curr_title = titles[i];
                const curr_text = descriptions[i];

                const new_obj = {
                    title: curr_title,
                    text: curr_text,
                };

                array_to_return.push(new_obj);
            }

            return array_to_return;
        });
        blob.forEach((obj) => {
            if (!blocks.includes(obj)) {
                blocks.push(obj);
            }
        });
    }

    await browser.close();

    return blocks;
};

const callScrape = async (url) => {
    // this is an array of objects that have the title and text info
    const ec_list = await scrape(url, 20);
};

callScrape(url);
