const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeDuckDuckGoLinks(searchQuery, maxPages = 1, maxLinks = Infinity) {
  let links = [];

  for (let page = 0; page < maxPages; page++) {
    const searchUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(searchQuery)}&s=${page * 1}`;

    try {
      const response = await axios.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36'
        }
      });

      const $ = cheerio.load(response.data);

      $('div.result').each((_, element) => {
        const link = $(element).find('a.result__url').attr('href');
        if (link && links.length < maxLinks) {
          links.push(link);
        }
      });

      // Break the loop if there are no more results or if the maximum number of links is reached
      if ($('div.result').length === 0 || links.length >= maxLinks) {
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
scrapeDuckDuckGoLinks('iphone 13', 4, 20) // Adjust the second parameter to change the number of pages to scrape, and the third parameter to limit the number of links
  .then((links) => {
    console.log(`DuckDuckGo search result links (${links.length}):`, links);
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });
