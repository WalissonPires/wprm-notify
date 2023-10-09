import { AppError } from "../error";

export class AppConfig {

  public SendMessageApiUrl() {

    const url = process.env.SEND_MESSAGE_API_URL;
    if (!url)
      throw new AppError('SEND_MESSAGE_API_URL is empty');

    return url;
  }

  public SendMessageApiToken() {

    const token = process.env.SEND_MESSAGE_API_TOKEN;
    if (!token)
      throw new AppError('SEND_MESSAGE_API_TOKEN is empty');

    return token;
  }
}