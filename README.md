# batch-q

## Installation

```
$ npm install batch-q
```

## Usage

```js
const BatchQ = require('batch-q');

const bQueue = new BatchQ(async (items) => {
    // TODO: process `items` here.
}, /* list of options with their default values: */ {
    batchSize: 100, // process 100 items at once
    concurrency: 1, // run at most 1 instance of the processing function at a time
    timeout: 1000, // process the items after 1000 ms even if items.length < batchSize
});

bQueue.push(...items);
```

Run `npm test` for examples.

## License
Copyright (c) 2019 Martin Kolárik. Released under the MIT license.
