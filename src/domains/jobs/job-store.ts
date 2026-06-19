import { IdGenerator } from '@/common/identity/generate';
import { Job } from './job-types';

const TTL_MS = 60 * 60 * 1000; // 1 hour

export class JobStore {
  private static instance: JobStore;
  private jobs = new Map<string, Job>();
  private idGenerator = new IdGenerator();

  private constructor() {}

  public static getInstance(): JobStore {
    if (!JobStore.instance) {
      JobStore.instance = new JobStore();
    }
    return JobStore.instance;
  }

  public create<TMetadata>(type: string, accountId: string, total: number, metadata?: TMetadata): Job<TMetadata> {
    this.cleanup();

    const id = this.idGenerator.new();
    const job: Job<TMetadata> = {
      id,
      accountId,
      type,
      status: 'pending',
      progress: {
        total,
        success: 0,
        failed: 0,
      },
      metadata,
      createdAt: new Date(),
    };

    this.jobs.set(id, job);
    return job;
  }

  public get<TMetadata>(id: string): Job<TMetadata> | undefined {
    return this.jobs.get(id) as Job<TMetadata> | undefined;
  }

  public start(id: string): void {
    const job = this.jobs.get(id);
    if (job) {
      job.status = 'running';
      job.startedAt = new Date();
    }
  }

  public incrementSuccess(id: string): void {
    const job = this.jobs.get(id);
    if (job) {
      job.progress.success += 1;
    }
  }

  public incrementFailure(id: string): void {
    const job = this.jobs.get(id);
    if (job) {
      job.progress.failed += 1;
    }
  }

  public finish(id: string, error?: string): void {
    const job = this.jobs.get(id);
    if (job) {
      job.status = error ? 'failed' : 'completed';
      job.error = error;
      job.finishedAt = new Date();
    }
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [id, job] of Array.from(this.jobs.entries())) {
      if ((job.status === 'completed' || job.status === 'failed') && job.finishedAt) {
        if (now - job.finishedAt.getTime() > TTL_MS) {
          this.jobs.delete(id);
        }
      }
    }
  }
}
export const jobStore = JobStore.getInstance();
