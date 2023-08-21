const cheerio = require('cheerio');
const Client = require('./Client');

// *? Get Novels By Genres  :
module.exports.getNovelsByGenres = async (genre) => {
  try {
    const res = await Client.axiosGet(
      `${process.env.BASE_SITE_URL}/novel-genre/${genre}`
    );
    if (!res.data) return { message: 'cannot fetch the data' };
    const $ = cheerio.load(res.data);

    return {
      genre: {
        text: $('.item-title')
          .text()
          .replace(/[\t\n]/g, ''),
        slug: genre,
      },
      all_genres: $('.genres_wrap .widget-content .genres ul li a')
        .toArray()
        .map((Genre) => ({
          text: $(Genre)
            .text()
            .replace(/[\t\n]/g, '')
            .trim(),
          slug: $(Genre)
            .attr('href')
            ?.split('/')
            ?.filter((i) => i)
            ?.at(-1),
        })),
      novels: $('.page-content-listing.item-big_thumbnail .page-item-detail')
        .toArray()
        .map((novel) => ({
          novel_slug: $(novel)
            .find('.item-thumb a')
            .first()
            .attr('href')
            ?.split('/')
            ?.filter((i) => i)
            ?.at(-1),
          title: $(novel)
            .find('.item-summary .post-title h3')
            .text()
            .replace(/[\t\n]/g, '')
            .trim(),
          image: $(novel).find('.item-thumb a img').attr('data-src'),
          chapters: $(novel)
            .find('.item-summary .list-chapter .chapter-item .chapter a')
            .toArray()
            .map((ch) => ({
              text: $(ch).text().trim(),
              slug: $(ch)
                .attr('href')
                ?.split('/')
                ?.filter((i) => i)
                ?.at(-1),
            })),
        })),
    };
  } catch (error) {
    console.log(error);
  }
};

// *? Get Home Novels With Categories  :
module.exports.getHomeNovels = async () => {
  try {
    const res = await Client.axiosGet(process.env.BASE_SITE_URL);
    if (!res.data) return { message: 'cannot fetch the data' };
    const $ = cheerio.load(res.data);

    // console.log($('.c-page').first().html());

    return {
      last_updates: $(
        '.c-blog-listing #loop-content.page-content-listing.item-big_thumbnail .page-item-detail'
      )
        .toArray()
        .map((novel, i) =>
          novel && i == 0
            ? console.log('\n\n', novel, '\n\n')
            : {
                novel_slug: $(novel)
                  .find('.item-thumb a')
                  .first()
                  .attr('href')
                  ?.split('/')
                  ?.filter((i) => i)
                  ?.at(-1),
                title: $(novel)
                  .find('.item-summary .post-title h3')
                  .text()
                  .replace(/[\t\n]/g, '')
                  .trim(),
                image: $(novel).find('.item-thumb a img').attr('src'),
                chapters: $(novel)
                  .find('.item-summary .list-chapter .chapter-item .chapter a')
                  .toArray()
                  .map((ch) => ({
                    text: $(ch).text().trim(),
                    slug: $(ch)
                      .attr('href')
                      ?.split('/')
                      ?.filter((i) => i)
                      ?.at(-1),
                  })),
              }
        ),

      popular_novels: $('.c-page')
        .first()
        .find('.page-item-detail')
        .toArray()
        .map((novel) => ({
          novel_slug: $(novel)
            .find('a')
            ?.first()
            ?.attr('href')
            ?.split('/')
            ?.filter((i) => i)
            ?.at(-1),
          title: $(novel)
            .find('a')
            ?.first()
            .attr('title')
            .replace(/[\t\n]/g, '')
            .trim(),
          image: $(novel).find('a img').attr('src'),
          chapters: [],
          // $(novel)
          //   .find('.popular-content .list-chapter .chapter-item .chapter a')
          //   .toArray()
          //   .map((ch) => ({
          //     text: $(ch).text().trim(),
          //     slug: $(ch)
          //       .attr('href')
          //       ?.split('/')
          //       ?.filter((i) => i)
          //       ?.at(-1),
          //   })),
        })),
    };
  } catch (error) {
    console.log(error);
  }
};

// *? Get Novel By Slug :
module.exports.getNovelBySlug = async (novelSlug) => {
  try {
    if (!novelSlug) return null;
    const res = await Client.axiosGet(
      `${process.env.BASE_SITE_URL}/novel/${novelSlug}`
    );

    if (!res.data) return { message: 'cannot fetch the data' };

    const $ = cheerio.load(res.data);

    // const chaptersData = await this.getNovelChaptersBySlug(novelSlug);

    return {
      title: $('.post-title h1')
        .text()
        .replace(/[\t\n]/g, '')
        .trim(),
      image: $('.tab-summary .summary_image a img').attr('data-src'),
      story: $('.summary__content p')
        .toArray()
        .map((p) =>
          $(p)
            .text()
            .replace(/[\t\n]/g, '')
            .trim()
        )
        .filter((p) => p),
      rank: $('.post-content > div:nth-child(2) > div:nth-child(2)')
        .text()
        .replace(/[\t\n]/g, '')
        .trim(),

      alternative: $('div.post-content_item:nth-child(3) > div:nth-child(2)')
        .text()
        .replace(/[\t\n]/g, '')
        .trim(),

      authors: $('.author-content a')
        .toArray()
        .map((author) => ({
          text: $(author).text().trim(),
          slug: $(author)
            .attr('href')
            .split('/novel-author/')
            .at(-1)
            .replace(/[/]/g, ''),
        })),

      genres: $('.genres-content a')
        .toArray()
        .map((genre) => ({
          text: $(genre).text(),
          slug: $(genre)
            .attr('href')
            .split('/novel-genre/')
            .at(-1)
            .replace(/[/]/g, ''),
        })),
      type: $('div.post-content_item:nth-child(6) > div:nth-child(2)')
        .text()
        .trim(),
      published_at: $(
        'div.post-content_item:nth-child(1) > div:nth-child(2) > a:nth-child(1)'
      )
        .text()
        .trim(),
      status: $('.post-status > div:nth-child(2) > div:nth-child(2)')
        .text()
        .trim(),
      chapters: [],
    };
  } catch (error) {
    console.log(error);
  }
};

