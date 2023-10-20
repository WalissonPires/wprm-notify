import { NextRequest } from "next/server";


export class UserLogged {
  accountId: string = '';
  isLogged: boolean = false;

  public static fromRequest(request: NextRequest): UserLogged {

    const user = new UserLogged();
    user.accountId = 'TCfzwzSTIZJ4g981TubK1wwMIQ';
    user.isLogged = true;

    return user;
  }
}