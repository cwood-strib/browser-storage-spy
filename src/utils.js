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

function parseEvents(pageViews) {
  let events = [];

  for (let i = 0; i < pageViews.length; i++) {
    let next = i + 1;

    if (next > pageViews.length - 1) {
      continue;
    }

    let aUrl = pageViews[i].url;
    let bUrl = pageViews[next].url;
    let aItems = pageViews[i].items;
    let bItems = pageViews[next].items;

    for (let item of bItems) {
      let { name, value, domain, type } = item;
      let aVersion = aItems.find(c => c.name === name && c.type === type);

      if (aVersion) {
        // Changed case
        if (aVersion.value !== value) {
          events.push({
            event: Changes.Changed,
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
      } else {
        // Added case
        events.push({
          event: Changes.Added,
          storage: type,
          domain: domain,
          name: name,
          urls: {
            before: aUrl,
            after: bUrl
          },
          values: {
            before: undefined, 
            after: value
          }
        });
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
  parseEvents,
  makeView,
  makeStorageItem,
  getInput,
  getOutput,
  doOutput
}