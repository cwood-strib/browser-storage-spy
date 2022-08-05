// const puppeteer = require('puppeteer');
const { StorageTypes, Commands, Changes } = require('./types');
const { getInput, getOutput, doOutput } = require("./utils");
const { readFromFile } = require("./commands/read");
const { visitUrls } = require("./commands/visit");

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
      console.error(`Command ${command} not supported`);
  }
}

cli().then(_ => {
  // Done
});