import PQueue from 'p-queue';
import { IQueue, IQueueOptions } from './index';

export class PQueueAdapter implements IQueue {
  private queue: PQueue;

  constructor(options?: IQueueOptions) {
    this.queue = new PQueue({
      concurrency: options?.concurrency,
    });
  }

  async add<T>(task: () => Promise<T>): Promise<T> {
    return this.queue.add(task);
  }

  async onIdle(): Promise<void> {
    return this.queue.onIdle();
  }
}
