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

let records = JSON.parse(readFileSync(dataPath));

// All records that changed
let changes = records.filter(res => res.type === Changes.Changed)

console.log(changes);
    
