// const puppeteer = require('puppeteer');
const { Commands } = require('./types');
const { getInput, getOutput, doOutput } = require("./utils");
const { parseFromFile } = require("./commands/parse");
const { visitUrls } = require("./commands/visit");

async function cli() {
  if (process.argv.length < 3) {
    console.error(`Must specify a command. Choose ${Commands.Read} or ${Commands.Visit}`);
  }

  let command = process.argv[2];
  let outFmt = getOutput();

  switch (command) {
    case Commands.Parse:
      let file = process.argv[3];
      let events = parseFromFile(file);
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
}).catch(e => {
  process.exit(1);
});