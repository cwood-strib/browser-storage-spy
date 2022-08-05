const puppeteer = require("puppeteer");
const { StorageTypes } = require("../types");
const { makeView, makeStorageItem } = require("../utils");

async function visitUrls(urls) {
  const pageViews = [];

  const browser = await puppeteer.launch();
  const page = await browser.newPage();


  for (let url of urls) {
    await page.goto(url, {
      timeout: 0
    });

    const cdp = await page.target().createCDPSession();
    const cookies = (await cdp.send('Network.getAllCookies')).cookies;

    const localStorageItems = await cdp.send('DOMStorage.getDOMStorageItems', {
      storageId: {
        securityOrigin: await page.evaluate(() => window.origin),
        isLocalStorage: true,
      },
    });

    let localItems = Array.isArray(localStorageItems.entries) ? localStorageItems.entries.map(l => makeStorageItem(StorageTypes.LocalStorage, l, url)) : [];
    let cookieItems = Array.isArray(cookies) ? cookies.map(c => makeStorageItem(StorageTypes.Cookie, c))  : [];

    let items = [ ...cookieItems, ...localItems ];

    pageViews.push(makeView(url, items))
  }

  await browser.close();
  return pageViews;
};

module.exports = {
  visitUrls
}