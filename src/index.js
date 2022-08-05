// const puppeteer = require('puppeteer');
const { StorageTypes, Commands, Changes } = require('./types');
const { getInput, makeView } = require("./utils");
const { readFromFile } = require("./commands/read");
const { visitUrls } = require("./commands/visit");

const Output = {
  Json: "json",
  Stdio: "std"
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

async function cli() {
  if (process.argv.length < 3) {
    console.error(`Must specificy a command. Choose ${Commands.Read} or ${Commands.Visit}`);
  }

  let command = process.argv[2];
  let outFmt = getOutput();

  switch (command) {
    case Commands.Read:
      let file = process.argv[3];
      let events = readFromFile(file);
      doOutput(outFmt, events);
      break;
    case Commands.Visit:
      // TODO: url validation 
      let urls = await getInput();
      let pageViews = await visitUrls(urls);
      doOutput(outFmt, pageViews);
      break;
    default:
      console.error(`Comamnd ${command} not supported`);
  }
}

cli().then(_ => {
  // Done
});