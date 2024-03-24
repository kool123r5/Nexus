const { read } = require("fs");
const puppeteer = require("puppeteer");
const { readFile, writeFile } = require("fs").promises;

// BUGGY NUMBERS ARE:  [
//    36,  42,  51,  56,  58,  59,  61,
//    92, 105, 153, 188, 206, 241, 254,
//   287, 305, 325, 340, 366, 383, 416,
//   432, 439, 447, 459, 471, 484, 486
// ]

// enter the file name of the json file we are going to be creating using scraping
const filename = "websiteScrapedDataPartArjun.json"; //change to Anish or Kushal depending on who you are

function removeDuplicates(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

const readJSON = async () => {
  const data = await readFile("activitiesListOG.json", {
    encoding: "utf-8",
  });
  return JSON.parse(data);
};
const readAnotherJSON = async (filename) => {
  const data = await readFile(filename, { encoding: "utf-8" });
  return JSON.parse(data);
};

async function processLinks(links) {
  const linksData = [];
  const browser = await puppeteer.launch({
    headless: "new",
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(120_000 * links.length * 2);
  for (const link of links) {
    try {
      console.log("Gone to: ", link);
      await page.goto(link);
      await page.waitForSelector(
        "h1, h2, h3, h4, h5, h6, p, span, strong, em, b, i, small, ins, mark, del, ul, li, ol, dt, dd, dl,div"
      );
      const linkResult = await page
        .$$eval(
          "h1, h2, h3, h4, h5, h6, p, span, strong, em, b, i, small, ins, mark, del, ul, li, ol, dt, dd, dl,div",
          (elements) => {
            return elements.map((element) => {
              let innerText = element.innerText.trim();
              const datePattern =
                /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;

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
                  innerText.toLowerCase().includes("remote") ||
                  innerText.toLowerCase().includes("hybrid") ||
                  innerText.toLowerCase().includes("competition") ||
                  innerText.toLowerCase().includes("internship") ||
                  innerText.toLowerCase().includes("intern") ||
                  innerText.toLowerCase().includes("stipdend") ||
                  innerText.toLowerCase().includes("salary") ||
                  innerText.toLowerCase().includes("paid") ||
                  innerText.toLowerCase().includes("prize") ||
                  innerText.toLowerCase().includes("cash") ||
                  innerText.toLowerCase().includes("grade") ||
                  innerText.toLowerCase().includes("sophomore") ||
                  innerText.toLowerCase().includes("junior") ||
                  innerText.toLowerCase().includes("freshman") ||
                  innerText.toLowerCase().includes("senior") ||
                  innerText.toLowerCase().includes("application") ||
                  innerText.toLowerCase().includes("competitive") ||
                  innerText.toLowerCase().includes("day") ||
                  innerText.toLowerCase().includes("days") ||
                  innerText.toLowerCase().includes("week") ||
                  innerText.toLowerCase().includes("weeks") ||
                  innerText.toLowerCase().includes("month") ||
                  innerText.toLowerCase().includes("months") ||
                  innerText.toLowerCase().includes("selective") ||
                  datePattern.test(innerText.toLowerCase()))
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
    } catch (error) {
      continue;
    }
  }

  await browser.close();
  return linksData;
}

const extraData = async () => {
  const data = await readJSON();
  const returnData = await readAnotherJSON(filename);

  const browser = await puppeteer.launch({
    headless: "new",
  });

  const badNumbers = [];
  const startNumber = 0; //Arjun -> 0, Anish -> 164, Kushal -> 329
  const endNumber = 164; // Arjun -> 164, Anish -> 329, Kushal -> data.length
  for (let i = 299; i < data.length; i++) {
    try {
      console.log(i);
      const element = data[i];
      const page = await browser.newPage();
      const uniqueID = element["ID"];
      page.setDefaultTimeout(120_000 * 2);
      await page.goto(element["website"]);
      await page.waitForSelector(
        "h1, h2, h3, h4, h5, h6, p, span, strong, em, b, i, small, ins, mark, del, ul, li, ol, dt, dd, dl,div"
      );

      const resultsArr = await page
        .$$eval(
          "h1, h2, h3, h4, h5, h6, p, span, strong, em, b, i, small, ins, mark, del, ul, li, ol, dt, dd, dl,div",
          (elements) => {
            return elements.map((element) => {
              let innerText = element.innerText.trim();
              const datePattern =
                /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;

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
                  innerText.toLowerCase().includes("remote") ||
                  innerText.toLowerCase().includes("hybrid") ||
                  innerText.toLowerCase().includes("competition") ||
                  innerText.toLowerCase().includes("internship") ||
                  innerText.toLowerCase().includes("intern") ||
                  innerText.toLowerCase().includes("stipdend") ||
                  innerText.toLowerCase().includes("salary") ||
                  innerText.toLowerCase().includes("paid") ||
                  innerText.toLowerCase().includes("prize") ||
                  innerText.toLowerCase().includes("cash") ||
                  innerText.toLowerCase().includes("grade") ||
                  innerText.toLowerCase().includes("sophomore") ||
                  innerText.toLowerCase().includes("junior") ||
                  innerText.toLowerCase().includes("freshman") ||
                  innerText.toLowerCase().includes("senior") ||
                  innerText.toLowerCase().includes("application") ||
                  innerText.toLowerCase().includes("competitive") ||
                  innerText.toLowerCase().includes("day") ||
                  innerText.toLowerCase().includes("days") ||
                  innerText.toLowerCase().includes("week") ||
                  innerText.toLowerCase().includes("weeks") ||
                  innerText.toLowerCase().includes("month") ||
                  innerText.toLowerCase().includes("months") ||
                  innerText.toLowerCase().includes("selective") ||
                  datePattern.test(innerText.toLowerCase()))
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
                elem.href
                  .toLowerCase()
                  .includes("frequently-asked-questions") ||
                elem.href.toLowerCase().includes("faqs") ||
                elem.href.toLowerCase().includes("application") ||
                elem.href.toLowerCase().includes("rule") ||
                elem.href.toLowerCase().includes("rules") ||
                elem.href.toLowerCase().includes("info") ||
                elem.href.toLowerCase().includes("information") ||
                elem.href.toLowerCase().includes("forms") ||
                elem.href.toLowerCase().includes("participate") ||
                elem.href.toLowerCase().includes("register") ||
                elem.href.toLowerCase().includes("about") ||
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
      returnData.push({
        data: removeDuplicates([...resultsArr, ...oneDLinksData]),
        id: uniqueID,
      });

      await page.close();
      await writeFile(filename, JSON.stringify(returnData));
      console.log("Done with: ", i);
    } catch (error) {
      console.log(error);
      badNumbers.push(i);
    }
  }

  await browser.close();
  await writeFile(filename, JSON.stringify(returnData));
  console.log("BUGGY NUMBERS ARE: ", badNumbers);
};

extraData();
