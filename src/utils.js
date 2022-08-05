const { listeners } = require("process");
const { Changes, StorageTypes } = require("./types");
const readline = require('readline');
const { resolve } = require("path");

function getInput() {
  let lines = [];

  return new Promise((resolve, reject) => {
    let rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });

    // This seems to push all as a single line
    rl.on('line', function (line) {
      lines.push(line);
    })

    resolve(lines)
  })
}

function getChangedCookieValues(pageViews) {
  let events = [];

  for (let i = 0; i < pageViews.length; i++) {
    let next = i + 1;

    if (next > pageViews.length - 1) {
      continue;
    }

    let aUrl = pageViews[i].url;
    let bUrl = pageViews[next].url;
    let aCookies = pageViews[i].cookies;
    let bCookies = pageViews[next].cookies;

    for (let cookie of bCookies) {
      let { name, value } = cookie;
      let aVersion = aCookies.find(c => c.name === name);
      if (aVersion) {
        if (aVersion.value !== value) {
          events.push({
            type: Changes.Changed,
            storage: StorageTypes.Cookie,
            domain: cookie.domain,
            name: name,
            urls: {
              before: aUrl,
              after: bUrl
            },
            values: {
              before: aVersion.value,
              after: value
            }
          });
        }
      }
    }
  }

  return events;
}

function makeView(url, cookies) {
  return {
    url,
    cookies
  }
}

module.exports = {
  getChangedCookieValues,
  makeView,
  getInput
}