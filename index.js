const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeDuckDuckGoLinks(searchQuery, maxPages = 1) {
  let links = [];

  for (let page = 0; page < maxPages; page++) {
    const searchUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(searchQuery)}&s=${page * 3}`;

    try {
      const response = await axios.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36'
        }
      });

      const $ = cheerio.load(response.data);

      $('div.result').each((_, element) => {
        const link = $(element).find('a.result__url').attr('href');
        if (link) {
          links.push(link);
        }
      });

      // Break the loop if there are no more results
      if ($('div.result').length === 0) {
        break;
      }

      // Wait between requests to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error:', error.message);
      return links;
    }
  }

  return links;
}

// Example usage
scrapeDuckDuckGoLinks('iphone 13', 100) // Adjust the second parameter to change the number of pages to scrape
  .then((links) => {
    console.log(`DuckDuckGo search result links (${links.length}):`, links);
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });
