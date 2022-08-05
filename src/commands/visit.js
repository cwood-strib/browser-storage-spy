const puppeteer = require("puppeteer");
const { makeView } = require("../utils");

async function visitUrls(urls) {
  const pageViews = [];

  const browser = await puppeteer.launch();
  const page = await browser.newPage();


  for (let url of urls) {
    await page.goto(url, {
      timeout: 0
    });

    const client = await page.target().createCDPSession();
    const cookies = (await client.send('Network.getAllCookies')).cookies;

    pageViews.push(makeView(url, cookies))
  }

  await browser.close();
  return pageViews;
};

module.exports = {
  visitUrls
}