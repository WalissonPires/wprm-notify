import { UseCase } from "@/common/use-cases";
import { UserLogged } from "@/common/auth/user";
import { UserSessionManager } from "@/domains/auth/services/user-session-maganer";


export class GetCurrentUser implements UseCase<void, UserLogged | null> {

  public async execute(_: void): Promise<UserLogged | null> {

    const user = await new UserSessionManager().getUser();
    return user;
  }

}