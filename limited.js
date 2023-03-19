const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeDuckDuckGoLinks(searchQuery) {
  const searchUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(searchQuery)}`;

  try {
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);

    const links = [];
    $('div.result').each((_, element) => {
      const link = $(element).find('a.result__url').attr('href');
      if (link) {
        links.push(link);
      }
    });

    return links;
  } catch (error) {
    console.error('Error:', error.message);
    return [];
  }
}

// Example usage
scrapeDuckDuckGoLinks('iphone price')
  .then((links) => {
    console.log('DuckDuckGo search result links:', links);
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });
