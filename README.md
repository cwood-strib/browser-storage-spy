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

Visit a series of urls and capture data.

```
node src/index.js visit --json < urls.txt > page_view_data.json
```

### Read 

The `read` command takes a path to a data file generated by `visit` and outputs records of which browser storage items were added or changed between each page navigation.

```
node src/index.js read --json page_view_data.json > event_data.json
```

Example output record: 
```
[
  // ...
  {
    type: 'changed',
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



## Scripts

Useful analysis scripts exist in the `scripts` folder.