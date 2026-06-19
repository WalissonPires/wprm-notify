export interface IQueueOptions {
  concurrency?: number;
}

export interface IQueue {
  add<T>(task: () => Promise<T>): Promise<T>;
  onIdle(): Promise<void>;
}
