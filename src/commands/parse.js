const { readFileSync } = require("fs");
const { parseEvents } = require("../utils");

function parseFromFile(path) {
  // TODO: Error handling
  let pageViews = JSON.parse(readFileSync(path));
  return parseEvents(pageViews);
}

module.exports = {
  parseFromFile 
}