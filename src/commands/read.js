const { readFileSync } = require("fs");
const { getChangedCookieValues } = require("../utils");

function readFromFile(path) {
  // TODO: Error handling
  let pageViews = JSON.parse(readFileSync(path));
  return getChangedCookieValues(pageViews);
}

module.exports = {
  readFromFile
}