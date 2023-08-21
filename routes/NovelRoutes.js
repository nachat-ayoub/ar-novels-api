const router = require('express').Router();
const {
  getNovelBySlug,
  getChapterBySlug,
  searchNovelByName,
  getNovelChaptersBySlug,
  getHomeNovels,
  getNovelsByGenres,
} = require('../Services/NovelService');

// *! Home Route :
router.get('/', async (req, res, next) => {
  // Start time
  const start_time = new Date();
  const homeData = await getHomeNovels();
  // End time
  const end_time = new Date();
  const done_in = ((end_time - start_time) / 1000).toFixed(2) + 's';

  res.status(200).json({
    done_in,
    ...homeData,
  });
});

// *! Search For Novel Route :
router.get('/search', async (req, res, next) => {
  const novelName = req.query.s;
  const orderBy = req.query.orderby || '';
  const page = parseInt(req.query.page) || 1;
  const genres = req.query.genre || [];

  // ! Orders
  // latest
  // alphabet
  // rating
  // trending
  // views
  // new-manga

  // Start time
  const start_time = new Date();

  const novelsData = await searchNovelByName(novelName, page, orderBy, genres);

  // End time
  const end_time = new Date();
  const done_in = ((end_time - start_time) / 1000).toFixed(2) + 's';

  if (!novelsData)
    return res.status(500).json({
      done_in,
      query: novelName,
      message: 'Error: Somthing Whent Wrong!',
    });
  res.status(200).json({
    done_in,
    query: novelName,
    pages: Math.ceil(novelsData.results_count / 12),
    ...novelsData,
  });
});

// *! Novels By Genre Route :
router.get('/genre/:genre', async (req, res, next) => {
  try {
    // Genre Slug
    const genre = req.params.genre;

    // Start time
    const start_time = new Date();
    const novelsData = await getNovelsByGenres(genre);
    // End time
    const end_time = new Date();
    const done_in = ((end_time - start_time) / 1000).toFixed(2) + 's';

    if (!novelsData)
      return res.status(500).json({
        message: 'Error: Somthing Whent Wrong!',
      });
    res.status(200).json({
      done_in,
      ...novelsData,
    });
  } catch (error) {
    console.log(error);
  }
});

// *! Novel Page Route :
router.get('/:novelSlug', async (req, res, next) => {
  const novelSlug = req.params.novelSlug;

  // Start time
  const start_time = new Date();

  const novelData = await getNovelBySlug(novelSlug);

  // End time
  const end_time = new Date();
  const done_in = ((end_time - start_time) / 1000).toFixed(2) + 's';

  if (!novelData)
    return res.status(500).json({
      message: 'Error: Somthing Whent Wrong!',
    });
  res.status(200).json({
    done_in,
    novel_slug: novelSlug,
    ...novelData,
  });
});

// *! Novel Page Route :
router.get('/:novelSlug/chapters', async (req, res, next) => {
  const novelSlug = req.params.novelSlug;

  // Start time
  const start_time = new Date();

  const novelData = await getNovelChaptersBySlug(novelSlug);

  // End time
  const end_time = new Date();
  const done_in = ((end_time - start_time) / 1000).toFixed(2) + 's';

  if (!novelData)
    return res.status(500).json({
      message: 'Error: Somthing Whent Wrong!',
    });
  res.status(200).json({
    done_in,
    novel_slug: novelSlug,
    ...novelData,
  });
});

// *! Chapter Page Route :
router.get('/:novelSlug/:chapterSlug', async (req, res, next) => {
  const { novelSlug, chapterSlug } = req.params;

  // Start time
  const start_time = new Date();

  const chapterData = await getChapterBySlug(novelSlug, chapterSlug);

  // End time
  const end_time = new Date();
  const done_in = ((end_time - start_time) / 1000).toFixed(2) + 's';

  if (!chapterData)
    return res.status(500).json({
      message: 'Error: Somthing Whent Wrong!',
    });
  res.status(200).json({
    done_in,
    novel_slug: novelSlug,
    chapter_slug: chapterSlug,
    ...chapterData,
  });
});

module.exports = router;
