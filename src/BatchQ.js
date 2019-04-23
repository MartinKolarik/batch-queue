class BatchQ {
	constructor (callback, { batchSize = 100, concurrency = 1, timeout = 1000 } = {}) {
		this.queue = [];
		this.timeout = timeout;
		this.callback = callback;
		this.batchSize = batchSize;
		this.concurrency = concurrency;
		this.timeoutHandle = null;
		this.runningCallbacks = 0;
		this.setTimeout();
	}

	destroy () {
		this.queue.splice(0);
		clearTimeout(this.timeoutHandle);
	}

	push (...items) {
		this.queue.push(...items);

		if (this.queue.length >= this.batchSize) {
			this.process();
		}

		return this;
	}

	process () {
		if (this.queue.length && this.runningCallbacks < this.concurrency) {
			this.runningCallbacks++;

			// eslint-disable-next-line promise/catch-or-return
			this.callback(this.queue.splice(0, this.batchSize)).finally(() => {
				this.runningCallbacks--;

				if (this.queue.length >= this.batchSize) {
					this.process();
				}
			});

			this.process();
		}

		this.setTimeout();
	}

	setTimeout () {
		if (this.timeout) {
			clearTimeout(this.timeoutHandle);
			this.timeoutHandle = setTimeout(() => this.process(), this.timeout);
		}
	}
}

module.exports = BatchQ;
