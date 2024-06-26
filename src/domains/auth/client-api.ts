import { HttpClientFactory } from "@/common/http/client/factory";
import { HttpClient } from "@/common/http/client";
import { UserLogged } from "@/common/auth/user";
import { HttpClientError } from "@/common/http/client/error";
import { AppError } from "@/common/error";
import { GetCurrentUserResult } from "./use-cases/get-current-user-types";

export class AuthApi {

  private _client: HttpClient;

  constructor() {

    this._client = HttpClientFactory.create('auth');
  }

  public async login(args: LoginArgs): Promise<UserLogged> {

    try {
      const result = await this._client.post<UserLogged>('', args);

      if (!result)
        throw new Error('Server did not return results');

      return result;
    }
    catch(error) {

      if (HttpClientError.is(error) && error.statusCode == 401)
        throw new AppError('Email/Senha inválido');

      throw error;
    }
  }

  public async logout(): Promise<void> {

    await this._client.delete<void>('');
  }

  public async getCurrentUser(): Promise<GetCurrentUserResult | null> {

    const result = await this._client.get<GetCurrentUserResult>('');
    return result ?? null;
  }
}

export interface LoginArgs {
  email: string;
  password: string;
}