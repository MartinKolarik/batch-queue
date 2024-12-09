declare module 'batch-q' {
	interface BatchQueueOptions {
		batchSize?: number;
		concurrency?: number;
		timeout?: number;
	}

	class BatchQueue<T> {
		constructor (callback: (items: T[]) => Promise<void>, options?: BatchQueueOptions);

		destroy (): void;

		push (...items: T[]): this;

		private process (): void;

		private setTimeout (): void;
	}

	export = BatchQueue;
}
