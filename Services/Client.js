const axios = require('axios');
// const puppeteer = require('puppeteer');

const Client = {
  // Normal Fetch :
  axiosGet: async (url, config) =>
    await axios.request({
      method: config?.method ?? 'GET',
      url: encodeURI(url),
      headers: {
        Referer: encodeURI(url),
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.203',
      },
    }),

  // Dynamic Fetch :
  // get: async (url, config, waitForElementSelector) => {
  //   const browser = await puppeteer.launch({
  //     headless: true,
  //     args: ['--no-sandbox'],
  //   });
  //   const page = await browser.newPage();
  //   await page.goto(url);
  //   if (waitForElementSelector)
  //     await page.waitForSelector(waitForElementSelector);

  //   const data = await page.content();
  //   await browser.close();

  //   return { data };
  // },
};

module.exports = Client;
