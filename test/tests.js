const delay = require('delay');
const expect = require('chai').expect;
const BatchQueue = require('../src/BatchQueue');
let lastLog = Date.now();

function log (...args) {
	console.log(...args, `+${Date.now() - lastLog}ms`);
	lastLog = Date.now();
}

function makeTest (itemCount, processingDelay, { batchSize, concurrency, timeout }) {
	let lastCall = Date.now();
	let running = 0;
	let itemsC = 0;
	let batchQ;

	return new Promise((resolve) => {
		batchQ = new BatchQueue((items) => {
			log('got items:', items);
			expect(running++).to.be.lessThan(concurrency);

			if (items.length < batchSize) {
				expect(timeout).to.be.greaterThan(0);
				expect(Date.now() - lastCall).to.be.at.least(timeout);
			}

			itemsC += items.length;

			if (itemsC === itemCount) {
				resolve();
			}

			return delay(processingDelay).then(() => {
				running--;
			});
		}, { batchSize, concurrency, timeout });

		for (let i = 0; i < itemCount; i++) {
			batchQ.push(i);
		}
	}).finally(() => {
		batchQ.destroy();
	});
}

describe('batch-queue', () => {
	it('works with batchSize: 1, concurrency: 1, timeout: 0', () => {
		return makeTest(10, 200, { batchSize: 1, concurrency: 1, timeout: 0 });
	});

	it('works with batchSize: 2, concurrency: 1, timeout: 0', () => {
		return makeTest(10, 400, { batchSize: 2, concurrency: 1, timeout: 0 });
	});

	it('works with batchSize: 1, concurrency: 2, timeout: 0', () => {
		return makeTest(10, 400, { batchSize: 1, concurrency: 2, timeout: 0 });
	});

	it('works with batchSize: 2, concurrency: 2, timeout: 0', () => {
		return makeTest(10, 800, { batchSize: 2, concurrency: 2, timeout: 0 });
	});

	it('works with batchSize: 3, concurrency: 1, timeout: 400', () => {
		return makeTest(10, 400, { batchSize: 3, concurrency: 1, timeout: 400 });
	});
});
