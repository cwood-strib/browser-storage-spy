const { readFileSync } = require("fs");
const { parseEvents } = require("../utils");

function readFromFile(path) {
  // TODO: Error handling
  let pageViews = JSON.parse(readFileSync(path));
  return parseEvents(pageViews);
}

module.exports = {
  readFromFile
}