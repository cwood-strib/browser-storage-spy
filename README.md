# Browser Storage Spy 🕵️

Analyze browser storage changes over a session

## Install

Be sure to run: 

```
npm install
```

### Usage

Create a text file that has a list of URLs with newlines separating them: 

```
https://m.startribune.com/
https://m.startribune.com/overnight-storms-leave-thousands-without-power-in-twin-cities/600195294/
```

Then run:

```sh
node src/index.js visit --json < urls.txt > page_view_data.json
```

This command will start a new browser session with a version of headless Chrome controlled by [Puppeteer](https://pptr.dev/). It will navigate from url to url in sequence. Browser storage data for each page view will be recorded and output.


## Commands

### Visit

Visit a series of urls and outputs raw data. This command can be slow.

```
node src/index.js visit --json < urls.txt > page_view_data.json
```

### Parse 

The `parse` command parses data generated by the `visit` command and outputs records of which browser storage items were added or changed between each page navigation.

```
node src/index.js parse --json page_view_data.json > event_data.json
```

Example output record: 
```
[
  // ...
  {
    event: 'changed',
    storage: 'localstorage',
    domain: 'https://m.startribune.com/',
    name: 'myStorageKey',
    urls: {
      before: https://m.startribune.com/,
      after: https://m.startribune.com/overnight-storms-leave-thousands-without-power-in-twin-cities/600195294/
    },
    values: { before: 'first value', after: 'second-value' }
  },
]
```


## Analysis

Useful analysis scripts exist in the `scripts` folder. 

The `parse` command pairs well with [`jq`](https://stedolan.github.io/jq/).
