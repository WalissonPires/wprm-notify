import { UseCase } from "@/common/use-cases";
import { UserSessionManager } from "@/domains/auth/services/user-session-maganer";

export class Logout implements UseCase<void, void> {

  public execute(_: void): Promise<void> {

    return new UserSessionManager().removeUser();
  }

}