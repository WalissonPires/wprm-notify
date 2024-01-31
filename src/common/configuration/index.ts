import { AppError } from "../error";

export class AppConfig {

  public logLevel() {

    const level = process.env.LOG_LEVEL;
    return level ?? 'warn';
  }

  public logPath() {

    const path = process.env.LOG_PATH;
    return path ?? './logs';
  }

  public SendMessageApiUrl() {

    const url = process.env.SEND_MESSAGE_API_URL;
    if (!url)
      throw new AppError('SEND_MESSAGE_API_URL is empty');

    return url;
  }

  public CookiePrivateKey() {

    const privateKey = process.env.COOKIE_PRIVATE_KEY;
    if (!privateKey)
      throw new AppError('COOKIE_PRIVATE_KEY is empty');

    return privateKey;
  }
}