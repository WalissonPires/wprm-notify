import { HttpClientFactory } from "@/common/http/client/factory";
import { HttpClient } from "@/common/http/client";
import { Job } from "./job-types";

export class JobsApi {
  private _client: HttpClient;

  constructor() {
    this._client = HttpClientFactory.create('jobs');
  }

  public async getStatus<TMetadata>(jobId: string): Promise<Job<TMetadata>> {
    const result = await this._client.get<Job<TMetadata>>(`${jobId}`);
    if (!result) {
      throw new Error('Server did not return job data');
    }
    return result;
  }
}