// *? Get Chapter By Slug :
module.exports.getChapterBySlug = async (novelSlug, chapterSlug) => {
  try {
    if (!novelSlug) return null;
    const res = await Client.axiosGet(
      `${process.env.BASE_SITE_URL}/novel/${novelSlug}/${chapterSlug}`
    );

    if (!res.data) return { message: 'cannot fetch the data' };
    const $ = cheerio.load(res.data);

    const PrevElem = $('div.select-pagination a.prev_page:nth-child(1)');
    const NextElem = $('div.select-pagination a.next_page:nth-child(1)');

    return {
      title: $('.breadcrumb > li:nth-child(2) > a:nth-child(1)')
        .text()
        .replace(/[\t\n]/g, '')
        .trim(),
      prev: {
        disabled: $(PrevElem).length === 0,
        slug:
          $(PrevElem)
            ?.attr('href')
            ?.split('/')
            ?.filter((i) => i)
            ?.at(-1) || '#',
      },
      next: {
        disabled: $(NextElem).length === 0,
        slug:
          $(NextElem)
            ?.attr('href')
            ?.split('/')
            ?.filter((i) => i)
            ?.at(-1) || '#',
      },
      chapter: {
        title: $('.wp-manga-nav .entry-header_wrap li.active')
          .text()
          ?.replace(/[\t\n]/g, ' ')
          ?.trim(),
        content: $('.reading-content p')
          .toArray()
          .map(
            (p) => $(p)?.text()?.replace(/[\t]/g, ' ')?.trim()
            // .replace(/[\n]/g, "<br />")
          ),
      },
    };
  } catch (error) {
    console.log(error);
  }
};

// *? Search For Novel By Name :
module.exports.searchNovelByName = async (novelName, page, orderBy, genres) => {
  try {
    // if (!novelName) return null;
    let url = `${process.env.BASE_SITE_URL}/page/${page}/?s=${novelName}&post_type=wp-manga&m_orderby=${orderBy}`;

    if (genres.length > 0) {
      genres.map((genre) => (url += '&genre[]=' + encodeURI(genre)));
    }

    const res = await Client.axiosGet(url);

    if (!res.data) return { message: 'cannot fetch the data' };
    const $ = cheerio.load(res.data);

    const results = $(
      '.search-wrap .tab-content-wrap .c-tabs-item .c-tabs-item__content'
    )
      .toArray()
      .map((novel) => ({
        novel_slug: $(novel)
          ?.find('.tab-thumb a')
          ?.first()
          ?.attr('href')
          ?.split('/')
          ?.filter((i) => i)
          ?.at(-1),
        title: $(novel)
          ?.find('.tab-summary .post-title h3 a')
          ?.text()
          ?.replace(/[\t\n]/g, '')
          ?.trim(),
        image: $(novel).find('.tab-thumb a img').attr('data-src'),
        alternative: $(novel)
          ?.find('.tab-summary .post-content .mg_alternative .summary-content')
          ?.text()
          ?.replace(/[\t\n]/g, '')
          ?.trim(),
        status: $(novel)
          ?.find('.tab-summary .post-content .mg_status .summary-content')
          ?.text()
          ?.replace(/[\t\n]/g, '')
          ?.trim(),
        chapters: [
          {
            text: $(novel)
              ?.find('.tab-meta .latest-chap .chapter a')
              ?.text()
              ?.replace(/[\t\n]/g, '')
              ?.trim(),
            slug: $(novel)
              ?.find('.tab-meta .latest-chap .chapter a')
              ?.attr('href')
              ?.split('/')
              ?.filter((i) => i)
              ?.at(-1),
          },
        ],
      }));

    return {
      all_genres: $('div.checkbox')
        .toArray()
        .map((genre) => ({
          text: $(genre).find('label').text().trim(),
          slug: $(genre).find('input').val(),
        })),
      genres,
      results_count: parseInt(
        $('.search-wrap h1.h4')
          .text()
          .replace(/[^0-9]/g, '')
      ),
      results,
    };
  } catch (error) {
    console.log(error);
  }
};

// *! Dynamic with puppeteer !* //
// *? Get Novel Chapters By Slug :
module.exports.getNovelChaptersBySlug = async (novelSlug) => {
  try {
    if (!novelSlug) return null;
    // const res = await Client.get(
    //   `${process.env.BASE_SITE_URL}/novel/${novelSlug}`,
    //   {},
    //   'ul li.wp-manga-chapter'
    // );
    const res = await Client.axiosGet(
      `${process.env.BASE_SITE_URL}/novel/${novelSlug}/ajax/chapters`,
      {
        method: 'POST',
      }
    );

    // * [POST] "https://arnovel.me/home/novel/<NOVEL_SLUG>/ajax/chapters/"

    if (!res.data) return { message: 'cannot fetch the data' };
    const $ = cheerio.load(res.data);

    const chapters = $('ul li.wp-manga-chapter > a')
      .toArray()
      .map((ch) => ({
        text: $(ch)
          ?.text()
          ?.replace(/[\t\n]/g, '')
          ?.trim(),
        slug: $(ch)
          ?.attr('href')
          ?.split('/')
          ?.filter((chap) => chap)
          ?.at(-1),
      }));
    return { chapters };
  } catch (error) {
    console.log(error);
  }
};
