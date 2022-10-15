const axios = require("axios");
const puppeteer = require("puppeteer");

const Client = {
  // Normal Fetch :
  axiosGet: async (url, config) => await axios.get(encodeURI(url)),

  // Dynamic Fetch :
  get: async (url, config, waitForElementSelector) => {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(url);
    if (waitForElementSelector)
      await page.waitForSelector(waitForElementSelector);

    const data = await page.content();
    await browser.close();

    return { data };
  },
};

module.exports = Client;
