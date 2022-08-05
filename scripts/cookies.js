/**
 * Filters a given event data file down to only events were a cookie changed value
 */
const { readFileSync } = require("fs");
const { StorageTypes, Changes } = require("../src/types");

let [nodePath, scriptPath, dataPath] = process.argv;

if (!dataPath) {
    console.error("No file path given")
    process.exit(1);
}

let pageViews = JSON.parse(readFileSync(dataPath));

// All cookies that changed
let changedCookies = pageViews.filter(res => res.storage === StorageTypes.Cookie && res.type === Changes.Changed)

console.log(changedCookies);
    
