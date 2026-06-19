export type JobStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface JobProgress {
  total: number;
  success: number;
  failed: number;
}

export interface Job<TMetadata = any> {
  id: string;
  accountId: string;
  type: string;
  status: JobStatus;
  progress: JobProgress;
  metadata?: TMetadata;
  error?: string;
  createdAt: Date;
  startedAt?: Date;
  finishedAt?: Date;
}
