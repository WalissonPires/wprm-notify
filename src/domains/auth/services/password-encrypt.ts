import { createHash } from "crypto";


export class PasswordEncrypt {

  public encrypt(password: string): Promise<string> {

    const hash = createHash('sha256').update(password).digest('hex');
    return Promise.resolve(hash);
  }
}