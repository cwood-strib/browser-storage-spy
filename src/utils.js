const { listeners } = require("process");
const { Changes, StorageTypes, Output } = require("./types");
const readline = require('readline');

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

function getOutput() {
  for (let part of process.argv) {
    if (part === "--json") {
      return Output.Json;
    }
  }

  return Output.Stdio;
}

function doOutput(fmt, events) {
  switch (fmt) {
    case Output.Json: 
      console.log(JSON.stringify(events));
      break;
    case Output.Stdio:
      console.log(events)
      break;
  }
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
    let aCookies = pageViews[i].items;
    let bCookies = pageViews[next].items;

    for (let cookie of bCookies) {
      let { name, value, domain, type } = cookie;
      let aVersion = aCookies.find(c => c.name === name);
      if (aVersion) {
        if (aVersion.value !== value) {
          events.push({
            type: Changes.Changed,
            storage: type,
            domain: domain,
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

function makeView(url, items) {
  return {
    url,
    items
  }
}

function makeStorageItem(type, data, domain = "") {
  switch (type) {
    case StorageTypes.Cookie:
      return {
        type: StorageTypes.Cookie,
        name: data.name,
        value: data.value,
        domain: data.domain
      };
    case StorageTypes.LocalStorage:
      return {
        type: StorageTypes.LocalStorage,
        name: data[0],
        value: data[1],
        domain: domain
      }
    default:
      throw new Error(`Unsupported storage type ${type}`);
  }

}

module.exports = {
  getChangedCookieValues,
  makeView,
  makeStorageItem,
  getInput,
  getOutput,
  doOutput
}