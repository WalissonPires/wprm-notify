import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { AppConfig } from "@/common/configuration";
import { UserLogged } from "@/common/auth/user";
import { AppError } from "@/common/error";


export class UserSessionManager {

  public async getUser(): Promise<UserLogged | null> {

    const config = new AppConfig();
    const session = await getIronSession(cookies(), { password: config.CookiePrivateKey(), cookieName: 'user-auth'});
    const user = (session as any).user as UserLogged;

    return user ?? null;
  }

  public async getUserOrThrow(): Promise<UserLogged> {

    const user = await this.getUser();
    if (!user)
      throw new AppError('User not authenticate');

    return user;
  }

  public async setUser(user: UserLogged): Promise<void> {

    const config = new AppConfig();
    const session = await getIronSession(cookies(), { password: config.CookiePrivateKey(), cookieName: 'user-auth'});
    (session as any).user =  user;

    await session.save();
  }

  public async removeUser(): Promise<void> {

    const config = new AppConfig();
    const session = await getIronSession(cookies(), { password: config.CookiePrivateKey(), cookieName: 'user-auth'});
    session.destroy();

    return Promise.resolve();
  }
}