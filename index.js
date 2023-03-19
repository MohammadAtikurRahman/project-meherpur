const puppeteer = require('puppeteer');

async function searchGoogle(term) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://www.google.com/search?q=${term}&num=100`);

  // Scroll down to load more results
  await page.evaluate(async () => {
    await new Promise(resolve => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 200);
    });
  });

  // Wait for a short delay to ensure all results have loaded
  await page.waitForTimeout(1000);

  const results = await page.evaluate(() => {
    const titles = Array.from(document.querySelectorAll('h3'));
    const urls = Array.from(document.querySelectorAll('a'));
    return titles.map((title, index) => {
      return {
        title: title.textContent,
        url: urls[index].href
      };
    });
  });

  await browser.close();

 


  return results;
}
searchGoogle('iphone 13')
  .then(results => console.log(results))
  .catch(error => console.error(error));
