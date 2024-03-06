const puppeteer = require("puppeteer");
const { readFile, writeFile } = require("fs").promises;

const readJSON = async () => {
  const data = await readFile("activities_augmented_withID.json", {
    encoding: "utf-8",
  });
  return JSON.parse(data);
};

async function processLinks(links) {
  const linksData = [];
  const browser = await puppeteer.launch({
    headless: "new",
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(60000);
  for (const link of links) {
    await page.goto(link);
    await page.waitForSelector(
      "h1, h2, h3, h4, h5, h6, p, span, strong, em, b, i, small, ins, mark, del,ul,li,ol,dt,dd,dl"
    );
    const linkResult = await page
      .$$eval(
        "h1, h2, h3, h4, h5, h6, p, span, strong, em, b, i, small, ins, mark, del,ul,li,ol,dt,dd,dl",
        (elements) => {
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
                innerText.toLowerCase().includes("january") ||
                innerText.toLowerCase().includes("february") ||
                innerText.toLowerCase().includes("march") ||
                innerText.toLowerCase().includes("april") ||
                innerText.toLowerCase().includes("may") ||
                innerText.toLowerCase().includes("june") ||
                innerText.toLowerCase().includes("july") ||
                innerText.toLowerCase().includes("august") ||
                innerText.toLowerCase().includes("october") ||
                innerText.toLowerCase().includes("november") ||
                innerText.toLowerCase().includes("december") ||
                innerText.toLowerCase().includes("free") ||
                innerText.toLowerCase().includes("middle school") ||
                innerText.toLowerCase().includes("location") ||
                innerText.toLowerCase().includes("selective"))
            ) {
              return innerText;
            } else {
              return null;
            }
          });
        }
      )
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

  const badNumbers = [];

  for (let i = 0; i < 2; i++) {
    try {
      console.log(i);
      const element = data[i];
      const page = await browser.newPage();
      const uniqueID = element["ID"];
      page.setDefaultTimeout(60000);
      await page.goto(element["website"]);
      await page.waitForSelector(
        "h1, h2, h3, h4, h5, h6, p, span, strong, em, b, i, small, ins, mark, del,ul,li,ol,dt,dd,dl"
      );

      const resultsArr = await page
        .$$eval(
          "h1, h2, h3, h4, h5, h6, p, span, strong, em, b, i, small, ins, mark, del,ul,li,ol,dt,dd,dl",
          (elements, uniqueID) => {
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
                  innerText.toLowerCase().includes("january") ||
                  innerText.toLowerCase().includes("february") ||
                  innerText.toLowerCase().includes("march") ||
                  innerText.toLowerCase().includes("april") ||
                  innerText.toLowerCase().includes("may") ||
                  innerText.toLowerCase().includes("june") ||
                  innerText.toLowerCase().includes("july") ||
                  innerText.toLowerCase().includes("august") ||
                  innerText.toLowerCase().includes("october") ||
                  innerText.toLowerCase().includes("november") ||
                  innerText.toLowerCase().includes("december") ||
                  innerText.toLowerCase().includes("free") ||
                  innerText.toLowerCase().includes("middle school") ||
                  innerText.toLowerCase().includes("location") ||
                  innerText.toLowerCase().includes("selective"))
              ) {
                console.log(uniqueID);
                return { uniqueID, data: innerText };
              } else {
                return null;
              }
            });
          }
        )
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
              (elem.href.toLowerCase().includes("faq") ||
                elem.href.toLowerCase().includes("registration") ||
                elem.href.toLowerCase().includes("apply"))
            ) {
              return elem.href;
            }
          });
        })
        .then((arr) => arr.filter(Boolean));

      const linksData = await processLinks(links);
      let oneDLinksData = [];
      for (let j = 0; j < linksData.length; j++) {
        const linkData = linksData[j];
        oneDLinksData = [...oneDLinksData, ...linkData];
      }
      returnData.push([...resultsArr, ...oneDLinksData]);

      await page.close();
      await writeFile("trial.json", JSON.stringify(returnData));
      console.log("Done with: ", i);
    } catch (error) {
      console.log(error);
      badNumbers.push(i);
    }
  }

  await browser.close();
  await writeFile("trial.json", JSON.stringify(returnData));
  console.log("BUGGY NUMBERS ARE: ", badNumbers);
};

extraData();
