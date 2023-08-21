const router = require('express').Router();
const axios = require('axios');
const NovelRoutes = require('./NovelRoutes');
const cheerio = require('cheerio');
const scraper = require('../Services/scraper-tester');

router.get('/', async (req, res, next) => {
  const scraperClient = await scraper(
    'https://kolnovel.com/spursuit-of-the-truthz-200524/'
  );
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  const formData = {
    seri: 169285,
    ID: 200524,
  };

  const postData = Object.keys(formData)
    .map(
      (key) => encodeURIComponent(key) + '=' + encodeURIComponent(formData[key])
    )
    .join('&');

  const response = await axios.post(
    'https://kolnovel.com/wp-content/themes/lightnovel/template-parts/single/list_1.php',
    postData,
    config
  );
  console.log('Response:', response.data);

  const data = {
    title: scraperClient.find('title').text(),
    chapters: null,
    isSerieID: scraperClient.find('html').text().includes('169281'),
  };

  res.send({ message: 'Ok api is working 🚀', data });
});

router.use('/novels', NovelRoutes);

module.exports = router;
