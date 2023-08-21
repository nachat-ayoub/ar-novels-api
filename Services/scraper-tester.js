const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async function scraper(url) {
  try {
    const resp = await axios.get(url);
    const $ = cheerio.load(resp.data);

    return { find: (selector) => $(selector) };
  } catch (error) {
    console.log(error);
  }
};
