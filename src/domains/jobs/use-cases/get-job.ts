import { UseCase } from "@/common/use-cases";
import { UserLogged } from "@/common/auth/user";
import { AppError } from "@/common/error";
import { Job } from "../job-types";
import { jobStore } from "../job-store";

export interface GetJobInput {
  jobId: string;
}

export class GetJob implements UseCase<GetJobInput, Job> {
  private _user: UserLogged;

  constructor({ userLogged }: { userLogged: UserLogged }) {
    this._user = userLogged;
  }

  public async execute(input: GetJobInput): Promise<Job> {
    const job = jobStore.get(input.jobId);

    if (!job) {
      throw new AppError("Job não encontrado");
    }

    if (job.accountId !== this._user.accountId) {
      throw new AppError("Não autorizado a acessar este Job");
    }

    return job;
  }
}
